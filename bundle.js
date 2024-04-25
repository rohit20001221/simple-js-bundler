(function (modules) {
  function require(moduleId) {
    const module = modules[moduleId];

    function localRequire(relativePath) {
      const id = module.map[relativePath];

      return require(id);
    }

    const localModule = { exports: {} };

    module.fn(localRequire, localModule, localModule.exports);

    return localModule.exports;
  }

  require(0);
})({
  0: {
    fn: function (require, module, exports) {
      "use strict";

      var _message = require("./message.js");

      var _message2 = _interopRequireDefault(_message);

      var _name = require("./name.js");

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      console.log(_message2.default);
      console.log((0, _name.add)(3, 4));
    },
    map: { "./message.js": 1, "./name.js": 2 },
  },
  1: {
    fn: function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _name = require("./name.js");

      exports.default = "this is name: " + _name.name;
    },
    map: { "./name.js": 3 },
  },
  2: {
    fn: function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      var name = (exports.name = "Hello World");

      var add = (exports.add = function add(a, b) {
        return a + b;
      });
    },
    map: {},
  },
  3: {
    fn: function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      var name = (exports.name = "Hello World");

      var add = (exports.add = function add(a, b) {
        return a + b;
      });
    },
    map: {},
  },
});
