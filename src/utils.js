const utils = {
  extend(a, b) {
    for (const key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  offset(el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  scrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  },

  addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      const classes = el.className.split(' ');
      const existingIndex = classes.indexOf(className);

      if (existingIndex === -1) {
        classes.push(className);
      }

      el.className = classes.join(' ');
    }
  },

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
    }
  },

  debounce(fn, delay) {
    let timeout = null;
    return function() {
      const args = arguments;
      const context = this;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = 0;
          return fn.apply(context, args);
        }, delay);
      }
    };
  }
};

export default utils;