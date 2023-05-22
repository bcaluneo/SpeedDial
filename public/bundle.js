(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.browser = require("webextension-polyfill");

},{"webextension-polyfill":2}],2:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.8.0 - Tue Apr 20 2021 11:27:38 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      }); // Keep track if the deprecation warning has been logged at least once.

      let loggedSendResponseDeprecationWarning = false;
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }

              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    if (typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
      throw new Error("This script should only be loaded in a browser extension.");
    } // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});


},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setClock = setClock;

function setClock() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  let hPad = false;
  let mPad = false;
  let sPad = false;
  let pm = false;

  if (h > 12) {
    h -= 12;
    pm = true;
  }

  if (h == 12) pm = true;
  if (h == 0) h = 12;
  if (h < 10) hPad = true;
  if (m < 10) mPad = true;
  if (s < 10) sPad = true;
  let timeString = "";
  timeString += (hPad ? "0" + h : h) + ":" + (mPad ? "0" + m : m) + ":" + (sPad ? "0" + s : s) + (pm ? " PM" : " AM");
  document.getElementById("clock").textContent = timeString;
  setTimeout(setClock, 1000);
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGrid = initGrid;

// All the source code and shit related to controlling the speed dials.
class DialContext {
  Dials;
}

;

class DialObject {
  Title;
  UUID;
  Clicks;
  Link;
}

;
const dialGrid = document.getElementById("dial-grid"); // <div id="0" class="grid-item">
// HackForums
// </div>

function initGrid() {
  if (localStorage.getItem("DialContext") == null) {
    fetch('public/dials.json').then(response => response.text()).then(responseText => {
      let json = JSON.parse(responseText);
      localStorage.setItem("DialContext", JSON.stringify(json));
      json2html(localStorage.getItem("DialContext"));
    });
  } else {
    json2html(localStorage.getItem("DialContext"));
  }
}

function createDialHTML(dial) {
  let div = document.createElement("div");
  div.className = "grid-item";
  div.id = dial.UUID;
  div.textContent = dial.Title;
  return div;
}

