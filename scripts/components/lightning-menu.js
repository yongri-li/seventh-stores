class LightningMenu extends HTMLElement{

    constructor(){
      super();

        if( window.hasCookie('show_lightning') ){
            if( window.getCookie('show_lightning') == 'true' ){
                this.active();
            }
        }
    }

    active(){
        this.classList.add('is--visible');
    }

    disabled(){
        this.classList.remove('is--visible');
    }

    showMenu(){
        window.setCookie('show_lightning', 'true', (7*24*60*60));
        this.active();
    }

    hideMenu(){
        window.setCookie('show_lightning', 'false', (7*24*60*60));
        this.disabled();
    }
}

customElements.define('lightning-menu', LightningMenu);

class LightningToggle extends HTMLElement{
    constructor(){
        super();

        this.menu = document.querySelector('lightning-menu');
        this.addEventListener('click', this.toggle.bind(this));

        if( window.hasCookie('show_lightning') ){
            if( window.getCookie('show_lightning') == 'true' ){
                this.active();
            }
        }
    }
    
    toggle(){

        if( this.classList.contains('is--active') ){
            this.disabled();
            this.menu.hideMenu();
        }else{
            this.active();
            this.menu.showMenu();
        }
    }

    active(){
        this.classList.add('is--active');
    }

    disabled(){
        this.classList.remove('is--active');
    }
}

customElements.define('lightning-toggle', LightningToggle);