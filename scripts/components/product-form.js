import * as currency from '@shopify/theme-currency';
import * as cart from '@shopify/theme-cart';

/*
 * ProductForm Class
 * 
 * A custom class that extends HTMLElement.
 * Handles the feedback for the form and updates
 * prices and inputs.
 */
class ProductForm extends HTMLElement {

    constructor() {
        super();

        this.formSelector = '[data-product-form]';
        this.purchaseOptionSelector = '[data-purchase-option-selector]';
        this.singlePlanSelector = '[data-single-plan-selector]';

        this.form = this.querySelector(this.formSelector) || false;
        this.VariantSelectors = this.querySelector('variant-selectors') || false;
        this.SellingPlans = this.querySelector('selling-plan') || false;

        this.currentVariant;

        if (!this.form) return;

        const productHandle = this.form.dataset.productHandle;

        // Fetch the product data from the .js endpoint because it includes
        // more data than the .json endpoint. Alternatively, you could inline the output
        // of {{ product | json }} inside a <script> tag, with the downside that the
        // data can never be cached by the browser.
        fetch(`/products/${productHandle}.js`)
            .then(response => {
                return response.json();
            })
            .then(productJSON => {

                this.form.dataset.product = JSON.stringify(productJSON);
                this.form.addEventListener('submit', this.onFormSubmit.bind(this));

                this.updateCurrentVariant();
                this.updateMainImage();
            });
    };

    /*
     * On form change callback
     */
    handleFormChange() {

        this.updatePricing();
        this.updateId();
        this.updateMainCTA();
        this.updateStockNotice();
        this.updateSellingPlan();
        this.updateMainImage();
        this.updateHistoryState();

        this.dispatchEvent(Events().formUpdated._event(this.form));
    };

    setUpForm() {
        this.updatePricing();
        this.updateId();
        this.updateMainCTA();
        this.updateStockNotice();
        this.updateSellingPlan();
    }

    updateHistoryState() {
        // Create the new URL with the variant ID
        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?variant=' + this.currentVariant.id;

        // Add the variant ID to the URL without causing a page refresh
        history.pushState({ path: newUrl }, '', newUrl);
    }

    updateCurrentVariant() {

        if (this.VariantSelectors == false) return;

        this.currentVariant = this.VariantSelectors.getCurrentVariant();
    }

    enableLoading() {
        this.setAttribute("aria-busy", "true");
    }

    disableLoading() {
        this.setAttribute("aria-busy", "false");
    }

    updateId() {

        const variant = this.currentVariant;
        const idSelector = this.form.querySelector('[name="id"]');

        if (idSelector === undefined) return false;
        idSelector.value = parseInt(variant.id);
    }

    /*
     * On form submit callback
     *
     * Uses the Cart Object from Shopify Scripts
     */
    onFormSubmit(event) {

        event.preventDefault();

        this.submitForm();
    };

