// class CountdownPromo {

class CountdownComponent extends HTMLElement {

    constructor() {

        super();

        this.countdownContent = this.querySelector('[data-countdown-content]');

        this.day = this.dataset.day;
        this.month = this.dataset.month;
        this.year = this.dataset.year;
        this.hour = this.dataset.hour;
        this.minute = this.dataset.minute;
        this.second = this.dataset.second;
        this.daysToShow = this.dataset.daysToShow;
        this.showCountdown = this.dataset.showCountdown;
        this.showDays = this.dataset.showDays;
        this.showTime = this.dataset.showTime;
        this.showWhenExpired = this.dataset.showWhenExpired;
        this.expiredMessage = this.dataset.expiredMessage;
        this.countTo = this.dataset.countTo;

        this.listeners();
    }

    getDate() {

        return `${this.month} ${this.day}, ${this.year}`;
    };

    getTime() {

        return `${this.hour}:${this.minute}:${this.second}`;
    };

    getFullDate() {

        if (this.countTo == 'date') {

            return new Date(this.getDate()).getTime();

        } else if (this.countTo == 'time') {

            const date = new Date();
            date.setHours(this.hour);
            date.setMinutes(this.minute);
            date.setSeconds(this.second);

            return date.getTime();

        } else {

            return new Date(this.getDate() + ' ' + this.getTime()).getTime();
        }
    };

    checkDay() {

        const days = this.daysToShow.split(","),
            today = new Date().getDay(),
            show = false;

        for (const day in days) {
            if (day == today) {
                this.classList.add('block');
                return;
            }
        }
    };

    replaceString() {

        const string = this.countdownContent.innerText;

        if (string.includes('{countdown}')) {

            const replacement = string.replace('{countdown}', '<span data-countdown-time></span>');
            this.countdownContent.innerHTML = replacement;
        }
    };

    buildCountdown(days, hours, minutes, seconds) {

        if (document.querySelector('[data-countdown-time]').length < 1) {
            return;
        }

        let string = "";

        if (this.showDays) {
            string += `${days}D `;
        }

        if (this.showTime) {
            string += `${hours}H ${minutes}M ${seconds}S`;
        }

        document.querySelector('[data-countdown-time]').innerText = string;

        if (this.getAttribute('aria-hidden') == "true") {
            this.setAttribute('aria-hidden', 'false');
        }
    };

    timeInterval() {

        const _this = this;

        const countDownDate = this.getFullDate();

        const interval = setInterval(function () {

            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            _this.buildCountdown(days, hours, minutes, seconds);

            // If the count down is finished, write some text
            if (distance < 0) {

                clearInterval(interval);

                if (_this.showWhenExpired) {
                    _this.countdownContent.innerText = _this.expiredMessage;
                } else {
                    _this.setAttribute('aria-hidden', 'true');
                }
            }

        }, 1000);
    };

    // Run listeners
    listeners() {

        this.checkDay();
        this.replaceString();
        this.timeInterval();
    };
};

customElements.define('countdown-component', CountdownComponent);

// const countdown = new CountdownPromo();

// countdown.init();