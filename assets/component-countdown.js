class CountdownPromo {

    constructor(){

        self = this;

        // Selectors object
        this.cache = {
            countdown: document.querySelector('[data-countdown]'),
            countdownContent: document.querySelector('[data-countdown-content]')
            // time: document.querySelector('[data-countdown-time]')
        };

        this.data = {
            day: this.cache.countdown.dataset.day,
            month: this.cache.countdown.dataset.month,
            year: this.cache.countdown.dataset.year,
            hour: this.cache.countdown.dataset.hour,
            minute: this.cache.countdown.dataset.minute,
            second: this.cache.countdown.dataset.second,
            daysToShow: this.cache.countdown.dataset.daysToShow,
            showCountdown: this.cache.countdown.dataset.showCountdown,
            showDays: this.cache.countdown.dataset.showCays,
            showTime: this.cache.countdown.dataset.showTime,
            showWhenExpired: this.cache.countdown.dataset.showWhenExpired,
            expiredMessage: this.cache.countdown.dataset.expiredMessage,
            countTo: this.cache.countdown.dataset.countTo,
        };
    }

    getDate (){

        return `${this.data.month} ${this.data.day}, ${this.data.year}`;
    };

    getTime (){

        return `${this.data.hour}:${this.data.minute}:${this.data.second}`;
    };

    getFullDate (){

        if( this.data.countTo == 'date' ){

            return new Date( this.getDate() ).getTime();

        }else if( this.data.countTo == 'time' ){

            const date = new Date();
                date.setHours(this.data.hour);
                date.setMinutes(this.data.minute);
                date.setSeconds(this.data.second);

            return date.getTime();

        }else{

            return new Date( this.getDate() + ' ' + this.getTime()).getTime();
        }
    };

    checkDay (){

        const days      = this.data.daysToShow.split(","),
            today       = new Date().getDay(),
            show        = false;

        for( const day in days ){
            if( day == today ){
                this.cache.countdown.classList.add('is--block');
                return;
            }
        }
    };

    replaceString (){

        const string = this.cache.countdownContent.innerText;

        if( string.includes('{countdown}') ){
            
            const replacement = string.replace('{countdown}', '<span data-countdown-time></span>');
            this.cache.countdownContent.innerHTML = replacement;
        }
    };

    buildCountdown (days, hours, minutes, seconds){

        if( document.querySelector('[data-countdown-time]').length < 1 ){
            return;
        }

        let string = "";

        if( this.data.showDays ){
            string += `${days}D `;
        }

        if( this.data.showTime ){
            string += `${hours}H ${minutes}M ${seconds}S`;
        }

        document.querySelector('[data-countdown-time]').innerText = string;
    };

    timeInterval (){
        
        const countDownDate = this.getFullDate();

        const interval = setInterval(function() {

            // Get today's date and time
            const now = new Date().getTime();
          
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
          
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
            self.buildCountdown(days, hours, minutes, seconds);
          
            // If the count down is finished, write some text
            if (distance < 0) {

                clearInterval(interval);

                if( self.data.showWhenExpired ){

                    self.cache.countdownContent.innerText = self.data.expiredMessage;
                }else{
                    self.cache.countdown.classList.remove('is--block');
                }
            }
          
        }, 1000);
    };

    // Run listeners
    listeners (){

        if( this.cache.countdown.length < 1 ){
            return;
        }
        
        this.checkDay();
        this.replaceString();
        this.timeInterval();
    };

    /**
     * Initialise function starting the Listeners
     */
    init (){

        this.listeners();
    };
};

const countdown = new CountdownPromo();

countdown.init();