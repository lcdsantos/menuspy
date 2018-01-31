import utils from './utils';

class MenuSpy {
  constructor(element, options) {
    if (!element) {
      return;
    }

    const defaults = {
      menuItemSelector   : 'a[href^="#"]',
      activeClass        : 'active',
      threshold          : 15,
      enableLocationHash : true,
      hashTimeout        : 600,
      callback           : null
    };

    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = utils.extend(defaults, options);

    this.assignValues();
    this.debouncedAssignValuesFn = utils.debounce(() => this.assignValues());
    window.addEventListener('resize', this.debouncedAssignValuesFn);

    this.debouncedHashFn = utils.debounce(() => {
      const hash = this.lastInViewElm ? `#${this.lastInViewElm.id}` : '#';
      if (history.replaceState) {
        history.replaceState(null, null, hash);
      } else {
        const st = utils.scrollTop();
        window.location.hash = hash;
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
    this.raf = null;
  }

  cacheItems() {
    this.scrollItems = this.menuItems.map((elm) => {
      const target = elm.dataset.target ? document.querySelector(elm.dataset.target) : document.getElementById(elm.hash.slice(1));
      if (target) {
        const offset = Math.floor(utils.offset(target).top);
        return { elm, target, offset };
      }
      return false;
    });
    this.scrollItems = this.scrollItems.filter(Boolean).sort((a, b) => a.offset - b.offset);
  }

  tick() {
    const fromTop = this.currScrollTop + this.menuHeight;
    const inViewElms = this.scrollItems.filter((item) => item.offset < fromTop);
    this.activateItem(inViewElms.pop());
  }

  activateItem(inViewElm) {
    const { activeClass, callback } = this.options;

    if (!inViewElm) {
      this.scrollItems.forEach((item) => utils.removeClass(item.elm.parentNode, activeClass));
      this.lastInViewElm = null;

      if (this.options.enableLocationHash) {
        this.debouncedHashFn();
      }

      return;
    }

    if (this.lastInViewElm !== inViewElm.target) {
      this.lastInViewElm = inViewElm.target;

      this.scrollItems.forEach((item) => {
        utils.removeClass(item.elm.parentNode, activeClass);

        if (item.target === inViewElm.target) {
          utils.addClass(item.elm.parentNode, activeClass);

          if (typeof callback === 'function') {
            callback.call(this, item);
          }

          if (this.options.enableLocationHash) {
            this.debouncedHashFn();
          }
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

    this.raf = window.requestAnimationFrame(this.scrollFn.bind(this));
  }

  destroy() {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
    }

    window.removeEventListener('resize', this.debouncedAssignValuesFn);
  }
}

export default MenuSpy;
