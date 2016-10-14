'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//can not use import from
var sys_module = require('module');

//rewriteSysModuleLoad flag
var _rewriteSysModuleLoad = false;

var NODE_MODULES = _path2.default.sep + 'node_modules' + _path2.default.sep;

/**
 * auto reload file
 */

var _class = function () {
  /**
   * constructor
   * @param  {Array} args []
   * @return {}         []
   */

  function _class() {
    _classCallCheck(this, _class);

    this.init.apply(this, arguments);
  }
  /**
   * init
   * @param  {String}   srcPath  [source path]
   * @param  {Function} callback [when file has changed, callback will be invoke]
   * @param  {Boolean}  log      [log reload file]
   * @return {}            []
   */


  _createClass(_class, [{
    key: 'init',
    value: function init(srcPath, callback) {
      this.autoReload = {};
      this.srcPath = _path2.default.normalize(srcPath);
      this.callback = callback;
      this.prevFilesCount = 0;
    }
    /**
     * log file
     * @param  {String} file []
     * @return {}      []
     */
    // log(file){
    //   //only log app files changed
    //   if(file.indexOf(this.srcPath) === 0){
    //     file = file.slice(this.srcPath.length);
    //     log(`reload file ${file}`, 'RELOAD');
    //   }
    // }
    /**
     * clear file cache, also clear dependents file cache
     * @return {} []
     */

  }, {
    key: 'clearFileCache',
    value: function clearFileCache(file) {
      if (file.indexOf(NODE_MODULES) > -1 || file.indexOf(this.srcPath) !== 0) {
        return;
      }
      var mod = require.cache[file];
      if (!mod) {
        return;
      }
      //log(`reload file ${file.slice(this.srcPath.length)}`, 'RELOAD');
      //remove children
      if (mod && mod.children) {
        mod.children.length = 0;
      }

      // clear module cache which dependents this module
      for (var fileItem in require.cache) {
        if (fileItem === file || fileItem.indexOf(NODE_MODULES) > -1) {
          continue;
        }
        var item = require.cache[fileItem];
        if (item && item.children && item.children.indexOf(mod) > -1) {
          this.clearFileCache(fileItem);
        }
      }
      //remove require cache
      delete require.cache[file];
    }
    /**
     * clear files cache
     * @param  {Array} files []
     * @return {}       []
     */

  }, {
    key: 'clearFilesCache',
    value: function clearFilesCache(files) {
      var _this = this;

      files.forEach(function (file) {
        _this.clearFileCache(file);
      });
      if (this.callback) {
        this.callback();
      }
    }
    /**
     * check file change
     * compare files count
     * @return {} []
     */

  }, {
    key: 'checkFileChange',
    value: function checkFileChange() {
      var filesCount = (0, _utils.getFiles)(this.srcPath, true).filter(function (file) {
        var extname = _path2.default.extname(file);
        return extname === '.js';
      }).length;
      var flag = this.prevFilesCount && this.prevFilesCount !== filesCount;
      this.prevFilesCount = filesCount;
      return flag;
    }
    /**
     * check cache change
     * @return {} []
     */

  }, {
    key: 'checkCacheChange',
    value: function checkCacheChange() {
      var autoReload = this.autoReload;
      var hasChange = false;
      for (var file in require.cache) {
        //ignore file in node_modules path
        if (file.indexOf(NODE_MODULES) > -1) {
          continue;
        }
        if (!(0, _utils.isFile)(file)) {
          this.clearFileCache(file);
          continue;
        }
        var mTime = _fs2.default.statSync(file).mtime.getTime();
        if (!autoReload[file]) {
          autoReload[file] = mTime;
          continue;
        }
        if (mTime > autoReload[file]) {
          this.clearFileCache(file);
          autoReload[file] = mTime;
          hasChange = true;
        }
      }
      return hasChange;
    }
    /**
     * run
     * @return {} []
     */

  }, {
    key: 'run',
    value: function run() {
      var hasChange = this.checkCacheChange() || this.checkFileChange();
      if (hasChange && this.callback) {
        this.callback();
      }
      setTimeout(this.run.bind(this), 200);
    }
    /**
     * rewrite sys module load method
     * @return {} []
     */

  }], [{
    key: 'rewriteSysModuleLoad',
    value: function rewriteSysModuleLoad() {

      if (_rewriteSysModuleLoad) {
        return;
      }
      _rewriteSysModuleLoad = true;

      var load = sys_module._load;

      //rewrite Module._load method
      sys_module._load = function (request, parent, isMain) {
        var exportsObj = load(request, parent, isMain);
        if (!parent) {
          return exportsObj;
        }
        if (isMain || parent.filename.indexOf(NODE_MODULES) > -1) {
          return exportsObj;
        }
        if (request === 'internal/repl' || request === 'repl') {
          return exportsObj;
        }
        try {
          var filename = sys_module._resolveFilename(request, parent);
          var cachedModule = sys_module._cache[filename];
          if (cachedModule && parent.children.indexOf(cachedModule) === -1) {
            parent.children.push(cachedModule);
          }
        } catch (e) {}
        return exportsObj;
      };
    }
  }]);

  return _class;
}();

exports.default = _class;