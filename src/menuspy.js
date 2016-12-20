import utils from './utils.js';

class MenuSpy {
  constructor(element, options) {
    if (!element) {
      return;
    }

    const defaults = {
      menuItemSelector: 'a[href^="#"]',
      activeClass     : 'active',
      threshold       : 15,
      hashTimeout     : 600,
      callback        : null
    };

    this.element = element;
    this.options = utils.extend(defaults, options);

    this.assignValues();
    window.addEventListener('resize', utils.debounce(() => this.assignValues()));

    this.debouncedHashFn = utils.debounce(() => {
      if (history.replaceState) {
        history.replaceState(null, null, `#${this.lastId}`);
      } else {
        const st = utils.scrollTop();
        window.location.hash = this.lastId;
        window.scrollTo(0, st);
      }
    }, this.options.hashTimeout);

    this.cacheItems();
    this.scrollFn();
  }

  assignValues() {
    this.currScrollTop = 0;
    this.lastId = '';
    this.menuHeight = this.element.offsetHeight + this.options.threshold;
    this.menuItems = [].slice.call(this.element.querySelectorAll(this.options.menuItemSelector));
  }

  cacheItems() {
    this.scrollItems = this.menuItems.map((a) => {
      const elm = document.getElementById(a.getAttribute('href').slice(1));
      if (elm) {
        const offset = utils.offset(elm).top;
        return { elm, offset };
      } else {
        console.warn('MenuSpy warning: %s not found on page.', a.href);
      }
    });
    this.scrollItems = this.scrollItems.filter( Boolean );
  }

  tick() {
    const fromTop = this.currScrollTop + this.menuHeight;
    const inViewElms = this.scrollItems
      .filter((item) => item.offset < fromTop)
      .map((item) => item.elm);

    this.activateItem(inViewElms.pop());
  }

  activateItem(inViewElm) {
    const id = inViewElm ? inViewElm.id : '';
    const activeClass = this.options.activeClass;
    const callback = this.options.callback;

    if (this.lastId !== id) {
      this.lastId = id;

      this.menuItems.forEach((item) => {
        utils.removeClass(item.parentNode, activeClass);

        if (item.getAttribute('href') === `#${id}`) {
          utils.addClass(item.parentNode, activeClass);

          if (typeof callback === 'function') {
            callback.call(this, item, inViewElm);
          }

          this.debouncedHashFn();
        }
      });
    }
  }

  scrollFn() {
    const st = utils.scrollTop();

    if (this.currScrollTop !== st) {
      this.currScrollTop = st;
      this.tick();
    }

    window.requestAnimationFrame(this.scrollFn.bind(this));
  }
}

export default MenuSpy;