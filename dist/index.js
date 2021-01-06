"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("fs"),
    readdirSync = _require.readdirSync,
    readFileSync = _require.readFileSync;
/**
 * Returns an array with all file paths within a directory filtered by file type
 *
 * @param {String} path - Files path
 * @param {String} type - Files type
 * @return {Array} - Array with the files paths
 */


function getFiles() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "./";
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "json";

  try {
    var entries = readdirSync(path, {
      withFileTypes: true
    }); //
    // Get files within the current directory and returns an array with the files paths
    //

    var files = entries.filter(function (file) {
      return !file.isDirectory() && file.name.split(".").pop() === type;
    }).map(function (file) {
      return "".concat(path, "/").concat(file.name);
    }); //
    // Get folders within the current directory
    //

    var folders = entries.filter(function (folder) {
      return folder.isDirectory();
    }); //
    // Add the found files within the subdirectory to the files array
    // by calling the current function itself
    //

    var _iterator = _createForOfIteratorHelper(folders),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var folder = _step.value;
        files.push.apply(files, _toConsumableArray(getFiles("".concat(path, "/").concat(folder.name))));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return files;
  } catch (error) {
    throw new Error("[vite-plugin-i18n-resources]: ".concat(error.message));
  }
}
/**
 * Finds all translation message files within the specified path
 * and generates an object with all translations compatible with i18n
 *
 * @param {Array} files - Array with the files paths
 * @return {Object} - Messages
 */


function getMessages(messages, file) {
  try {
    var matched = file.match(/(.+\/)*(.+)\.(.+)\.json/i);

    if (matched && matched.length > 1) {
      var lang = matched[3];
      var section = matched[2];

      if (!messages[lang]) {
        messages[lang] = {};
      }

      var data = readFileSync(file);
      messages[lang][section] = JSON.parse(data);
    }

    return messages;
  } catch (error) {
    throw new Error("[vite-plugin-i18n-resources]: ".concat(file, " ").concat(error.message));
  }
}
/**
 * Plugin
 * Serving a Virtual File with all translations
 */


var viteI18nResources = function viteI18nResources() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var virtualFileId = "vite-i18n-resources";
  var path = options.path;
  var files = getFiles(path, "json");
  var messages = files.reduce(getMessages, {});
  return {
    name: "vite-plugin-i18n-resources",
    resolveId: function resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId;
      }
    },
    load: function load(id) {
      if (id === virtualFileId) {
        return "export const messages = ".concat(JSON.stringify(messages));
      }
    },
    //
    // Watch translation message files,
    // and emit a custom event with the updated messages
    //
    handleHotUpdate: function handleHotUpdate(_ref) {
      var file = _ref.file,
          server = _ref.server;
      if (!file.includes(path) || file.split(".").pop() !== "json") return;
      var matched = file.match(/(.+\/)*(.+)\.(.+)\.json/i);

      if (matched && matched.length > 1) {
        files = getFiles(path, "json");
        messages = files.reduce(getMessages, {});
        server.ws.send({
          type: "custom",
          event: "locales-update",
          data: messages
        });
      }
    }
  };
};

var _default = viteI18nResources;
exports["default"] = _default;