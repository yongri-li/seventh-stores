import * as currency from '@shopify/theme-currency';
import * as cart from '@shopify/theme-cart';

/*
 * QuickAdd Class
 * 
 * A custom class that extends HTMLElement.
 * Handles the feedback for the form and updates
 * prices and inputs.
 */
class QuickAdd extends HTMLElement {

    constructor() {
        super();
    }
}

customElements.define('quick-add', QuickAdd);

class QuickAddTrigger extends HTMLElement {

    constructor() {
        super();

        this.target = this.dataset.target;
        this.addEventListener('click', this.toggleQuickAdd.bind(this));

        document.addEventListener('keyup', function (e) {

            if (e.key === "Escape") {
                const visibleQuickAdds = document.querySelectorAll('quick-add[aria-hidden="false"]');
                visibleQuickAdds.forEach((quickAdd) => {
                    quickAdd.setAttribute('aria-hidden', true);
                });
            }
        });
    }

    toggleQuickAdd() {

        const target = document.getElementById(this.target);

        if (target.getAttribute('aria-hidden') == "true") {
            target.setAttribute('aria-hidden', false);
            document.querySelector('body').classList.add('no--scroll');
        } else {
            target.setAttribute('aria-hidden', true);
            document.querySelector('body').classList.remove('no--scroll');
        }
    }
}

customElements.define('quick-add-trigger', QuickAddTrigger);