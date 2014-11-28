/*! 
Included shims: Array.forEach,Array.filter,Array.map,Function.bind,EventListener,Element.classList
*/

/*
    Array.prototype.forEach()
*/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(t, e) {
        var n, r;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var i = Object(this);
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var o = i.length >>> 0;
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof t !== "function") {
            throw new TypeError(t + " is not a function");
        }
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (e) {
            n = e;
        }
        // 6. Let k be 0
        r = 0;
        // 7. Repeat, while k < len
        while (r < o) {
            var a;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (r in i) {
                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                a = i[r];
                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                t.call(n, a, r, i);
            }
            // d. Increase k by 1.
            r++;
        }
    };
}

/*
    Array.prototype.filter()
*/
if (!Array.prototype.filter) {
    Array.prototype.filter = function(t) {
        "use strict";
        if (this === void 0 || this === null) throw new TypeError();
        var e = Object(this);
        var n = e.length >>> 0;
        if (typeof t !== "function") throw new TypeError();
        var r = [];
        var i = arguments.length >= 2 ? arguments[1] : void 0;
        for (var o = 0; o < n; o++) {
            if (o in e) {
                var a = e[o];
                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (t.call(i, a, o, e)) r.push(a);
            }
        }
        return r;
    };
}

/*
   Array map patch
   ========================================================================== */
if (!("map" in Array.prototype)) {
    Array.prototype.map = function(t, e) {
        var n = this.length >>> 0, r = Array(n);
        for (var i = 0; i < n; i++) {
            if (i in this) {
                r[i] = t.call(e, this[i], i, this);
            }
        }
        return r;
    };
}

/*
    Function.prototype.bind()
*/
if (!Function.prototype.bind) {
    Function.prototype.bind = function(t) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var e = Array.prototype.slice.call(arguments, 1), n = this, r = function() {}, i = function() {
            return n.apply(this instanceof r && t ? this : t, e.concat(Array.prototype.slice.call(arguments)));
        };
        r.prototype = this.prototype;
        i.prototype = new r();
        return i;
    };
}

// EventListener | MIT/GPL2 | https://github.com/jonathantneal/EventListener
this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && function() {
    function t(t, e) {
        Window.prototype[t] = HTMLDocument.prototype[t] = Element.prototype[t] = e;
    }
    // add
    t("addEventListener", function(t, e) {
        var n = this, r = n.addEventListener.listeners = n.addEventListener.listeners || {}, i = r[t] = r[t] || [];
        // if no events exist, attach the listener
        if (!i.length) {
            n.attachEvent("on" + t, i.event = function(t) {
                var e = n.document && n.document.documentElement || n.documentElement || {
                    scrollLeft: 0,
                    scrollTop: 0
                };
                // polyfill w3c properties and methods
                t.currentTarget = n;
                t.pageX = t.clientX + e.scrollLeft;
                t.pageY = t.clientY + e.scrollTop;
                t.preventDefault = function() {
                    t.returnValue = false;
                };
                t.relatedTarget = t.fromElement || null;
                t.stopImmediatePropagation = function() {
                    s = false;
                    t.cancelBubble = true;
                };
                t.stopPropagation = function() {
                    t.cancelBubble = true;
                };
                t.target = t.srcElement || n;
                t.timeStamp = +new Date();
                // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
                for (var r = 0, o = [].concat(i), a, s = true; s && (a = o[r]); ++r) {
                    // check to see if the cached event still exists in the master events list
                    for (var l = 0, c; c = i[l]; ++l) {
                        if (c == a) {
                            c.call(n, t);
                            break;
                        }
                    }
                }
            });
        }
        // add the event to the master event list
        i.push(e);
    });
    // remove
    t("removeEventListener", function(t, e) {
        var n = this, r = n.addEventListener.listeners = n.addEventListener.listeners || {}, i = r[t] = r[t] || [];
        // remove the newest matching event from the master event list
        for (var o = i.length - 1, a; a = i[o]; --o) {
            if (a == e) {
                i.splice(o, 1);
                break;
            }
        }
        // if no events exist, detach the listener
        if (!i.length && i.event) {
            n.detachEvent("on" + t, i.event);
        }
    });
    // dispatch
    t("dispatchEvent", function(t) {
        var e = this, n = t.type, r = e.addEventListener.listeners = e.addEventListener.listeners || {}, i = r[n] = r[n] || [];
        try {
            return e.fireEvent("on" + n, t);
        } catch (o) {
            if (i.event) {
                i.event(t);
            }
            return;
        }
    });
    // CustomEvent
    Object.defineProperty(Window.prototype, "CustomEvent", {
        get: function() {
            var t = this;
            return function e(n, r) {
                var i = t.document.createEventObject(), o;
                i.type = n;
                for (o in r) {
                    if (o == "cancelable") {
                        i.returnValue = !r.cancelable;
                    } else if (o == "bubbles") {
                        i.cancelBubble = !r.bubbles;
                    } else if (o == "detail") {
                        i.detail = r.detail;
                    }
                }
                return i;
            };
        }
    });
    // ready
    function e(t) {
        if (e.interval && document.body) {
            e.interval = clearInterval(e.interval);
            document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
        }
    }
    e.interval = setInterval(e, 1);
    window.addEventListener("load", e);
}();