function json2html(json) {
  var dials = JSON.parse(json).DialContext.Dials;

  if (dials != undefined) {
    dials.forEach(dial => {
      var dialHtml = createDialHTML(dial);
      dialGrid.appendChild(dialHtml);
    });
  }
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteItem = deleteItem;
exports.init = init;
exports.isEditing = isEditing;
exports.onDragItem = onDragItem;
exports.processClick = processClick;
exports.saveMenu = saveMenu;
exports.toggleEditing = toggleEditing;

var _parser = require("./parser");

var _menu = require("./menu");

var _webextensionPolyfillTs = require("webextension-polyfill-ts");

const contextMenu = document.getElementById("context-menu");
const editorMenu = document.getElementsByClassName("editor")[0];
var dragged, hovered;
var editing = false;

function setEditorPosition() {
  let editorTop = contextMenu.getBoundingClientRect().top - editorMenu.getBoundingClientRect().height - 4;
  let width = contextMenu.getBoundingClientRect().width - editorMenu.getBoundingClientRect().width;
  let editorLeft = contextMenu.getBoundingClientRect().left + width / 2;
  editorMenu.style.top = `${editorTop}px`;
  editorMenu.style.left = `${editorLeft}px`;
  editorMenu.style.visibility = "visible";
}

function processClick(target) {
  let parent = target.parentNode;

  if (parent.id == "editor-control-export" || target.id == "editor-control-export") {
    downloadMenuJSON();
  }
}

function onDragItem(event) {
  event.dataTransfer.setData('text/plain', null);
  let target = event.target;
  if (target.tagName == "A") dragged = target.parentNode;else dragged = target;
}

function isDraggingControl() {
  return dragged.id.substring("editor-control".length + 1).length != 0;
}

function isDraggedControl(check) {
  if (!isDraggingControl()) return false;
  let control = dragged.id.substring("editor-control".length + 1);
  return control == check;
}

function init() {
  document.addEventListener("dragend", function (event) {
    if (!isEditing()) return;
    event.preventDefault();
  });
  document.addEventListener("dragover", function (event) {
    if (!isEditing()) return;
    event.preventDefault();
    processDragOver(event.target);
  }, false);
  document.addEventListener("drop", function (event) {
    if (!isEditing()) return;
    event.preventDefault();
    processDrop(event.target);
  }, false);
}

function toggleEditing() {
  editing = !editing;

  if (!editing) {
    editorMenu.style.visibility = "hidden";
    contextMenu.style.borderColor = "#777474";
    saveMenu();
  } else {
    contextMenu.style.borderColor = "orange";
    setEditorPosition();
  }
}

function isEditing() {
  return editing;
}

function deleteItem(item, prompt = false) {
  let accept = true;

  if (prompt) {
    accept = confirm("Are you sure you want to delete this?");
  }

  if (accept) {
    let parent = item.parentNode;
    parent.removeChild(item);
    item = null;
    saveMenu();
  }
} // TODO: This doesn't let you change the URL if it's a link item.


function renameItem(item) {
  let isMenu = item.id != "";
  let name = prompt("Edit item name", isMenu ? item.firstChild.textContent : item.textContent);
  if (name == null) return;

  if (isMenu) {
    item.firstChild.textContent = name;
  } else {
    item.firstElementChild.textContent = name;
  }

  saveMenu();
}

function createItem(parent) {
  let name = prompt("Item name");
  if (name == null) return;
  let url = prompt("Item URL");
  if (url == null) return;
  let div = (0, _parser.createItemHTML)(name, url);
  parent.appendChild(div);
  saveMenu();
}

function createMenu(parent) {
  let name = prompt("Item name");
  if (name == null) return;
  let div = (0, _parser.createMenuHTML)(name, name);
  let sdiv = (0, _parser.createSubMenuDIV)(name);
  parent.appendChild(div);
  parent.appendChild(sdiv);
  saveMenu();
}

function saveMenu() {
  let json = (0, _parser.html2json)(contextMenu);
  localStorage.setItem("swamplinks", JSON.stringify(json));
}

function processDragOver(target) {
  target = (0, _menu.getMenuItem)(target);
  let isMenuItem = target.className == "item" || target.id == "context-menu" || target.className == "secondary-menu";
  let isInHeader = (target.tagName == "IMG" || target.tagName == "HR") && target.parentNode.className == "header";
  let isHeader = target.className == "header";
  if (isInHeader || isHeader) target = contextMenu;

  if (!(isMenuItem || isInHeader || isHeader)) {
    if (hovered != null) {
      hovered.style.background = "#3F3D3D";
      hovered = null;
    }

    return;
  }

  if (isDraggedControl("edit") && target.id == "context-menu" || target.id == "secondary-menu") return;

  if (hovered != null) {
    hovered.style.background = "#3F3D3D";
  }

  hovered = target;
  target.style.background = "#777474";
}

function processDrop(target) {
  if (hovered != null) {
    hovered.style.background = "#3F3D3D";
    hovered = null;
  }

  if (!dragged.id.startsWith("editor") && (target.id == "delete" || target.id == "delete-icon")) {
    if (dragged.id != "") {
      deleteItem(document.getElementById(dragged.id + "-menu"), true);
    }

    deleteItem(dragged, true);
    return;
  }

  let control = dragged.id.substring("editor-control".length + 1);
  target = (0, _menu.getMenuItem)(target);
  let isInHeader = (target.tagName == "IMG" || target.tagName == "HR") && target.parentNode.className == "header";
  let isHeader = target.className == "header";
  if (isInHeader || isHeader) target = contextMenu;
  let hasDroppedOntoItem = dragged.className == "item" && target.className == "item" && dragged != target;

  if (hasDroppedOntoItem) {
    if (dragged.parentNode.id == "context-menu") (0, _menu.hideSubMenus)();
    swapItems(target, dragged);
    saveMenu();
    return;
  } // prevents edit controls from being dropped onto other edit controls.


  if (control.length == 0 || !(target.className == "item" || target.id == "context-menu")) return; // prevents the context menu from being renamed (not sure what would happen).

  if (isDraggedControl("edit") && target == contextMenu) return;

  switch (control) {
    case "newMenu":
      if (target.id != "") {
        let actual = document.getElementById(target.id + "-menu");
        createMenu(actual == null ? target : actual);
      }

      break;

    case "newItem":
      if (target.id != "") {
        let actual = document.getElementById(target.id + "-menu");
        createItem(actual == null ? target : actual);
      }

      break;

    case "edit":
      renameItem(target);
      break;
  }
}

function swapItems(first, second) {
  if (first.parentNode != second.parentNode) return;
  let parent = first.parentNode;
  let firstCopy = first.cloneNode(true);
  let secondCopy = second.cloneNode(true);
  parent.insertBefore(firstCopy, second).addEventListener("dragstart", onDragItem);
  parent.insertBefore(secondCopy, first).addEventListener("dragstart", onDragItem);
  parent.removeChild(first);
  parent.removeChild(second);
}

function downloadMenuJSON() {
  var link = (0, _parser.createMenuURL)();

  let downloadPromise = _webextensionPolyfillTs.browser.downloads.download({
    url: link,
    filename: 'Menu Configuration.json'
  });

  _webextensionPolyfillTs.browser.downloads.onChanged.addListener(downloadDelta => {
    URL.revokeObjectURL(link);
  });
}

},{"./menu":7,"./parser":8,"webextension-polyfill-ts":1}],6:[function(require,module,exports){
"use strict";

var Parser = _interopRequireWildcard(require("./parser"));

var Editor = _interopRequireWildcard(require("./editor"));

var Dial = _interopRequireWildcard(require("./dial"));

var Menu = _interopRequireWildcard(require("./menu"));

var _clock = require("./clock");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const APP_NAME = "Speed Dial";
const contextMenu = document.getElementById("context-menu");
(0, _clock.setClock)();
Parser.initMenu();
Dial.initGrid(); // Overwrites the default right-click handler to display my custom menu.

document.addEventListener("contextmenu", event => {
  event.preventDefault();
  if (Editor.isEditing()) return;
  Menu.hideAllMenus();

  if (event.target.className == "grid-item") {} else {
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.classList.add("visible");
  }
});
document.addEventListener("click", event => {
  if (Editor.isEditing()) event.preventDefault();
  let target = Menu.getMenuItem(event.target);
  let isHeader = target.className == "header";

  if (isHeader || target.id == "context-menu") {
    Menu.hideSubMenus();
  }

  if (target.className == "item") {
    let menu = document.getElementById(`${target.id}-menu`);

    if (menu != null && menu.childElementCount > 0) {
      Menu.hideSubMenus();

      if (menu.style.visibility == "hidden") {
        Menu.drawMenu(target, menu, menu.className == "secondary-menu");
      } else {
        menu.style.visibility = "hidden";
      }

      return;
    }

    if (!Editor.isEditing()) {
      if (target.id == "") {
        let link = target.firstElementChild;
        window.location.href = link.href;
      }

      return;
    }
  } else {
    let parent = target.parentNode;

    if (parent.className == "header" && target.tagName == "IMG") {
      Editor.toggleEditing();
      Menu.hideSubMenus();
      return;
    }

    if (!Editor.isEditing()) {
      // make this its own function
      let id = "";

      if (target.className == "grid-item") {
        id = target.id;
      } else if (target.tagName == "IMG") {
        id = parent.parentNode.id;
      } else if (target.tagName == "A") {
        let child = target.firstElementChild;
        id = child.id;
      }

      if (id != "") {
        let clickVariable = localStorage.getItem(`dial${id}-clicks`);

        if (clickVariable == null) {
          localStorage.setItem(`dial${id}-clicks`, "1");
        } else {
          let clickCount = +clickVariable;
          clickCount++;
          localStorage.setItem(`dial${id}-clicks`, `${clickCount}`);
        }
      }

      if (!Menu.isTargetInContextMenu(event)) Menu.hideAllMenus();
    } else {
      Editor.processClick(target);
    }
  }
});

},{"./clock":3,"./dial":4,"./editor":5,"./menu":7,"./parser":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateMenuIX = calculateMenuIX;
exports.drawMenu = drawMenu;
exports.getMenuItem = getMenuItem;
exports.hideAllMenus = hideAllMenus;
exports.hideSubMenus = hideSubMenus;
exports.isTargetInContextMenu = isTargetInContextMenu;
exports.makeParentsVisible = makeParentsVisible;
const contextMenu = document.getElementById("context-menu");

function isTargetInContextMenu(event) {
  let menuX = contextMenu.getBoundingClientRect().x;
  let menuY = contextMenu.getBoundingClientRect().y;
  let menuWidth = contextMenu.getBoundingClientRect().width;
  let menuHeight = contextMenu.getBoundingClientRect().height;
  let x = event.clientX;
  let y = event.clientY;
  return x >= menuX && x <= menuX + menuWidth && y >= menuY && y <= menuY + menuHeight;
} // TODO, clean this up.


function getMenuItem(target) {
  if (target.tagName == "I" && target.parentNode.parentNode.className != "editor") target = target.parentNode.parentNode;
  if (target.className == "menu-icon") target = target.parentNode;
  if (target.tagName == "A") target = target.parentNode;
  return target;
}

function drawMenu(div, menu, isSubMenu) {
  let parent = menu.parentNode;
  let top = 0;
  let ix = Array.from(div.parentNode.children).indexOf(div) - 1;
  if (isSubMenu && parent.id != "context-menu") ix++;
  if (ix < 0) ix = 0;
  hideSubMenus();

  if (parent.id == "context-menu") {
    top = document.getElementsByClassName("header")[0].getBoundingClientRect().height + 7;
    menu.style.left = "155px";
  } else {
    top = div.clientTop - 1;
    menu.style.left = `${parent.clientWidth + 5}px`;
    makeParentsVisible(div);
  }

  top += div.getBoundingClientRect().height * ix;
  menu.style.top = `${top}px`;
  menu.style.visibility = "visible";
}

function makeParentsVisible(div) {
  let parent = div.parentNode;

  do {
    parent.style.visibility = "visible";
    div = parent;
    parent = div.parentNode;
  } while (parent != null && parent.id != "context-menu");
}

function calculateMenuIX(div) {
  let parent = div.parentNode;

  do {
    div = parent;
    parent = div.parentNode;
  } while (parent != null && parent.id != "context-menu");

  div = document.getElementById(`${div.id.split("-")[0]}`);
  return Array.from(div.parentNode.children).indexOf(div) - 1;
}

function hideSubMenus() {
  let subMenus = document.getElementsByClassName("secondary-menu");
  [].forEach.call(subMenus, function (menu) {
    menu.style.visibility = "hidden";
  });
}

function hideAllMenus() {
  contextMenu.classList.remove("visible");
  hideSubMenus();
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createItemHTML = createItemHTML;
exports.createMenuHTML = createMenuHTML;
exports.createMenuURL = createMenuURL;
exports.createSubMenuDIV = createSubMenuDIV;
exports.createSubMenuHTML = createSubMenuHTML;
exports.html2json = html2json;
exports.initMenu = initMenu;
exports.items2html = items2html;
exports.json2html = json2html;

var Editor = _interopRequireWildcard(require("./editor"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const contextMenu = document.getElementById("context-menu");

class MenuJson {
  menus;
}

;

class MenuObject {
  type;
  parentId;
  id;
  items;
}

;

class ItemObject {
  id;
  text;
  link;
}

;

function initMenu() {
  if (localStorage.getItem("MenuContext") == null) {
    fetch('public/swamplinks.json').then(response => response.text()).then(responseText => {
      let json = JSON.parse(responseText);
      localStorage.setItem("MenuContext", JSON.stringify(json));
      json2html(localStorage.getItem("MenuContext"));
    });
  } else {
    json2html(localStorage.getItem("MenuContext"));
  }

  Editor.init();
  document.getElementById("editor-control-edit").addEventListener("dragstart", Editor.onDragItem);
  document.getElementById("editor-control-newMenu").addEventListener("dragstart", Editor.onDragItem);
  document.getElementById("editor-control-newItem").addEventListener("dragstart", Editor.onDragItem);
}

function items2html(parent, items) {
  items = items.reverse();
  [].forEach.call(items, function (item) {
    let div;

    if (item.link != "") {
      div = createItemHTML(item.text, item.link);
    } else {
      div = createMenuHTML(item.text, item.id);
    }

    div.addEventListener("dragstart", Editor.onDragItem);
    div.draggable = true;
    parent.prepend(div);
  });
}

function createItemHTML(text, link) {
  let div = document.createElement("div");
  let a = document.createElement("a");
  div.className = "item";
  a.href = link;
  a.textContent = text;
  div.addEventListener("dragstart", Editor.onDragItem);
  div.draggable = true;
  div.appendChild(a);
  div.style.cursor = "pointer";
  return div;
}

function createMenuHTML(text, menuID) {
  let div = document.createElement("div");
  div.className = "item";
  div.id = menuID;
  div.textContent = text;
  let iconDiv = document.createElement("div");
  let icon = document.createElement("i");
  iconDiv.style.textAlign = "right";
  iconDiv.className = "menu-icon";
  icon.className = "material-icons";
  icon.textContent = "keyboard_double_arrow_right";
  iconDiv.appendChild(icon);
  div.appendChild(iconDiv);
  div.addEventListener("dragstart", Editor.onDragItem);
  div.draggable = true;
  return div;
}

function createSubMenuDIV(menuID) {
  let div = document.createElement("div");
  div.className = "secondary-menu";
  div.id = menuID + "-menu";
  return div;
}

function createSubMenuHTML(divId, items) {
  let div = document.createElement("div");
  div.id = divId;
  div.className = "secondary-menu";
  items2html(div, items);
  return div;
}

function json2html(json) {
  let obj = JSON.parse(json);
  let contextMenus = obj.menus;
  let header = document.createElement("div");
  let fox = document.createElement("img");
  let hr = document.createElement("hr");
  let topHr = document.createElement("hr");
  fox.src = "public/assets/fox.png";
  header.className = "header";
  header.appendChild(fox);
  header.appendChild(hr);
  header.prepend(topHr);

  while (contextMenus.length > 0) {
    [].forEach.call(contextMenus, function (menu, index) {
      if (menu.type == "context-menu") {
        items2html(contextMenu, menu.items);
        contextMenu.prepend(header);
        contextMenus.splice(index, 1);
      } else {
        let parentDiv = document.getElementById(menu.parentId);

        if (parentDiv != null) {
          let menuDiv = createSubMenuHTML(menu.id, menu.items);
          parentDiv.appendChild(menuDiv);
          contextMenus.splice(index, 1);
        }
      }
    });
  }
}

function div2json(json, div) {
  let result = new MenuObject();
  let subMenus = div.getElementsByClassName("secondary-menu");
  let items = div.getElementsByClassName("item");
  result.items = [];

  if (div.id == "context-menu") {
    result.type = "context-menu";
    result.parentId = "context-menu";
    result.id = "context-menu";
  } else {
    result.type = "secondary-menu";
    result.parentId = div.parentNode.id;
    result.id = div.id;
  }

  Array.from(items).forEach(function (item) {
    if (item.parentNode != div) return;
    let itemObj = {};
    itemObj.id = item.id;
    itemObj.text = item.textContent.replace("keyboard_double_arrow_right", "");

    if (item.childElementCount > 0) {
      if (item.firstElementChild.tagName == "A") {
        itemObj.link = item.firstElementChild.href;
      } else itemObj.link = "";
    }

    result.items.push(itemObj);
  });
  Array.from(subMenus).forEach(function (menu) {
    if (menu.parentNode != div) return;
    div2json(json, menu);
  });
  json.menus.push(result);
}

function html2json(div) {
  let json = new MenuJson();
  json.menus = [];
  div2json(json, div);
  return json;
}

function createMenuURL() {
  return URL.createObjectURL(new Blob([JSON.stringify(html2json(contextMenu), undefined, 2)], {
    type: 'application/json'
  }));
}

},{"./editor":5}]},{},[6]);
