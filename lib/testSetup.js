'use strict';

global.window = {
  location: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000/initial'
  },
  history: {}
};
global.history = {
  pushState: function pushState(_, __, value) {
    window.location.href = window.location.origin + value;
    window.location.lastChangedWith = 'pushState';
  },
  replaceState: function replaceState(_, __, value) {
    window.location.href = window.location.origin + value;
    window.location.lastChangedWith = 'replaceState';
  }
};
global.addEventListener = global.window.addEventListener = function () {};
global.window.CustomEvent = function () {};
global.window.dispatchEvent = function () {};
global.document = {};
console.warn = function (message) {
  console.warn.warnings.push(message);
};
console.warn.warnings = [];
//# sourceMappingURL=testSetup.js.map