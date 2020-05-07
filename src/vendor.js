require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"@popperjs/core":[function(require,module,exports){
(function (process){
/**
 * @popperjs/core v2.4.0 - MIT License
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}

/*:: import type { Window } from '../types'; */

/*:: declare function getWindow(node: Node | Window): Window; */
function getWindow(node) {
  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  return node;
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/*:: declare function isElement(node: mixed): boolean %checks(node instanceof
  Element); */

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
/*:: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
  HTMLElement); */


function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getDocumentElement(element) {
  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document).documentElement;
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// Composite means it takes into account transforms as well as layout.

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (!isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.
function getLayoutRect(element) {
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight
  };
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// $FlowFixMe: this is a quicker (but less type safe) way to save quite some bytes from the bundle
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    // $FlowFixMe: need a better way to handle this...
    element.host || // ShadowRoot detected
    // $FlowFixMe: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

function listScrollParents(element, list) {
  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = getNodeName(scrollParent) === 'body';
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
}

function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element); // Find the nearest non-table offsetParent

  while (offsetParent && isTableElement(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static') {
    return window;
  }

  return offsetParent || window;
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    Object.keys(modifier).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (!Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, {}, current, {
      options: Object.assign({}, existing.options, {}, current.options),
      data: Object.assign({}, existing.data, {}, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, {}, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(options) {
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, {}, state.options, {}, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

function getVariation(placement) {
  return placement.split('-')[1];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = Math.floor(offsets[mainAxis]) - Math.floor(reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = Math.floor(offsets[mainAxis]) + Math.ceil(reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsets(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: Math.round(x * dpr) / dpr || 0,
    y: Math.round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive;

  var _roundOffsets = roundOffsets(offsets),
      x = _roundOffsets.x,
      y = _roundOffsets.y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);
    } // $FlowFixMe: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

    /*:: offsetParent = (offsetParent: Element); */


    if (placement === top) {
      sideY = bottom;
      y -= offsetParent.clientHeight - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left) {
      sideX = right;
      x -= offsetParent.clientWidth - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref3) {
  var state = _ref3.state,
      options = _ref3.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, {}, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, {}, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$1(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$1,
  requires: ['computeStyles']
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

var hash$1 = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash$1[matched];
  });
}

function getViewportRect(element) {
  var win = getWindow(element);
  var visualViewport = win.visualViewport;
  var width = win.innerWidth;
  var height = win.innerHeight; // We don't know which browsers have buggy or odd implementations of this, so
  // for now we're only applying it to iOS to fix the keyboard issue.
  // Investigation required

  if (visualViewport && /iPhone|iPod|iPad/.test(navigator.platform)) {
    width = visualViewport.width;
    height = visualViewport.height;
  }

  return {
    width: width,
    height: height,
    x: 0,
    y: 0
  };
}

function getDocumentRect(element) {
  var win = getWindow(element);
  var winScroll = getWindowScroll(element);
  var documentRect = getCompositeRect(getDocumentElement(element), win);
  documentRect.height = Math.max(documentRect.height, win.innerHeight);
  documentRect.width = Math.max(documentRect.width, win.innerWidth);
  documentRect.x = -winScroll.scrollLeft;
  documentRect.y = -winScroll.scrollTop;
  return documentRect;
}

function toNumber(cssValue) {
  return parseFloat(cssValue) || 0;
}

function getBorders(element) {
  var computedStyle = isHTMLElement(element) ? getComputedStyle(element) : {};
  return {
    top: toNumber(computedStyle.borderTopWidth),
    right: toNumber(computedStyle.borderRightWidth),
    bottom: toNumber(computedStyle.borderBottomWidth),
    left: toNumber(computedStyle.borderLeftWidth)
  };
}

function getDecorations(element) {
  var win = getWindow(element);
  var borders = getBorders(element);
  var isHTML = getNodeName(element) === 'html';
  var winScrollBarX = getWindowScrollBarX(element);
  var x = element.clientWidth + borders.right;
  var y = element.clientHeight + borders.bottom; // HACK:
  // document.documentElement.clientHeight on iOS reports the height of the
  // viewport including the bottom bar, even if the bottom bar isn't visible.
  // If the difference between window innerHeight and html clientHeight is more
  // than 50, we assume it's a mobile bottom bar and ignore scrollbars.
  // * A 50px thick scrollbar is likely non-existent (macOS is 15px and Windows
  //   is about 17px)
  // * The mobile bar is 114px tall

  if (isHTML && win.innerHeight - element.clientHeight > 50) {
    y = win.innerHeight - borders.bottom;
  }

  return {
    top: isHTML ? 0 : element.clientTop,
    right: // RTL scrollbar (scrolling containers only)
    element.clientLeft > borders.left ? borders.right : // LTR scrollbar
    isHTML ? win.innerWidth - x - winScrollBarX : element.offsetWidth - x,
    bottom: isHTML ? win.innerHeight - y : element.offsetHeight - y,
    left: isHTML ? winScrollBarX : element.clientLeft
  };
}

function contains(parent, child) {
  // $FlowFixMe: hasOwnProperty doesn't seem to work in tests
  var isShadow = Boolean(child.getRootNode && child.getRootNode().host); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (isShadow) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(element);
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement);
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    var decorations = getDecorations(isHTMLElement(clippingParent) ? clippingParent : getDocumentElement(element));
    accRect.top = Math.max(rect.top + decorations.top, accRect.top);
    accRect.right = Math.min(rect.right - decorations.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom - decorations.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left + decorations.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), {}, paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, {}, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/*:: type OverflowsMap = { [ComputedPlacement]: number }; */

/*;; type OverflowsMap = { [key in ComputedPlacement]: number }; */
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = (variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements).filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  }); // $FlowFixMe: Flow seems to have problems with two array unions...

  var overflows = placements$1.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function within(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = popperOffsets[mainAxis] + overflow[mainSide];
    var max = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? Math.min(min, tetherMin) : min, offset, tether ? Math.max(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var _preventedOffset = within(_min, _offset, _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = state.modifiersData[name + "#persistent"].padding;
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$2(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element,
      _options$padding = options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
  state.modifiersData[name + "#persistent"] = {
    padding: mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
  };
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$2,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

exports.createPopper = createPopper;
exports.defaultModifiers = defaultModifiers;
exports.detectOverflow = detectOverflow;
exports.popperGenerator = popperGenerator;


}).call(this,require('_process'))
},{"_process":1}],"handlebars-helper-ternary":[function(require,module,exports){
'use strict';

/**
 * Test a value and return a "yes" or "no" argument based on the result.
 *
 * @param {*} test Value to test for truthiness
 * @param {string} yes Value to return when test is truthy
 * @param {string} no Value to return when test is falsy
 */
module.exports = function(test, yes, no) {
    return (typeof test === 'function' ? test.call(this) : test) ? yes : no;
};

},{}],"roughjs":[function(require,module,exports){
"use strict";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};function e(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}function n(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),a=0;for(e=0;e<n;e++)for(var o=arguments[e],s=0,i=o.length;s<i;s++,a++)r[a]=o[s];return r}function r(t,e,n){if(t&&t.length){var r=e[0],a=e[1],o=Math.PI/180*n,s=Math.cos(o),i=Math.sin(o);t.forEach((function(t){var e=t[0],n=t[1];t[0]=(e-r)*s-(n-a)*i+r,t[1]=(e-r)*i+(n-a)*s+a}))}}function a(t){var e=t[0],n=t[1];return Math.sqrt(Math.pow(e[0]-n[0],2)+Math.pow(e[1]-n[1],2))}function o(t,e,n){var r=t.length;if(r<3)return!1;for(var a=[Number.MAX_SAFE_INTEGER,n],o=[e,n],u=0,p=0;p<r;p++){var c=t[p],l=t[(p+1)%r];if(h(c,l,o,a)){if(0===i(c,o,l))return s(c,o,l);u++}}return u%2==1}function s(t,e,n){return e[0]<=Math.max(t[0],n[0])&&e[0]>=Math.min(t[0],n[0])&&e[1]<=Math.max(t[1],n[1])&&e[1]>=Math.min(t[1],n[1])}function i(t,e,n){var r=(e[1]-t[1])*(n[0]-e[0])-(e[0]-t[0])*(n[1]-e[1]);return 0===r?0:r>0?1:2}function h(t,e,n,r){var a=i(t,e,n),o=i(t,e,r),h=i(n,r,t),u=i(n,r,e);return a!==o&&h!==u||(!(0!==a||!s(t,n,e))||(!(0!==o||!s(t,r,e))||(!(0!==h||!s(n,t,r))||!(0!==u||!s(n,e,r)))))}function u(t,e){var a=[0,0],o=Math.round(e.hachureAngle+90);o&&r(t,a,o);var s=function(t,e){var r=n(t);r[0].join(",")!==r[r.length-1].join(",")&&r.push([r[0][0],r[0][1]]);var a=[];if(r&&r.length>2){var o=e.hachureGap;o<0&&(o=4*e.strokeWidth),o=Math.max(o,.1);for(var s=[],i=0;i<r.length-1;i++){var h=r[i],u=r[i+1];if(h[1]!==u[1]){var p=Math.min(h[1],u[1]);s.push({ymin:p,ymax:Math.max(h[1],u[1]),x:p===h[1]?h[0]:u[0],islope:(u[0]-h[0])/(u[1]-h[1])})}}if(s.sort((function(t,e){return t.ymin<e.ymin?-1:t.ymin>e.ymin?1:t.x<e.x?-1:t.x>e.x?1:t.ymax===e.ymax?0:(t.ymax-e.ymax)/Math.abs(t.ymax-e.ymax)})),!s.length)return a;for(var c=[],l=s[0].ymin;c.length||s.length;){if(s.length){var f=-1;for(i=0;i<s.length&&!(s[i].ymin>l);i++)f=i;s.splice(0,f+1).forEach((function(t){c.push({s:l,edge:t})}))}if((c=c.filter((function(t){return!(t.edge.ymax<=l)}))).sort((function(t,e){return t.edge.x===e.edge.x?0:(t.edge.x-e.edge.x)/Math.abs(t.edge.x-e.edge.x)})),c.length>1)for(i=0;i<c.length;i+=2){var d=i+1;if(d>=c.length)break;var v=c[i].edge,g=c[d].edge;a.push([[Math.round(v.x),l],[Math.round(g.x),l]])}l+=o,c.forEach((function(t){t.edge.x=t.edge.x+o*t.edge.islope}))}}return a}(t,e);return o&&(r(t,a,-o),function(t,e,n){var a=[];t.forEach((function(t){return a.push.apply(a,t)})),r(a,e,n)}(s,a,-o)),s}var p=function(){function t(t){this.helper=t}return t.prototype.fillPolygon=function(t,e){return this._fillPolygon(t,e)},t.prototype._fillPolygon=function(t,e,n){void 0===n&&(n=!1);var r=u(t,e);if(n){var a=this.connectingLines(t,r);r=r.concat(a)}return{type:"fillSketch",ops:this.renderLines(r,e)}},t.prototype.renderLines=function(t,e){for(var n=[],r=0,a=t;r<a.length;r++){var o=a[r];n.push.apply(n,this.helper.doubleLineOps(o[0][0],o[0][1],o[1][0],o[1][1],e))}return n},t.prototype.connectingLines=function(t,e){var n=[];if(e.length>1)for(var r=1;r<e.length;r++){var o=e[r-1];if(!(a(o)<3)){var s=[e[r][0],o[1]];if(a(s)>3){var i=this.splitOnIntersections(t,s);n.push.apply(n,i)}}}return n},t.prototype.midPointInPolygon=function(t,e){return o(t,(e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2)},t.prototype.splitOnIntersections=function(t,e){for(var r,s,i,u,p,c,l,f,d,v,g,y=Math.max(5,.1*a(e)),M=[],k=0;k<t.length;k++){var m=t[k],b=t[(k+1)%t.length];if(h.apply(void 0,n([m,b],e))){var w=(r=m,s=b,i=e[0],u=e[1],p=void 0,c=void 0,l=void 0,f=void 0,d=void 0,v=void 0,g=void 0,p=s[1]-r[1],c=r[0]-s[0],l=p*r[0]+c*r[1],f=u[1]-i[1],d=i[0]-u[0],v=f*i[0]+d*i[1],(g=p*d-f*c)?[(d*l-c*v)/g,(p*v-f*l)/g]:null);if(w){var P=a([w,e[0]]),x=a([w,e[1]]);P>y&&x>y&&M.push({point:w,distance:P})}}}if(M.length>1){var O=M.sort((function(t,e){return t.distance-e.distance})).map((function(t){return t.point}));if(o.apply(void 0,n([t],e[0]))||O.shift(),o.apply(void 0,n([t],e[1]))||O.pop(),O.length<=1)return this.midPointInPolygon(t,e)?[e]:[];var S=n([e[0]],O,[e[1]]),T=[];for(k=0;k<S.length-1;k+=2){var _=[S[k],S[k+1]];this.midPointInPolygon(t,_)&&T.push(_)}return T}return this.midPointInPolygon(t,e)?[e]:[]},t}(),c=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return e(n,t),n.prototype.fillPolygon=function(t,e){return this._fillPolygon(t,e,!0)},n}(p),l=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return e(n,t),n.prototype.fillPolygon=function(t,e){var n=this._fillPolygon(t,e),r=Object.assign({},e,{hachureAngle:e.hachureAngle+90}),a=this._fillPolygon(t,r);return n.ops=n.ops.concat(a.ops),n},n}(p),f=function(){function t(t){this.helper=t}return t.prototype.fillPolygon=function(t,e){var n=u(t,e=Object.assign({},e,{curveStepCount:4,hachureAngle:0,roughness:1}));return this.dotsOnLines(n,e)},t.prototype.dotsOnLines=function(t,e){var n=[],r=e.hachureGap;r<0&&(r=4*e.strokeWidth),r=Math.max(r,.1);var o=e.fillWeight;o<0&&(o=e.strokeWidth/2);for(var s=r/4,i=0,h=t;i<h.length;i++)for(var u=h[i],p=a(u),c=p/r,l=Math.ceil(c)-1,f=p-l*r,d=(u[0][0]+u[1][0])/2-r/4,v=Math.min(u[0][1],u[1][1]),g=0;g<l;g++){var y=v+f+g*r,M=this.helper.randOffsetWithRange(d-s,d+s,e),k=this.helper.randOffsetWithRange(y-s,y+s,e),m=this.helper.ellipse(M,k,o,o,e);n.push.apply(n,m.ops)}return{type:"fillSketch",ops:n}},t}(),d=function(){function t(t){this.helper=t}return t.prototype.fillPolygon=function(t,e){var n=u(t,e);return{type:"fillSketch",ops:this.dashedLine(n,e)}},t.prototype.dashedLine=function(t,e){var n=this,r=e.dashOffset<0?e.hachureGap<0?4*e.strokeWidth:e.hachureGap:e.dashOffset,o=e.dashGap<0?e.hachureGap<0?4*e.strokeWidth:e.hachureGap:e.dashGap,s=[];return t.forEach((function(t){var i=a(t),h=Math.floor(i/(r+o)),u=(i+o-h*(r+o))/2,p=t[0],c=t[1];p[0]>c[0]&&(p=t[1],c=t[0]);for(var l=Math.atan((c[1]-p[1])/(c[0]-p[0])),f=0;f<h;f++){var d=f*(r+o),v=d+r,g=[p[0]+d*Math.cos(l)+u*Math.cos(l),p[1]+d*Math.sin(l)+u*Math.sin(l)],y=[p[0]+v*Math.cos(l)+u*Math.cos(l),p[1]+v*Math.sin(l)+u*Math.sin(l)];s.push.apply(s,n.helper.doubleLineOps(g[0],g[1],y[0],y[1],e))}})),s},t}(),v=function(){function t(t){this.helper=t}return t.prototype.fillPolygon=function(t,e){var n=e.hachureGap<0?4*e.strokeWidth:e.hachureGap,r=e.zigzagOffset<0?n:e.zigzagOffset,a=u(t,e=Object.assign({},e,{hachureGap:n+r}));return{type:"fillSketch",ops:this.zigzagLines(a,r,e)}},t.prototype.zigzagLines=function(t,e,r){var o=this,s=[];return t.forEach((function(t){var i=a(t),h=Math.round(i/(2*e)),u=t[0],p=t[1];u[0]>p[0]&&(u=t[1],p=t[0]);for(var c=Math.atan((p[1]-u[1])/(p[0]-u[0])),l=0;l<h;l++){var f=2*l*e,d=2*(l+1)*e,v=Math.sqrt(2*Math.pow(e,2)),g=[u[0]+f*Math.cos(c),u[1]+f*Math.sin(c)],y=[u[0]+d*Math.cos(c),u[1]+d*Math.sin(c)],M=[g[0]+v*Math.cos(c+Math.PI/4),g[1]+v*Math.sin(c+Math.PI/4)];s.push.apply(s,n(o.helper.doubleLineOps(g[0],g[1],M[0],M[1],r),o.helper.doubleLineOps(M[0],M[1],y[0],y[1],r)))}})),s},t}(),g={};var y=function(){function t(t){this.seed=t}return t.prototype.next=function(){return this.seed?(Math.pow(2,31)-1&(this.seed=Math.imul(48271,this.seed)))/Math.pow(2,31):Math.random()},t}();const M={A:7,a:7,C:6,c:6,H:1,h:1,L:2,l:2,M:2,m:2,Q:4,q:4,S:4,s:4,T:2,t:2,V:1,v:1,Z:0,z:0};function k(t,e){return t.type===e}function m(t){const e=[],n=function(t){const e=new Array;for(;""!==t;)if(t.match(/^([ \t\r\n,]+)/))t=t.substr(RegExp.$1.length);else if(t.match(/^([aAcChHlLmMqQsStTvVzZ])/))e[e.length]={type:0,text:RegExp.$1},t=t.substr(RegExp.$1.length);else{if(!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))return[];e[e.length]={type:1,text:""+parseFloat(RegExp.$1)},t=t.substr(RegExp.$1.length)}return e[e.length]={type:2,text:""},e}(t);let r="BOD",a=0,o=n[a];for(;!k(o,2);){let s=0;const i=[];if("BOD"===r){if("M"!==o.text&&"m"!==o.text)return m("M0,0"+t);a++,s=M[o.text],r=o.text}else k(o,1)?s=M[r]:(a++,s=M[o.text],r=o.text);if(!(a+s<n.length))throw new Error("Path data ended short");for(let t=a;t<a+s;t++){const e=n[t];if(!k(e,1))throw new Error("Param not a number: "+r+","+e.text);i[i.length]=+e.text}if("number"!=typeof M[r])throw new Error("Bad segment: "+r);{const t={key:r,data:i};e.push(t),a+=s,o=n[a],"M"===r&&(r="L"),"m"===r&&(r="l")}}return e}function b(t){let e=0,n=0,r=0,a=0;const o=[];for(const{key:s,data:i}of t)switch(s){case"M":o.push({key:"M",data:[...i]}),[e,n]=i,[r,a]=i;break;case"m":e+=i[0],n+=i[1],o.push({key:"M",data:[e,n]}),r=e,a=n;break;case"L":o.push({key:"L",data:[...i]}),[e,n]=i;break;case"l":e+=i[0],n+=i[1],o.push({key:"L",data:[e,n]});break;case"C":o.push({key:"C",data:[...i]}),e=i[4],n=i[5];break;case"c":{const t=i.map((t,r)=>r%2?t+n:t+e);o.push({key:"C",data:t}),e=t[4],n=t[5];break}case"Q":o.push({key:"Q",data:[...i]}),e=i[2],n=i[3];break;case"q":{const t=i.map((t,r)=>r%2?t+n:t+e);o.push({key:"Q",data:t}),e=t[2],n=t[3];break}case"A":o.push({key:"A",data:[...i]}),e=i[5],n=i[6];break;case"a":e+=i[5],n+=i[6],o.push({key:"A",data:[i[0],i[1],i[2],i[3],i[4],e,n]});break;case"H":o.push({key:"H",data:[...i]}),e=i[0];break;case"h":e+=i[0],o.push({key:"H",data:[e]});break;case"V":o.push({key:"V",data:[...i]}),n=i[0];break;case"v":n+=i[0],o.push({key:"V",data:[n]});break;case"S":o.push({key:"S",data:[...i]}),e=i[2],n=i[3];break;case"s":{const t=i.map((t,r)=>r%2?t+n:t+e);o.push({key:"S",data:t}),e=t[2],n=t[3];break}case"T":o.push({key:"T",data:[...i]}),e=i[0],n=i[1];break;case"t":e+=i[0],n+=i[1],o.push({key:"T",data:[e,n]});break;case"Z":case"z":o.push({key:"Z",data:[]}),e=r,n=a}return o}function w(t){const e=[];let n="",r=0,a=0,o=0,s=0,i=0,h=0;for(const{key:u,data:p}of t){switch(u){case"M":e.push({key:"M",data:[...p]}),[r,a]=p,[o,s]=p;break;case"C":e.push({key:"C",data:[...p]}),r=p[4],a=p[5],i=p[2],h=p[3];break;case"L":e.push({key:"L",data:[...p]}),[r,a]=p;break;case"H":r=p[0],e.push({key:"L",data:[r,a]});break;case"V":a=p[0],e.push({key:"L",data:[r,a]});break;case"S":{let t=0,o=0;"C"===n||"S"===n?(t=r+(r-i),o=a+(a-h)):(t=r,o=a),e.push({key:"C",data:[t,o,...p]}),i=p[0],h=p[1],r=p[2],a=p[3];break}case"T":{const[t,o]=p;let s=0,u=0;"Q"===n||"T"===n?(s=r+(r-i),u=a+(a-h)):(s=r,u=a);const c=r+2*(s-r)/3,l=a+2*(u-a)/3,f=t+2*(s-t)/3,d=o+2*(u-o)/3;e.push({key:"C",data:[c,l,f,d,t,o]}),i=s,h=u,r=t,a=o;break}case"Q":{const[t,n,o,s]=p,u=r+2*(t-r)/3,c=a+2*(n-a)/3,l=o+2*(t-o)/3,f=s+2*(n-s)/3;e.push({key:"C",data:[u,c,l,f,o,s]}),i=t,h=n,r=o,a=s;break}case"A":{const t=Math.abs(p[0]),n=Math.abs(p[1]),o=p[2],s=p[3],i=p[4],h=p[5],u=p[6];if(0===t||0===n)e.push({key:"C",data:[r,a,h,u,h,u]}),r=h,a=u;else if(r!==h||a!==u){x(r,a,h,u,t,n,o,s,i).forEach((function(t){e.push({key:"C",data:t})})),r=h,a=u}break}case"Z":e.push({key:"Z",data:[]}),r=o,a=s}n=u}return e}function P(t,e,n){return[t*Math.cos(n)-e*Math.sin(n),t*Math.sin(n)+e*Math.cos(n)]}function x(t,e,n,r,a,o,s,i,h,u){const p=(c=s,Math.PI*c/180);var c;let l=[],f=0,d=0,v=0,g=0;if(u)[f,d,v,g]=u;else{[t,e]=P(t,e,-p),[n,r]=P(n,r,-p);const s=(t-n)/2,u=(e-r)/2;let c=s*s/(a*a)+u*u/(o*o);c>1&&(c=Math.sqrt(c),a*=c,o*=c);const l=a*a,y=o*o,M=l*y-l*u*u-y*s*s,k=l*u*u+y*s*s,m=(i===h?-1:1)*Math.sqrt(Math.abs(M/k));v=m*a*u/o+(t+n)/2,g=m*-o*s/a+(e+r)/2,f=Math.asin(parseFloat(((e-g)/o).toFixed(9))),d=Math.asin(parseFloat(((r-g)/o).toFixed(9))),t<v&&(f=Math.PI-f),n<v&&(d=Math.PI-d),f<0&&(f=2*Math.PI+f),d<0&&(d=2*Math.PI+d),h&&f>d&&(f-=2*Math.PI),!h&&d>f&&(d-=2*Math.PI)}let y=d-f;if(Math.abs(y)>120*Math.PI/180){const t=d,e=n,i=r;d=h&&d>f?f+120*Math.PI/180*1:f+120*Math.PI/180*-1,l=x(n=v+a*Math.cos(d),r=g+o*Math.sin(d),e,i,a,o,s,0,h,[d,t,v,g])}y=d-f;const M=Math.cos(f),k=Math.sin(f),m=Math.cos(d),b=Math.sin(d),w=Math.tan(y/4),O=4/3*a*w,S=4/3*o*w,T=[t,e],_=[t+O*k,e-S*M],I=[n+O*b,r-S*m],C=[n,r];if(_[0]=2*T[0]-_[0],_[1]=2*T[1]-_[1],u)return[_,I,C].concat(l);{l=[_,I,C].concat(l);const t=[];for(let e=0;e<l.length;e+=3){const n=P(l[e][0],l[e][1],p),r=P(l[e+1][0],l[e+1][1],p),a=P(l[e+2][0],l[e+2][1],p);t.push([n[0],n[1],r[0],r[1],a[0],a[1]])}return t}}var O={randOffset:function(t,e){return G(t,e)},randOffsetWithRange:function(t,e,n){return R(t,e,n)},ellipse:function(t,e,n,r,a){var o=I(n,r,a);return C(t,e,a,o).opset},doubleLineOps:function(t,e,n,r,a){return q(t,e,n,r,a)}};function S(t,e,n,r,a){return{type:"path",ops:q(t,e,n,r,a)}}function T(t,e,n){var r=(t||[]).length;if(r>2){for(var a=[],o=0;o<r-1;o++)a.push.apply(a,q(t[o][0],t[o][1],t[o+1][0],t[o+1][1],n));return e&&a.push.apply(a,q(t[r-1][0],t[r-1][1],t[0][0],t[0][1],n)),{type:"path",ops:a}}return 2===r?S(t[0][0],t[0][1],t[1][0],t[1][1],n):{type:"path",ops:[]}}function _(t,e,n,r,a){return function(t,e){return T(t,!0,e)}([[t,e],[t+n,e],[t+n,e+r],[t,e+r]],a)}function I(t,e,n){var r=Math.sqrt(2*Math.PI*Math.sqrt((Math.pow(t/2,2)+Math.pow(e/2,2))/2)),a=Math.max(n.curveStepCount,n.curveStepCount/Math.sqrt(200)*r),o=2*Math.PI/a,s=Math.abs(t/2),i=Math.abs(e/2),h=1-n.curveFitting;return{increment:o,rx:s+=G(s*h,n),ry:i+=G(i*h,n)}}function C(t,e,n,r){var a=Z(r.increment,t,e,r.rx,r.ry,1,r.increment*R(.1,R(.4,1,n),n),n),o=a[0],s=a[1],i=Z(r.increment,t,e,r.rx,r.ry,1.5,0,n)[0],h=N(o,null,n),u=N(i,null,n);return{estimatedPoints:s,opset:{type:"path",ops:h.concat(u)}}}function W(t,e,r,a,o,s,i,h,u){var p=t,c=e,l=Math.abs(r/2),f=Math.abs(a/2);l+=G(.01*l,u),f+=G(.01*f,u);for(var d=o,v=s;d<0;)d+=2*Math.PI,v+=2*Math.PI;v-d>2*Math.PI&&(d=0,v=2*Math.PI);var g=2*Math.PI/u.curveStepCount,y=Math.min(g/2,(v-d)/2),M=D(y,p,c,l,f,d,v,1,u),k=D(y,p,c,l,f,d,v,1.5,u),m=M.concat(k);return i&&(h?m.push.apply(m,n(q(p,c,p+l*Math.cos(d),c+f*Math.sin(d),u),q(p,c,p+l*Math.cos(v),c+f*Math.sin(v),u))):m.push({op:"lineTo",data:[p,c]},{op:"lineTo",data:[p+l*Math.cos(d),c+f*Math.sin(d)]})),{type:"path",ops:m}}function L(t,e){for(var n=w(b(m(t))),r=[],a=[0,0],o=[0,0],s=function(t,n){switch(t){case"M":var s=1*(e.maxRandomnessOffset||0);r.push({op:"move",data:n.map((function(t){return t+G(s,e)}))}),o=[n[0],n[1]],a=[n[0],n[1]];break;case"L":r.push.apply(r,q(o[0],o[1],n[0],n[1],e)),o=[n[0],n[1]];break;case"C":var i=n[0],h=n[1],u=n[2],p=n[3],c=n[4],l=n[5];r.push.apply(r,function(t,e,n,r,a,o,s,i){for(var h=[],u=[i.maxRandomnessOffset||1,(i.maxRandomnessOffset||1)+.3],p=[0,0],c=0;c<2;c++)0===c?h.push({op:"move",data:[s[0],s[1]]}):h.push({op:"move",data:[s[0]+G(u[0],i),s[1]+G(u[0],i)]}),p=[a+G(u[c],i),o+G(u[c],i)],h.push({op:"bcurveTo",data:[t+G(u[c],i),e+G(u[c],i),n+G(u[c],i),r+G(u[c],i),p[0],p[1]]});return h}(i,h,u,p,c,l,o,e)),o=[c,l];break;case"Z":r.push.apply(r,q(o[0],o[1],a[0],a[1],e)),o=[a[0],a[1]]}},i=0,h=n;i<h.length;i++){var u=h[i];s(u.key,u.data)}return{type:"path",ops:r}}function E(t,e){var n=[];if(t.length){var r=e.maxRandomnessOffset||0,a=t.length;if(a>2){n.push({op:"move",data:[t[0][0]+G(r,e),t[0][1]+G(r,e)]});for(var o=1;o<a;o++)n.push({op:"lineTo",data:[t[o][0]+G(r,e),t[o][1]+G(r,e)]})}}return{type:"fillPath",ops:n}}function z(t,e){return function(t,e){var n=t.fillStyle||"hachure";if(!g[n])switch(n){case"zigzag":g[n]||(g[n]=new c(e));break;case"cross-hatch":g[n]||(g[n]=new l(e));break;case"dots":g[n]||(g[n]=new f(e));break;case"dashed":g[n]||(g[n]=new d(e));break;case"zigzag-line":g[n]||(g[n]=new v(e));break;case"hachure":default:g[n="hachure"]||(g[n]=new p(e))}return g[n]}(e,O).fillPolygon(t,e)}function A(t){return t.randomizer||(t.randomizer=new y(t.seed||0)),t.randomizer.next()}function R(t,e,n,r){return void 0===r&&(r=1),n.roughness*r*(A(n)*(e-t)+t)}function G(t,e,n){return void 0===n&&(n=1),R(-t,t,e,n)}function q(t,e,n,r,a){var o=j(t,e,n,r,a,!0,!1),s=j(t,e,n,r,a,!0,!0);return o.concat(s)}function j(t,e,n,r,a,o,s){var i=Math.pow(t-n,2)+Math.pow(e-r,2),h=Math.sqrt(i),u=1;u=h<200?1:h>500?.4:-.0016668*h+1.233334;var p=a.maxRandomnessOffset||0;p*p*100>i&&(p=h/10);var c=p/2,l=.2+.2*A(a),f=a.bowing*a.maxRandomnessOffset*(r-e)/200,d=a.bowing*a.maxRandomnessOffset*(t-n)/200;f=G(f,a,u),d=G(d,a,u);var v=[],g=function(){return G(c,a,u)},y=function(){return G(p,a,u)};return o&&(s?v.push({op:"move",data:[t+g(),e+g()]}):v.push({op:"move",data:[t+G(p,a,u),e+G(p,a,u)]})),s?v.push({op:"bcurveTo",data:[f+t+(n-t)*l+g(),d+e+(r-e)*l+g(),f+t+2*(n-t)*l+g(),d+e+2*(r-e)*l+g(),n+g(),r+g()]}):v.push({op:"bcurveTo",data:[f+t+(n-t)*l+y(),d+e+(r-e)*l+y(),f+t+2*(n-t)*l+y(),d+e+2*(r-e)*l+y(),n+y(),r+y()]}),v}function F(t,e,n){var r=[];r.push([t[0][0]+G(e,n),t[0][1]+G(e,n)]),r.push([t[0][0]+G(e,n),t[0][1]+G(e,n)]);for(var a=1;a<t.length;a++)r.push([t[a][0]+G(e,n),t[a][1]+G(e,n)]),a===t.length-1&&r.push([t[a][0]+G(e,n),t[a][1]+G(e,n)]);return N(r,null,n)}function N(t,e,n){var r=t.length,a=[];if(r>3){var o=[],s=1-n.curveTightness;a.push({op:"move",data:[t[1][0],t[1][1]]});for(var i=1;i+2<r;i++){var h=t[i];o[0]=[h[0],h[1]],o[1]=[h[0]+(s*t[i+1][0]-s*t[i-1][0])/6,h[1]+(s*t[i+1][1]-s*t[i-1][1])/6],o[2]=[t[i+1][0]+(s*t[i][0]-s*t[i+2][0])/6,t[i+1][1]+(s*t[i][1]-s*t[i+2][1])/6],o[3]=[t[i+1][0],t[i+1][1]],a.push({op:"bcurveTo",data:[o[1][0],o[1][1],o[2][0],o[2][1],o[3][0],o[3][1]]})}if(e&&2===e.length){var u=n.maxRandomnessOffset;a.push({op:"lineTo",data:[e[0]+G(u,n),e[1]+G(u,n)]})}}else 3===r?(a.push({op:"move",data:[t[1][0],t[1][1]]}),a.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===r&&a.push.apply(a,q(t[0][0],t[0][1],t[1][0],t[1][1],n));return a}function Z(t,e,n,r,a,o,s,i){var h=[],u=[],p=G(.5,i)-Math.PI/2;u.push([G(o,i)+e+.9*r*Math.cos(p-t),G(o,i)+n+.9*a*Math.sin(p-t)]);for(var c=p;c<2*Math.PI+p-.01;c+=t){var l=[G(o,i)+e+r*Math.cos(c),G(o,i)+n+a*Math.sin(c)];h.push(l),u.push(l)}return u.push([G(o,i)+e+r*Math.cos(p+2*Math.PI+.5*s),G(o,i)+n+a*Math.sin(p+2*Math.PI+.5*s)]),u.push([G(o,i)+e+.98*r*Math.cos(p+s),G(o,i)+n+.98*a*Math.sin(p+s)]),u.push([G(o,i)+e+.9*r*Math.cos(p+.5*s),G(o,i)+n+.9*a*Math.sin(p+.5*s)]),[u,h]}function D(t,e,n,r,a,o,s,i,h){var u=o+G(.1,h),p=[];p.push([G(i,h)+e+.9*r*Math.cos(u-t),G(i,h)+n+.9*a*Math.sin(u-t)]);for(var c=u;c<=s;c+=t)p.push([G(i,h)+e+r*Math.cos(c),G(i,h)+n+a*Math.sin(c)]);return p.push([e+r*Math.cos(s),n+a*Math.sin(s)]),p.push([e+r*Math.cos(s),n+a*Math.sin(s)]),N(p,null,h)}function Q(t){return[...t]}function H(t,e){return Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2)}function V(t,e,n){const r=H(e,n);if(0===r)return H(t,e);let a=((t[0]-e[0])*(n[0]-e[0])+(t[1]-e[1])*(n[1]-e[1]))/r;return a=Math.max(0,Math.min(1,a)),H(t,$(e,n,a))}function $(t,e,n){return[t[0]+(e[0]-t[0])*n,t[1]+(e[1]-t[1])*n]}function B(t,e,n,r){const a=r||[];if(function(t,e){const n=t[e+0],r=t[e+1],a=t[e+2],o=t[e+3];let s=3*r[0]-2*n[0]-o[0];s*=s;let i=3*r[1]-2*n[1]-o[1];i*=i;let h=3*a[0]-2*o[0]-n[0];h*=h;let u=3*a[1]-2*o[1]-n[1];return u*=u,s<h&&(s=h),i<u&&(i=u),s+i}(t,e)<n){const n=t[e+0];if(a.length){(o=a[a.length-1],s=n,Math.sqrt(H(o,s)))>1&&a.push(n)}else a.push(n);a.push(t[e+3])}else{const r=.5,o=t[e+0],s=t[e+1],i=t[e+2],h=t[e+3],u=$(o,s,r),p=$(s,i,r),c=$(i,h,r),l=$(u,p,r),f=$(p,c,r),d=$(l,f,r);B([o,u,l,d],0,n,a),B([d,f,c,h],0,n,a)}var o,s;return a}function X(t,e){return J(t,0,t.length,e)}function J(t,e,n,r,a){const o=a||[],s=t[e],i=t[n-1];let h=0,u=1;for(let r=e+1;r<n-1;++r){const e=V(t[r],s,i);e>h&&(h=e,u=r)}return Math.sqrt(h)>r?(J(t,e,u+1,r,o),J(t,u,n,r,o)):(o.length||o.push(s),o.push(i)),o}function K(t,e=.15,n){const r=[],a=(t.length-1)/3;for(let n=0;n<a;n++){B(t,3*n,e,r)}return n&&n>0?J(r,0,r.length,n):r}var U="none",Y=function(){function t(t){this.defaultOptions={maxRandomnessOffset:2,roughness:1,bowing:1,stroke:"#000",strokeWidth:1,curveTightness:0,curveFitting:.95,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1,dashOffset:-1,dashGap:-1,zigzagOffset:-1,seed:0,combineNestedSvgPaths:!1},this.config=t||{},this.config.options&&(this.defaultOptions=this._o(this.config.options))}return t.newSeed=function(){return Math.floor(Math.random()*Math.pow(2,31))},t.prototype._o=function(t){return t?Object.assign({},this.defaultOptions,t):this.defaultOptions},t.prototype._d=function(t,e,n){return{shape:t,sets:e||[],options:n||this.defaultOptions}},t.prototype.line=function(t,e,n,r,a){var o=this._o(a);return this._d("line",[S(t,e,n,r,o)],o)},t.prototype.rectangle=function(t,e,n,r,a){var o=this._o(a),s=[],i=_(t,e,n,r,o);if(o.fill){var h=[[t,e],[t+n,e],[t+n,e+r],[t,e+r]];"solid"===o.fillStyle?s.push(E(h,o)):s.push(z(h,o))}return o.stroke!==U&&s.push(i),this._d("rectangle",s,o)},t.prototype.ellipse=function(t,e,n,r,a){var o=this._o(a),s=[],i=I(n,r,o),h=C(t,e,o,i);if(o.fill)if("solid"===o.fillStyle){var u=C(t,e,o,i).opset;u.type="fillPath",s.push(u)}else s.push(z(h.estimatedPoints,o));return o.stroke!==U&&s.push(h.opset),this._d("ellipse",s,o)},t.prototype.circle=function(t,e,n,r){var a=this.ellipse(t,e,n,n,r);return a.shape="circle",a},t.prototype.linearPath=function(t,e){var n=this._o(e);return this._d("linearPath",[T(t,!1,n)],n)},t.prototype.arc=function(t,e,n,r,a,o,s,i){void 0===s&&(s=!1);var h=this._o(i),u=[],p=W(t,e,n,r,a,o,s,!0,h);if(s&&h.fill)if("solid"===h.fillStyle){var c=W(t,e,n,r,a,o,!0,!1,h);c.type="fillPath",u.push(c)}else u.push(function(t,e,n,r,a,o,s){var i=t,h=e,u=Math.abs(n/2),p=Math.abs(r/2);u+=G(.01*u,s),p+=G(.01*p,s);for(var c=a,l=o;c<0;)c+=2*Math.PI,l+=2*Math.PI;l-c>2*Math.PI&&(c=0,l=2*Math.PI);for(var f=(l-c)/s.curveStepCount,d=[],v=c;v<=l;v+=f)d.push([i+u*Math.cos(v),h+p*Math.sin(v)]);return d.push([i+u*Math.cos(l),h+p*Math.sin(l)]),d.push([i,h]),z(d,s)}(t,e,n,r,a,o,h));return h.stroke!==U&&u.push(p),this._d("arc",u,h)},t.prototype.curve=function(t,e){var n=this._o(e),r=[],a=function(t,e){var n=F(t,1*(1+.2*e.roughness),e),r=F(t,1.5*(1+.22*e.roughness),e);return{type:"path",ops:n.concat(r)}}(t,n);if(n.fill&&n.fill!==U&&t.length>=3){var o=K(function(t,e=0){const n=t.length;if(n<3)throw new Error("A curve must have at least three points.");const r=[];if(3===n)r.push(Q(t[0]),Q(t[1]),Q(t[2]),Q(t[2]));else{const n=[];n.push(t[0],t[0]);for(let e=1;e<t.length;e++)n.push(t[e]),e===t.length-1&&n.push(t[e]);const a=[],o=1-e;r.push(Q(n[0]));for(let t=1;t+2<n.length;t++){const e=n[t];a[0]=[e[0],e[1]],a[1]=[e[0]+(o*n[t+1][0]-o*n[t-1][0])/6,e[1]+(o*n[t+1][1]-o*n[t-1][1])/6],a[2]=[n[t+1][0]+(o*n[t][0]-o*n[t+2][0])/6,n[t+1][1]+(o*n[t][1]-o*n[t+2][1])/6],a[3]=[n[t+1][0],n[t+1][1]],r.push(a[1],a[2],a[3])}}return r}(t),10,(1+n.roughness)/2);"solid"===n.fillStyle?r.push(E(o,n)):r.push(z(o,n))}return n.stroke!==U&&r.push(a),this._d("curve",r,n)},t.prototype.polygon=function(t,e){var n=this._o(e),r=[],a=T(t,!0,n);return n.fill&&("solid"===n.fillStyle?r.push(E(t,n)):r.push(z(t,n))),n.stroke!==U&&r.push(a),this._d("polygon",r,n)},t.prototype.path=function(t,e){var n=this._o(e),r=[];if(!t)return this._d("path",r,n);t=(t||"").replace(/\n/g," ").replace(/(-\s)/g,"-").replace("/(ss)/g"," ");var a=n.fill&&"transparent"!==n.fill&&n.fill!==U,o=n.stroke!==U,s=!!(n.simplification&&n.simplification<1),i=function(t,e,n){const r=w(b(m(t))),a=[];let o=[],s=[0,0],i=[];const h=()=>{i.length>=4&&o.push(...K(i,e)),i=[]},u=()=>{h(),o.length&&(a.push(o),o=[])};for(const{key:t,data:e}of r)switch(t){case"M":u(),s=[e[0],e[1]],o.push(s);break;case"L":h(),o.push([e[0],e[1]]);break;case"C":if(!i.length){const t=o.length?o[o.length-1]:s;i.push([t[0],t[1]])}i.push([e[0],e[1]]),i.push([e[2],e[3]]),i.push([e[4],e[5]]);break;case"Z":h(),o.push([s[0],s[1]])}if(u(),!n)return a;const p=[];for(const t of a){const e=X(t,n);e.length&&p.push(e)}return p}(t,1,s?4-4*n.simplification:(1+n.roughness)/2);if(a)if(n.combineNestedSvgPaths){var h=[];i.forEach((function(t){return h.push.apply(h,t)})),"solid"===n.fillStyle?r.push(E(h,n)):r.push(z(h,n))}else i.forEach((function(t){"solid"===n.fillStyle?r.push(E(t,n)):r.push(z(t,n))}));return o&&(s?i.forEach((function(t){r.push(T(t,!1,n))})):r.push(L(t,n))),this._d("path",r,n)},t.prototype.opsToPath=function(t){for(var e="",n=0,r=t.ops;n<r.length;n++){var a=r[n],o=a.data;switch(a.op){case"move":e+="M"+o[0]+" "+o[1]+" ";break;case"bcurveTo":e+="C"+o[0]+" "+o[1]+", "+o[2]+" "+o[3]+", "+o[4]+" "+o[5]+" ";break;case"lineTo":e+="L"+o[0]+" "+o[1]+" "}}return e.trim()},t.prototype.toPaths=function(t){for(var e=t.sets||[],n=t.options||this.defaultOptions,r=[],a=0,o=e;a<o.length;a++){var s=o[a],i=null;switch(s.type){case"path":i={d:this.opsToPath(s),stroke:n.stroke,strokeWidth:n.strokeWidth,fill:U};break;case"fillPath":i={d:this.opsToPath(s),stroke:U,strokeWidth:0,fill:n.fill||U};break;case"fillSketch":i=this.fillSketch(s,n)}i&&r.push(i)}return r},t.prototype.fillSketch=function(t,e){var n=e.fillWeight;return n<0&&(n=e.strokeWidth/2),{d:this.opsToPath(t),stroke:e.fill||U,strokeWidth:n,fill:U}},t}(),tt=function(){function t(t,e){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.gen=new Y(e)}return t.prototype.draw=function(t){for(var e=t.sets||[],n=t.options||this.getDefaultOptions(),r=this.ctx,a=0,o=e;a<o.length;a++){var s=o[a];switch(s.type){case"path":r.save(),r.strokeStyle="none"===n.stroke?"transparent":n.stroke,r.lineWidth=n.strokeWidth,this._drawToContext(r,s),r.restore();break;case"fillPath":r.save(),r.fillStyle=n.fill||"";var i="curve"===t.shape||"polygon"===t.shape?"evenodd":"nonzero";this._drawToContext(r,s,i),r.restore();break;case"fillSketch":this.fillSketch(r,s,n)}}},t.prototype.fillSketch=function(t,e,n){var r=n.fillWeight;r<0&&(r=n.strokeWidth/2),t.save(),t.strokeStyle=n.fill||"",t.lineWidth=r,this._drawToContext(t,e),t.restore()},t.prototype._drawToContext=function(t,e,n){void 0===n&&(n="nonzero"),t.beginPath();for(var r=0,a=e.ops;r<a.length;r++){var o=a[r],s=o.data;switch(o.op){case"move":t.moveTo(s[0],s[1]);break;case"bcurveTo":t.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5]);break;case"lineTo":t.lineTo(s[0],s[1])}}"fillPath"===e.type?t.fill(n):t.stroke()},Object.defineProperty(t.prototype,"generator",{get:function(){return this.gen},enumerable:!0,configurable:!0}),t.prototype.getDefaultOptions=function(){return this.gen.defaultOptions},t.prototype.line=function(t,e,n,r,a){var o=this.gen.line(t,e,n,r,a);return this.draw(o),o},t.prototype.rectangle=function(t,e,n,r,a){var o=this.gen.rectangle(t,e,n,r,a);return this.draw(o),o},t.prototype.ellipse=function(t,e,n,r,a){var o=this.gen.ellipse(t,e,n,r,a);return this.draw(o),o},t.prototype.circle=function(t,e,n,r){var a=this.gen.circle(t,e,n,r);return this.draw(a),a},t.prototype.linearPath=function(t,e){var n=this.gen.linearPath(t,e);return this.draw(n),n},t.prototype.polygon=function(t,e){var n=this.gen.polygon(t,e);return this.draw(n),n},t.prototype.arc=function(t,e,n,r,a,o,s,i){void 0===s&&(s=!1);var h=this.gen.arc(t,e,n,r,a,o,s,i);return this.draw(h),h},t.prototype.curve=function(t,e){var n=this.gen.curve(t,e);return this.draw(n),n},t.prototype.path=function(t,e){var n=this.gen.path(t,e);return this.draw(n),n},t}(),et="http://www.w3.org/2000/svg",nt=function(){function t(t,e){this.svg=t,this.gen=new Y(e)}return t.prototype.draw=function(t){for(var e=t.sets||[],n=t.options||this.getDefaultOptions(),r=this.svg.ownerDocument||window.document,a=r.createElementNS(et,"g"),o=0,s=e;o<s.length;o++){var i=s[o],h=null;switch(i.type){case"path":(h=r.createElementNS(et,"path")).setAttribute("d",this.opsToPath(i)),h.style.stroke=n.stroke,h.style.strokeWidth=n.strokeWidth+"",h.style.fill="none";break;case"fillPath":(h=r.createElementNS(et,"path")).setAttribute("d",this.opsToPath(i)),h.style.stroke="none",h.style.strokeWidth="0",h.style.fill=n.fill||"";break;case"fillSketch":h=this.fillSketch(r,i,n)}h&&a.appendChild(h)}return a},t.prototype.fillSketch=function(t,e,n){var r=n.fillWeight;r<0&&(r=n.strokeWidth/2);var a=t.createElementNS(et,"path");return a.setAttribute("d",this.opsToPath(e)),a.style.stroke=n.fill||"",a.style.strokeWidth=r+"",a.style.fill="none",a},Object.defineProperty(t.prototype,"generator",{get:function(){return this.gen},enumerable:!0,configurable:!0}),t.prototype.getDefaultOptions=function(){return this.gen.defaultOptions},t.prototype.opsToPath=function(t){return this.gen.opsToPath(t)},t.prototype.line=function(t,e,n,r,a){var o=this.gen.line(t,e,n,r,a);return this.draw(o)},t.prototype.rectangle=function(t,e,n,r,a){var o=this.gen.rectangle(t,e,n,r,a);return this.draw(o)},t.prototype.ellipse=function(t,e,n,r,a){var o=this.gen.ellipse(t,e,n,r,a);return this.draw(o)},t.prototype.circle=function(t,e,n,r){var a=this.gen.circle(t,e,n,r);return this.draw(a)},t.prototype.linearPath=function(t,e){var n=this.gen.linearPath(t,e);return this.draw(n)},t.prototype.polygon=function(t,e){var n=this.gen.polygon(t,e);return this.draw(n)},t.prototype.arc=function(t,e,n,r,a,o,s,i){void 0===s&&(s=!1);var h=this.gen.arc(t,e,n,r,a,o,s,i);return this.draw(h)},t.prototype.curve=function(t,e){var n=this.gen.curve(t,e);return this.draw(n)},t.prototype.path=function(t,e){var n=this.gen.path(t,e);return this.draw(n)},t}(),rt={canvas:function(t,e){return new tt(t,e)},svg:function(t,e){return new nt(t,e)},generator:function(t){return new Y(t)},newSeed:function(){return Y.newSeed()}};module.exports=rt;

},{}]},{},[]);
