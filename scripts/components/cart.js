import * as currency from '@shopify/theme-currency';
import * as cart from '@shopify/theme-cart';

class CartRemoveButton extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('click', (event) => {
            event.preventDefault();
            this.closest('cart-items').removeItem(event.currentTarget.dataset.itemKey);
        });
    }
}

customElements.define('cart-remove-button', CartRemoveButton);

class QuantitySelector extends HTMLElement {
    constructor() {
        super();

        this.querySelector('[data-button-minus]').addEventListener('click', this.minus.bind(this));
        this.querySelector('[data-button-plus]').addEventListener('click', this.add.bind(this));
    }

    add() {

        const input = this.querySelector('[name="quantity"]');

        let inputValue = parseInt(input.value);
        const newValue = inputValue += 1;

        input.value = newValue;
        this.closest('cart-items').updateItem(this.dataset.key, newValue);
    }

    minus() {

        const input = this.querySelector('[name="quantity"]');

        let inputValue = parseInt(input.value);
        const newValue = (inputValue < 0 ? 0 : inputValue -= 1);

        if (newValue == 0) {
            this.closest('cart-items').removeItem(this.dataset.key);
        } else {
            input.value = newValue;
            this.closest('cart-items').updateItem(this.dataset.key, newValue);
        }
    }
}

customElements.define('quantity-selector', QuantitySelector);

class CartItems extends HTMLElement {

    constructor() {
        super();

        this.debouncedRemoveItem = debounce((event) => {
            this.removeItem(event.currentTarget.dataset.itemKey);
        }, 300);

        this.listeners();
    }

    listeners() {

        if (this.querySelector('form') !== undefined && this.querySelector('form') !== null) {
            this.querySelector('form').addEventListener('change', this.getSectionInnerHTML.bind(this));
        }
    }

    enableLoading() {
        this.setAttribute("aria-busy", "true");
    }

    disableLoading() {
        this.setAttribute("aria-busy", "false");
    }

    getSectionInnerHTML() {

        this.enableLoading();

        fetch(`${theme.routes.cart_url}`)
            .then(response => response.text())
            .then(text => {

                const cart = new DOMParser()
                    .parseFromString(text, "text/html");

                this.getSectionsToRender().forEach((section) => {

                    console.log('section: ', section);

                    if (cart.getElementById(section.id) !== undefined && cart.getElementById(section.id) != null) {
                        const html = cart.getElementById(section.id).innerHTML;
                        document.getElementById(section.id).innerHTML = html;
                    }
                });
            })
            .catch(e => {
                console.error(e);
            })
            .finally(e => {
                this.disableLoading();
            });
    }

    getSectionsToRender() {
        return [
            {
                id: 'cart-items-container'
            },
            {
                id: 'cart-prices'
            },
            {
                id: 'cart-countdown'
            }
        ];
    };

    removeItem(itemKey) {

        this.enableLoading();

        cart.removeItem(itemKey).then(state => {
            document.dispatchEvent(Events().itemRemoved._event(state));
            document.dispatchEvent(Events().cartUpdated._event(state));

            this.getSectionInnerHTML();
        });
    }

    updateItem(itemKey, quantity) {

        this.enableLoading();

        cart.updateItem(itemKey, { quantity }).then(state => {
            var item = state.items.find(item => item.key === itemKey);

            document.dispatchEvent(Events().itemUpdated._event(item));
            document.dispatchEvent(Events().cartUpdated._event(state));

            this.getSectionInnerHTML();
        });
    }
}

customElements.define('cart-items', CartItems);