    submitForm() {

        this.enableLoading();

        let formData = new FormData(this.form);

        fetch(`${window.theme.routes.cart_add_url}`, {
            method: 'POST',
            body: formData
        })
            .then(response => {

                const item = response.json();

                document.dispatchEvent(Events().itemAdded._event(item));

                cart.getState().then(state => {

                    document.dispatchEvent(Events().cartUpdated._event(state));
                    document.querySelector('cart-items').getSectionInnerHTML();

                    this.disableLoading();
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {

                const miniCart = document.querySelector('[data-mini-cart]') || false;

                if (!miniCart) return;

                miniCart.setAttribute("aria-hidden", "false");
                document.querySelector('body').classList.add('overflow-hidden');
                miniCart.querySelector('drawer-trigger').triggerStatus();
            });
    }

    getPricing() {

        let prices = {};

        if (!this.SellingPlans) {
            prices['price'] = this.currentVariant.price;
            prices['compare_at_price'] = this.currentVariant.compare_at_price;

            return prices;
        }

        if (this.SellingPlans.getPurchaseType() == "one_time") {

            prices['price'] = this.currentVariant.price;
            prices['compare_at_price'] = this.currentVariant.compare_at_price;

            return prices;
        }

        const plan = this.currentVariant.selling_plan_allocations.find(selling_plan => {
            return selling_plan.selling_plan_id == this.SellingPlans.getSellingPlanID();
        });

        if (Object.keys(plan).length !== 0 && this.SellingPlans.getPurchaseType() == "subscription") {
            prices['price'] = plan.price;
            prices['compare_at_price'] = plan.compare_at_price;
        }

        return prices;
    }

    /*
     * Update the form Pricing
     * Pass through the form object
     */
    updatePricing() {

        const prices = this.getPricing();

        const priceElement = this.querySelector('[data-product-price]');
        const comparePriceElement = this.querySelector('[data-product-compare-price]');

        let price, comparePrice;

        price = prices.price;
        comparePrice = prices.compare_at_price;

        // Return if there is no price element in the form
        if (priceElement === undefined) return false;

        priceElement.innerHTML = currency.formatMoney(price, window.theme.moneyFormat);

        if (comparePrice > price) {
            comparePriceElement.classList.remove("hidden");
            comparePriceElement.innerHTML = currency.formatMoney(comparePrice, window.theme.moneyFormat);
        } else {
            comparePriceElement.classList.add("hidden");
        }
    };

    /*
     * Update the stock notice
     * Show if the item is in stock or not.
     * Can't show the amount in stock as that information is
     * not availble on a per variant basis.
     */
    updateStockNotice() {

        const variant = this.currentVariant;
        const stockNotice = this.querySelector('[data-product-stock-notice]');

        // Return if there is no stock notice in the form
        if (stockNotice === undefined || stockNotice === null) return false;

        if (variant.available) {
            stockNotice.innerHTML = `<p class="font-bold text-green-500">${window.theme.strings.inStock}</p>`;
        } else {
            stockNotice.innerHTML = `<p class="font-bold text-red-500">${window.theme.strings.soldOut}</p>`;
        }
    };

    updateMainImage() {

        const gallery = document.querySelector(`[data-product-gallery="${this.dataset.productId}"]`) || false;

        if (!gallery) return;

        if (this.currentVariant.featured_media === undefined || this.currentVariant.featured_media === null) return;

        const featuredMedia = document.querySelector(`[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`);

        if (!gallery || !featuredMedia) return;

        gallery.insertBefore(featuredMedia, gallery.firstChild);
        gallery.scrollTo({ left: 0 });
        window.scrollTo(0, 0);
    }

    updateSellingPlan() {

        if (!this.SellingPlans) return;

        const sellingPlan = this.form.querySelector('[name="selling_plan"]');

        if (this.SellingPlans.getPurchaseType() == "one_time") {
            sellingPlan.disabled = true;
            return;
        }

        sellingPlan.disabled = false;
        this.SellingPlans.setSellingPlanID();
    }

    /*
     * Update the main CTA
     * Disable the CTA if not available.
     */
    updateMainCTA() {

        const variant = this.currentVariant;
        const cta = this.form.querySelector('[name="add"]');

        // Return if there is no main CTA
        if (cta === undefined || cta === null) return false;

        if (variant.available) {
            cta.disabled = false;
        } else {
            cta.disabled = true;
        }
    }
}

customElements.define('product-form', ProductForm);

class VariantSelectors extends HTMLElement {

    constructor() {
        super();

        this.productForm = this.closest('product-form');
        this.addEventListener('change', this.handleOnChange);
    }

    handleOnChange(e) {

        e.stopPropagation();

        this.productForm.currentVariant = this.getCurrentVariant();
        this.productForm.handleFormChange();
    }

    getVariantData() {
        return JSON.parse(this.querySelector('[type="application/json"]').textContent);
    }

    getCurrentVariant() {

        const options = Array.from(this.querySelectorAll('[data-option-selector]'), (select) => select.value);

        return this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return options[index] === option;
            }).includes(false);
        });
    }
}

customElements.define('variant-selectors', VariantSelectors);

class VariantRadios extends VariantSelectors {
    constructor() {
        super();
    }

    getCurrentVariant() {

        const fieldsets = Array.from(this.querySelectorAll('fieldset'));

        const options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });

        return this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return options[index] === option;
            }).includes(false);
        });
    }
}

customElements.define('variant-radios', VariantRadios);

class SellingPlan extends HTMLElement {

    constructor() {
        super();

        this.productForm = this.closest('product-form');
        this.sellingPlan = this.querySelector('select');

        this.addEventListener('change', this.handleOnChange.bind(this));
        this.setSellingPlanID();
    }

    handleOnChange(e) {

        e.stopPropagation();

        const purchaseType = this.getPurchaseType();

        this.sellingPlan.disabled = false;

        if (purchaseType == "one_time") {
            this.sellingPlan.disabled = true;
        }

        this.productForm.handleFormChange();
    }

    getPurchaseType() {
        return this.querySelector('input[type="radio"]:checked').value;
    }

    getSellingPlanID() {
        return this.sellingPlan.value;
    }

    setSellingPlanID() {
        const form = this.productForm.querySelector(`#${this.sellingPlan.getAttribute("form")}`) || false;

        if (!form) return;

        form.querySelector('input[name="selling_plan"]').value = this.getSellingPlanID();
    }
}

customElements.define('selling-plan', SellingPlan);