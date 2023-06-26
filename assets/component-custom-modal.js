class CustomModal extends HTMLElement {

  constructor() {

    super();

    document.addEventListener('keyup', (e) => {

      if (e.key === "Escape") {
        if (this.classList.contains('active')) {
          this.close();
        }
      }
    });
  }

  open() {

    console.log("Modal Open");

    this.classList.add('active');
    document.querySelector('body')?.classList.add('overflow-hidden');
  }

  close() {

    console.log("Modal Close");

    this.classList.remove('active');
    document.querySelector('body')?.classList.remove('overflow-hidden');
  }
}

customElements.define('custom-modal', CustomModal);

class ModalTrigger extends HTMLElement {

  constructor() {

    super();

    this.target = document.querySelector(`[data-modal="${this.dataset.target}"]`) || false;

    console.log("this.target: ", this.target);

    this.querySelector('button').addEventListener('click', (e) => {

      console.log("this: ", this);

      if (!this.target) return;

      console.log(this.target);

      if (this.target.classList.contains('active')) {
        this.target.close();
      } else {
        this.target.open();
      }
    });
  }
}

customElements.define('modal-trigger', ModalTrigger);