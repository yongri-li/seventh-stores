/*
 * DiscountCodes Class
 * 
 * A custom class that extends HTMLElement.
 * Handles the feedback for the form and updates
 * prices and inputs.
 */
class DiscountCodes extends HTMLElement{

    constructor() {
        super();

        this.banner = this.querySelector('[data-banner]');
        this.close = this.querySelector('[data-close]');
        this.cookie = this.querySelector('[data-cookie]');

        this.toggleBanner();
        this.listeners();
    };

    listeners(){
        
        if( this.close === undefined || this.close === null ){
            return;
        }

        this.close.addEventListener('click', this.hideBanner.bind(this));
    }

    toggleBanner() {

        if(!window.hasCookie('discount_code')){

            this.hideBanner();
        
        }else{

            const cookie = window.getCookie('discount_code');

            this.cookie.innerHTML = cookie;
            this.showBanner();
        }
    }

    showBanner() {

        this.banner.classList.remove('hidden');
    }

    hideBanner() {

        this.banner.classList.add('hidden');
    }


}

customElements.define('discount-codes', DiscountCodes);