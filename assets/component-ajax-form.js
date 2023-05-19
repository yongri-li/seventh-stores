class AjaxForm extends HTMLElement {

  constructor() {
    super();

    this.form = this.querySelector('form');
    this.product = JSON.parse(this.querySelector('[type="application/json"]').textContent);
    this.currentVariant = this.getCurrentVariant();
    this.renderProperties = Array.from(document.querySelectorAll(`[data-product="${this.product.id}"][data-prop]`)).map((render) => render.dataset.prop);

    this.currentVariant = {};

    this.initialise();
    this.form.addEventListener('change', this.handleFormChange.bind(this));

    // console.log('Current Variant: ', this.currentVariant);
  }

  initialise() {

    this.currentVariant = this.getCurrentVariant();

    this.render();
  }

  handleFormChange() {

    this.currentVariant = this.getCurrentVariant();

    this.render();
    this.updateVariantSelectors();

    // console.log("handleFormChange: ", this.currentVariant);
  }

  render() {
    const _this = this;

    this.renderProperties.forEach((prop) => {
      const item = document.querySelector(`[data-product="${this.product.id}"][data-prop="${prop}"]`) || false;
      // console.log("RENDER: ", item);
      if (item) _this.renderType(item, prop);
    });
  }

  renderType(item, prop) {

    const propertyValue = this.renderFormat(item, prop);

    console.log("propertyValue: ", propertyValue);

    if (item.dataset.render === "html") {
      item.innerHTML = propertyValue;
    }

    if (item.dataset.render === "value") {
      item.value = propertyValue;
    }

    if (item.dataset.render === "buy_now") {
      item.disabled = !propertyValue;
    }
  }

  renderFormat(item, prop) {

    if (item.dataset.format == "undefined" || item.dataset.format == null) return this.currentVariant[prop];

    // console.log("renderFormat: ", item.dataset.format);

    if (item.dataset.format === "money") {
      return this.formatMoney(this.currentVariant[prop], window.theme.moneyFormat);
    }

    return this.currentVariant[prop];
  }

  updateVariantSelectors() {

    let variantSelectors = false;

    console.log("updateVariantSelectors: ", this.currentVariant);

    if (this.dataset.variantType == "selects") {
      variantSelectors = document.querySelectorAll(`select[form="${this.form.getAttribute("id")}"]`);
    }

    if (this.dataset.variantType == "radios") {
      variantSelectors = document.querySelectorAll(`input[form="${this.form.getAttribute("id")}"]`);
    }

    console.log("variantSelectors: ", variantSelectors);

    return variantSelectors;
  }

  getCurrentVariant() {

    let options = '';
    const productJSON = JSON.parse(this.querySelector('[type="application/json"]').textContent);

    if (this.dataset.variantType == "selects") {
      options = Array.from(document.querySelectorAll(`select[form="${this.form.getAttribute("id")}"]`), (select) => select.value);
    }

    if (this.dataset.variantType == "radios") {
      options = Array.from(document.querySelectorAll(`input[form="${this.form.getAttribute("id")}"]`)).find((radio) => radio.checked).value;
    }

    return productJSON.variants.find((variant) => {
      return !variant.options.map((option, index) => {
        return options[index] === option;
      }).includes(false);
    });
  }

  formatMoney(cents, format) {

    if (typeof cents == 'string') { cents = cents.replace('.', ''); }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = (format || this.moneyFormat);

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) { return 0; }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }
}

customElements.define('ajax-form', AjaxForm);
