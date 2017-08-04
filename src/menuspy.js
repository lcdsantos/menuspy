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
        history.replaceState(null, null, `#${this.lastInViewElm.id}`);
      } else {
        const st = utils.scrollTop();
        window.location.hash = this.lastInViewElm;
        window.scrollTo(0, st);
      }
    }, this.options.hashTimeout);

    this.cacheItems();
    this.scrollFn();
  }

  assignValues() {
    this.currScrollTop = 0;
    this.lastInViewElm = null;
    this.menuHeight = this.element.offsetHeight + this.options.threshold;
    this.menuItems = [].slice.call(this.element.querySelectorAll(this.options.menuItemSelector));
  }

  cacheItems() {
    this.scrollItems = this.menuItems.map((elm) => {
      const target = elm.dataset.target ? document.querySelector(elm.dataset.target) : document.getElementById(elm.getAttribute('href').slice(1));
      if (target) {
        const offset = utils.offset(target).top;
        return { elm, target, offset };
      }
      return false;
    });
    this.scrollItems = this.scrollItems.filter(Boolean);
  }

  tick() {
    const fromTop = this.currScrollTop + this.menuHeight;
    const inViewElms = this.scrollItems
      .filter((item) => item.offset < fromTop);

    this.activateItem(inViewElms.pop());
  }

  activateItem(inViewElm) {
    const activeClass = this.options.activeClass;
    const callback = this.options.callback;

    if (this.lastInViewElm !== inViewElm.target) {
      this.lastInViewElm = inViewElm.target;

      this.scrollItems.forEach((item) => {
        utils.removeClass(item.elm.parentNode, activeClass);

        if (item.elm === inViewElm.elm) {
          utils.addClass(item.elm.parentNode, activeClass);

          if (typeof callback === 'function') {
            callback.call(this, item);
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