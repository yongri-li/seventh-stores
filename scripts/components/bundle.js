import * as currency from '@shopify/theme-currency';
import * as cart from '@shopify/theme-cart';

class BundleItems extends HTMLElement{
    constructor(){
        super();
    }

}

customElements.define('bundle-items', BundleItems);

class BundleItem extends BundleItems{
    constructor(){
        super();

        this.id = this.dataset.id;

        this.add = this.querySelector('button');
        this.add.addEventListener('click', this.addToBundle.bind(this));
    }

    /*
     * Function to "add" bundle to bundle cart items.
     *
     * This function simply finds the element in bundle cart items
     * and shows it. It also adds a data attribute to say this
     * item can be added to cart.
     */
    addToBundle(){

        const item = document.querySelector(`bundle-cart-item[data-id="${this.id}"]`);
        item.classList.remove('hidden');
        item.classList.add('block');
        item.dataset.added = true;

        document.querySelector('bundle-cart-items').updatePrice();
    }
}

customElements.define('bundle-item', BundleItem);

class BundleCartItems extends HTMLElement{
    constructor(){
        super();

        this.submit = this.querySelector('[data-submit-bundle]');
        this.submit.addEventListener('click', this.submitBundle.bind(this));
    }

    /*
     * Function to update total bundle price.
     */
    updatePrice() {
        
        const items = this.querySelectorAll('bundle-cart-item');
        const totalPriceSelector = this.querySelector('[data-total-price]');

        let totalPrice = 0;

        items.forEach((item) => {
            if( item.dataset.added == "true" ){
                totalPrice += item.getPrice();
            }
        });

        totalPriceSelector.innerHTML = currency.formatMoney(totalPrice, window.theme.moneyFormat);
    }

    /*
     * Function to get ID and Quantities of products to
     * be added to the cart in the Fetch.
     */
    getItemsData() {

        const bundleItems = this.querySelectorAll('bundle-cart-item');
        
        let products = { "items" : [] };

        bundleItems.forEach((item) => {

            if( item.dataset.added == "true" ){

                let data = {
                    id: item.querySelector('[name="id"]').value,
                    quantity: item.querySelector('[name="quantity"]').value
                };

                // Check if there is a selling plan
                const selling_plan = item.querySelector('[name="selling_plan"]');

                if( selling_plan !== undefined && selling_plan !== null ){
                    if( !selling_plan.disabled ){
                        data['selling_plan'] = selling_plan.value;
                    }
                }
                
                products.items.push(data);
            }
        });

        return products;
    }

    /*
     * Function to submit the bundle to cart.
     * 
     * We are using the Shopify Cart AJAX API for this.
     * 
     * A custom event is dispatched to update the cart.
     */ 
    submitBundle(){

        const data = this.getItemsData();

        if( data.items.length == 0 ) return false;
           
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .finally( () => {

            cart.getState().then(state => {

                document.dispatchEvent(Events().cartUpdated._event(state));
                document.querySelector('cart-items').getSectionInnerHTML();
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

customElements.define('bundle-cart-items', BundleCartItems);

class BundleCartItem extends HTMLElement{
    constructor(){
        super();
        
        this.remove = this.querySelector('[data-remove-item]');
        this.remove.addEventListener('click', this.removeFromBundle.bind(this));

        this.querySelector('form').addEventListener('theme:formUpdated',()=>{
            document.querySelector('bundle-cart-items').updatePrice();
        });
    }

    /*
     * Function to get the raw price without formatting.
     */
    getPrice() {

        const price = this.querySelector('[data-product-price]').innerHTML;
        return parseInt(price.replace(/\D/g, ""));
    }

    /*
     * Function to remove the item from bundle cart items
     */
    removeFromBundle() {

        this.classList.add('hidden');
        this.classList.remove('block');
        this.dataset.added = false;

        document.querySelector('bundle-cart-items').updatePrice();
    }
}

customElements.define('bundle-cart-item', BundleCartItem);