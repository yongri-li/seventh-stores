class CartJS {

  constructor(cart, routes, options) {

    this.scope = cart;

    this.moneyFormat = options?.moneyFormat || "${{amount}}";

    this.routes = routes;
    this.cart = document.querySelector('[data-cart]');
    this.cartRender = document.querySelectorAll('[data-cart-render]');
    this.cartTotal = document.querySelectorAll('[data-cart-total]');
    this.cartItems = document.querySelectorAll('[data-cart-items]');

    this.productForms = document.querySelectorAll('[cjs-product-form]');

    this.initialise();
  }

  initialise() {

    this.listenerProductForm();
  }

  listenerProductForm() {

    this.productForms.forEach((form) => {
      const productForm = form.querySelector('form');
      productForm.addEventListener('change', this.productFormOnChange.bind(this, form));
    });
  }

  async productFormOnChange(form) {

    const handle = form.dataset.productHandle;
    const url = `/products/${handle}.js`;

    const productJSON = await this.getHelper(url);

    this.renderProductForm(productJSON, form);
  }

  renderSwitch(item, value) {

    if (item.dataset.render == "html") {
      item.innerHtml = value;
      return;
    }

    if (item.dataset.render == "text") {
      item.textContent = value;
      return;
    }

    if (item.dataset.render == "value") {
      item.value = value;
      return;
    }

    if (item.dataset.render == "show") {
      const params = item.dataset.show;

      return;
    }
  }

  listenerQuantity() {

  }

  listenerRemove() {

  }

  listenerAdd() {

  }

  defineProperty() {

  }

  renderProductForm(product, form) {

    const renderItems = Array.from(form.querySelectorAll('[data-product-render]')).map((input => input.dataset.productRender));

    console.log(renderItems);
    console.log(product);

    renderItems.forEach((item) => {
      const itemValue = product[item];
      console.log(itemValue);
    });
  }

  formatMoney() {

    if (typeof cents == 'string') { cents = cents.replace('.', ''); }
    const value = '';
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

  async renderTotals() {

  }

  async renderCartItems() {

  }

  async addItem() {

  }

  async removeItem() {

  }

  async updateItem() {

  }

  async clearCart() {

  }

  async getHelper(fetchUrl) {
    return await fetch(`${fetchUrl}`)
      .then(response => {
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  async postHelper(fetchUrl, data) {

    return await fetch(`${window.Shopify.routes.root}${fetchUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}