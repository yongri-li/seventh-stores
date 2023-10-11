class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('ul');
    this.sliderItems = Array.from(this.slider.querySelectorAll('li')).filter(function (a) { return a.parentNode === this.slider; }, this);
    this.pageCount = this.querySelector('.slider-counter--current') || document.querySelector(`${this.dataset.pageCount}`);
    this.pageTotal = this.querySelector('.slider-counter--total') || document.querySelector(`${this.dataset.pageTotal}`);
    this.prevButton = this.querySelector('button[name="previous"]') || document.querySelector(`${this.dataset.previousButton}`);
    this.nextButton = this.querySelector('button[name="next"]') || document.querySelector(`${this.dataset.nextButton}`);

    if (!this.slider) return;

    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));

    if (this.prevButton) {
      this.prevButton.addEventListener('click', (e) => {
        this.onButtonClick(e);
      });
    };

    if (this.nextButton) {
      this.nextButton.addEventListener('click', (e) => {
        this.onButtonClick(e);
      });
    };
  }

  initPages() {
    const sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
    this.sliderLastItem = sliderItemsToShow[sliderItemsToShow.length - 1];
    if (sliderItemsToShow.length === 0) return;
    this.slidesPerPage = Math.floor(this.slider.clientWidth / sliderItemsToShow[0].clientWidth);
    this.totalPages = sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) + 1;

    if (this.prevButton != null || this.prevButton != undefined) {
      if (this.currentPage === 1) {
        this.prevButton.setAttribute("disabled", true);
      } else {
        this.prevButton.removeAttribute("disabled");
      }
    }

    if (this.nextButton != null || this.nextButton != undefined) {

      const endOfScroll = Math.abs(this.slider.scrollLeft) === this.slider.scrollWidth - this.slider.clientWidth;

      if (endOfScroll) {
        this.nextButton.setAttribute("disabled", true);
      } else {
        this.nextButton.removeAttribute("disabled");
      }
    }

    if (this.pageCount) {
      this.pageCount.textContent = this.currentPage;
    }

    if (this.pageTotal) {
      this.pageTotal.textContent = this.totalPages;
    }

    this.updateDots(this.currentPage);
  }

  updateDots(count) {

    const dots = this.querySelectorAll('.dots .dot') || false;

    if (!dots) return;

    dots.forEach((dot, index) => {

      const realIndex = index + 1;
      dot.classList.remove('active');

      if (realIndex == count) {
        dot.classList.add('active');
      }
    });
  }

  onButtonClick(event) {
    event.preventDefault();

    const slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + this.sliderLastItem.clientWidth : this.slider.scrollLeft - this.sliderLastItem.clientWidth;

    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }
}

customElements.define('slider-component', SliderComponent);