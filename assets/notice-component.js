class NoticeList extends HTMLElement{

  constructor() {
    super();
    this.cookieName = "notification_cookies";
    this.cookieExpiry = 30;
    this.cookieValues = this.getCookies();
  }

  getCookies () {

    const check = window.hasCookie(this.cookieName);

    if( !check ) return [];
    
    const cookies = window.getCookie(this.cookieName);

    if( cookies.length > 1 ) return cookies.split("|");

    return cookies;
  }

  setCookies () {
    const notifications = this.querySelectorAll('notice-item');
    const cookieArray = [];

    notifications.forEach((notification) => {
      if( notification.dataset.read == "true" ){
        cookieArray.push(`${notification.dataset.cookie}`);
      }
    });

    window.setCookie(this.cookieName, cookieArray.join("|"), this.cookieExpiry);
  }
}

customElements.define('notice-list', NoticeList);

class NoticeItem extends NoticeList{

  constructor() {
    super();

    this.wasRead();
    this.addEventListener('click', this.readNotice);
  }

  wasRead () {
    
    const foundNotification = this.cookieValues.includes(this.dataset.cookie);

    if( foundNotification ){
      this.dataset.read = true;
    }
  }

  readNotice() {

    this.dataset.read = true;
    this.closest('notice-list').setCookies();
  }
}

customElements.define('notice-item', NoticeItem);