!this.CustomEvent && function() {
    // CustomEvent for browsers which don't natively support the Constructor method
    window.CustomEvent = function t(e, n) {
        var r;
        n = n || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        try {
            r = document.createEvent("CustomEvent");
            r.initCustomEvent(e, n.bubbles, n.cancelable, n.detail);
        } catch (i) {
            // for browsers which don't support CustomEvent at all, we use a regular event instead
            r = document.createEvent("Event");
            r.initEvent(e, n.bubbles, n.cancelable);
            r.detail = n.detail;
        }
        return r;
    };
}();

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-01-31
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*global self, document, DOMException */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if ("document" in self && !("classList" in document.createElement("_"))) {
    (function(t) {
        "use strict";
        if (!("Element" in t)) return;
        var e = "classList", n = "prototype", r = t.Element[n], i = Object, o = String[n].trim || function() {
            return this.replace(/^\s+|\s+$/g, "");
        }, a = Array[n].indexOf || function(t) {
            var e = 0, n = this.length;
            for (;e < n; e++) {
                if (e in this && this[e] === t) {
                    return e;
                }
            }
            return -1;
        }, s = function(t, e) {
            this.name = t;
            this.code = DOMException[t];
            this.message = e;
        }, l = function(t, e) {
            if (e === "") {
                throw new s("SYNTAX_ERR", "An invalid or illegal string was specified");
            }
            if (/\s/.test(e)) {
                throw new s("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }
            return a.call(t, e);
        }, c = function(t) {
            var e = o.call(t.getAttribute("class") || ""), n = e ? e.split(/\s+/) : [], r = 0, i = n.length;
            for (;r < i; r++) {
                this.push(n[r]);
            }
            this._updateClassName = function() {
                t.setAttribute("class", this.toString());
            };
        }, u = c[n] = [], f = function() {
            return new c(this);
        };
        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        s[n] = Error[n];
        u.item = function(t) {
            return this[t] || null;
        };
        u.contains = function(t) {
            t += "";
            return l(this, t) !== -1;
        };
        u.add = function() {
            var t = arguments, e = 0, n = t.length, r, i = false;
            do {
                r = t[e] + "";
                if (l(this, r) === -1) {
                    this.push(r);
                    i = true;
                }
            } while (++e < n);
            if (i) {
                this._updateClassName();
            }
        };
        u.remove = function() {
            var t = arguments, e = 0, n = t.length, r, i = false;
            do {
                r = t[e] + "";
                var o = l(this, r);
                if (o !== -1) {
                    this.splice(o, 1);
                    i = true;
                }
            } while (++e < n);
            if (i) {
                this._updateClassName();
            }
        };
        u.toggle = function(t, e) {
            t += "";
            var n = this.contains(t), r = n ? e !== true && "remove" : e !== false && "add";
            if (r) {
                this[r](t);
            }
            return !n;
        };
        u.toString = function() {
            return this.join(" ");
        };
        if (i.defineProperty) {
            var p = {
                get: f,
                enumerable: true,
                configurable: true
            };
            try {
                i.defineProperty(r, e, p);
            } catch (h) {
                // IE 8 doesn't support enumerable:true
                if (h.number === -2146823252) {
                    p.enumerable = false;
                    i.defineProperty(r, e, p);
                }
            }
        } else if (i[n].__defineGetter__) {
            r.__defineGetter__(e, f);
        }
    })(self);
}