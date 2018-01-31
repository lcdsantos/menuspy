/*! MenuSpy v1.3.0 (Jan 31 2018) - http://leocs.me/menuspy/ - Copyright (c) 2018 Leonardo Santos; MIT License */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MenuSpy = factory());
}(this, (function () { 'use strict';

var utils = {
  extend: function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  offset: function offset(el) {
    var rect = el.getBoundingClientRect();

    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  scrollTop: function scrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  },

  addClass: function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      var classes = el.className.split(' ');
      var existingIndex = classes.indexOf(className);

      if (existingIndex === -1) {
        classes.push(className);
      }

      el.className = classes.join(' ');
    }
  },

  removeClass: function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp(("(^|\\b)" + (className.split(' ').join('|')) + "(\\b|$)"), 'gi'), ' ');
    }
  },

  debounce: function debounce(fn, delay) {
    var timeout = null;
    return function() {
      var args = arguments;
      var context = this;
      if (!timeout) {
        timeout = setTimeout(function () {
          timeout = 0;
          return fn.apply(context, args);
        }, delay);
      }
    };
  }
};

var MenuSpy = function MenuSpy(element, options) {
  var this$1 = this;

  if (!element) {
    return;
  }

  var defaults = {
    menuItemSelector : 'a[href^="#"]',
    activeClass      : 'active',
    threshold        : 15,
    enableLocationHash : true,
    hashTimeout      : 600,
    callback         : null
  };

  this.element = typeof element === 'string' ? document.querySelector(element) : element;
  this.options = utils.extend(defaults, options);

  this.assignValues();
  this.debouncedAssignValuesFn = utils.debounce(function () { return this$1.assignValues(); });
  window.addEventListener('resize', this.debouncedAssignValuesFn);

  this.debouncedHashFn = utils.debounce(function () {
    var hash = this$1.lastInViewElm ? ("#" + (this$1.lastInViewElm.id)) : '#';
    if (history.replaceState) {
      history.replaceState(null, null, hash);
    } else {
      var st = utils.scrollTop();
      window.location.hash = hash;
      window.scrollTo(0, st);
    }
  }, this.options.hashTimeout);

  this.cacheItems();
  this.scrollFn();
};

MenuSpy.prototype.assignValues = function assignValues () {
  this.currScrollTop = 0;
  this.lastInViewElm = null;
  this.menuHeight = this.element.offsetHeight + this.options.threshold;
  this.menuItems = [].slice.call(this.element.querySelectorAll(this.options.menuItemSelector));
  this.raf = null;
};

MenuSpy.prototype.cacheItems = function cacheItems () {
  this.scrollItems = this.menuItems.map(function (elm) {
    var target = elm.dataset.target ? document.querySelector(elm.dataset.target) : document.getElementById(elm.hash.slice(1));
    if (target) {
      var offset = Math.floor(utils.offset(target).top);
      return { elm: elm, target: target, offset: offset };
    }
    return false;
  });
  this.scrollItems = this.scrollItems.filter(Boolean).sort(function (a, b) { return a.offset - b.offset; });
};

MenuSpy.prototype.tick = function tick () {
  var fromTop = this.currScrollTop + this.menuHeight;
  var inViewElms = this.scrollItems.filter(function (item) { return item.offset < fromTop; });
  this.activateItem(inViewElms.pop());
};

MenuSpy.prototype.activateItem = function activateItem (inViewElm) {
    var this$1 = this;

  var ref = this.options;
    var activeClass = ref.activeClass;
    var callback = ref.callback;

  if (!inViewElm) {
    this.scrollItems.forEach(function (item) { return utils.removeClass(item.elm.parentNode, activeClass); });
    this.lastInViewElm = null;

    if (this.options.enableLocationHash) {
      this.debouncedHashFn();
    }

    return;
  }

  if (this.lastInViewElm !== inViewElm.target) {
    this.lastInViewElm = inViewElm.target;

    this.scrollItems.forEach(function (item) {
      utils.removeClass(item.elm.parentNode, activeClass);

      if (item.target === inViewElm.target) {
        utils.addClass(item.elm.parentNode, activeClass);

        if (typeof callback === 'function') {
          callback.call(this$1, item);
        }

        if (this$1.options.enableLocationHash) {
          this$1.debouncedHashFn();
        }
      }
    });
  }
};

MenuSpy.prototype.scrollFn = function scrollFn () {
  var st = utils.scrollTop();

  if (this.currScrollTop !== st) {
    this.currScrollTop = st;
    this.tick();
  }

  this.raf = window.requestAnimationFrame(this.scrollFn.bind(this));
};

MenuSpy.prototype.destroy = function destroy () {
  if (this.raf) {
    window.cancelAnimationFrame(this.raf);
  }

  window.removeEventListener('resize', this.debouncedAssignValuesFn);
};

return MenuSpy;

})));
