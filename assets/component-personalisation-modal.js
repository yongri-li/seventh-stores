class PersonalisationModal extends HTMLElement {
  constructor() {
    super();

    this.loggedIn = this.dataset.loggedIn;
    this.delay = 5000;
    this.cookieExpiry = 1;

    this.closeButton = this.querySelector('[data-close]');

    if (this.isHidden() == "" || this.isHidden() == "false") this.setHidden(false);

    this.determineModal();

    this.closeButton.addEventListener('click', () => {
      this.hideModal();
      this.setHidden(true);
    });
  }

  showModal() {
    this.classList.add('is--visible');
  }

  hideModal() {
    this.classList.remove('is--visible');
  }

  determineModal() {

    const _this = this;

    if (_this.loggedIn == "false" && (_this.isHidden() == 'false' || _this.isHidden() == '')) {

      setTimeout(function () {
        _this.showModal();
      }, _this.delay);
    }
  }

  setHidden(visibility) {
    window.setCookie('personalisation_modal_shown', visibility, this.cookieExpiry);
  }

  isHidden() {
    return window.getCookie('personalisation_modal_shown');
  }
}

customElements.define('personalisation-modal', PersonalisationModal);