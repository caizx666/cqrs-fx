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

/**
 * watch compile
 */

var _class = function () {
  /**
   * constructor
   * @param  {Array} args []
   * @return {}         []
   */

  /**
   * compiled error files
   * @type {Array}
   */

  function _class() {
    _classCallCheck(this, _class);

    this.compiledMtime = {};
    this.compiledErrorFiles = [];
    this.allowFileExt = ['.js', '.ts'];

    this.init.apply(this, arguments);
  }
  /**
   * init
   * @param  {String} srcPath []
   * @param  {String} outPath []
   * @param  {Boolean} log     []
   * @return {}         []
   */

  /**
   * allow file ext in src path
   * @type {Array}
   */

  /**
   * store compiled files last mtime
   * @type {Object}
   */


  _createClass(_class, [{
    key: 'init',
    value: function init(srcPath, outPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var callback = arguments[3];

      this.srcPath = _path2.default.normalize(srcPath);
      this.outPath = _path2.default.normalize(outPath);
      this.options = options;
      this.callback = callback;
    }
    /**
     * compile single file
     * @param  {String} file     []
     * @param  {Boolean} onlyCopy []
     * @return {}          []
     */

  }, {
    key: 'compileFile',
    value: function compileFile(file, onlyCopy) {
      var filePath = '' + this.srcPath + _path2.default.sep + file;
      var content = _fs2.default.readFileSync(filePath, 'utf8');

      //when get file content empty, maybe file is locked
      if (!content) {
        return;
      }
      // only copy file content
      if (onlyCopy) {
        var saveFilepath = '' + this.outPath + _path2.default.sep + file;
        _fs2.default.mkdir(_path2.default.dirname(saveFilepath));
        _fs2.default.writeFileSync(saveFilepath, content);
        return;
      }

      try {
        if (this.options.type === 'ts') {
          this.compileByTypeScript(content, file);
        } else {
          this.compileByBabel(content, file);
        }
        return true;
      } catch (e) {

        log(function (colors) {
          return colors.red('compile file ' + file + ' error');
        }, 'COMPILE');
        log(e);

        e.message = 'Compile Error: ' + e.message;
        this.compileError = e;
      }
      return false;
    }
    /**
     * get relative path
     * @param  {String} file []
     * @return {String}      []
     */

  }, {
    key: 'getRelationPath',
    value: function getRelationPath(file) {
      //use dirname to resolve file path in source-map-support
      //so must use dirname in here
      var pPath = _path2.default.dirname(this.outPath + _path2.default.sep + file);
      return _path2.default.relative(pPath, this.srcPath + _path2.default.sep + file);
    }
    /**
     * typescript compile
     * @return {} []
     */

  }, {
    key: 'compileByTypeScript',
    value: function compileByTypeScript(content, file) {
      var ts = require('typescript');
      var startTime = Date.now();
      var diagnostics = [];
      var output = ts.transpileModule(content, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES6,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          allowSyntheticDefaultImports: true,
          sourceMap: true
        },
        fileName: file,
        reportDiagnostics: !!diagnostics
      });
      ts.addRange(diagnostics, output.diagnostics);

      //has error
      if (diagnostics.length) {
        var firstDiagnostics = diagnostics[0];

        var _firstDiagnostics$fil = firstDiagnostics.file.getLineAndCharacterOfPosition(firstDiagnostics.start);

        var line = _firstDiagnostics$fil.line;
        var character = _firstDiagnostics$fil.character;

        var message = ts.flattenDiagnosticMessageText(firstDiagnostics.messageText, '\n');
        throw new Error(message + ' on Line ' + (line + 1) + ', Character ' + character);
      }
      if (this.options.log) {
        log('Compile file ' + file, 'TypeScript', startTime);
      }

      file = this.replaceExtName(file, '.js');
      var sourceMap = JSON.parse(output.sourceMapText);
      sourceMap.sources[0] = this.getRelationPath(file);
      sourceMap.sourcesContent = [content];
      //file value must be equal sources values
      sourceMap.file = sourceMap.sources[0];
      delete sourceMap.sourceRoot;
      this.compileByBabel(output.outputText, file, true, sourceMap);
    }
    /**
     * babel compile
     * @return {} []
     */

  }, {
    key: 'compileByBabel',
    value: function compileByBabel(content, file, logged, orginSourceMap) {
      var startTime = Date.now();
      var relativePath = this.getRelationPath(file);
      //babel not export default property
      //so can not use `import babel from 'babel-core'`
      var babel = require('babel-core');
      var data = babel.transform(content, {
        filename: file,
        presets: ['es2015-loose', 'stage-1'].concat(this.options.presets || []),
        plugins: ['transform-runtime'].concat(this.options.plugins || []),
        sourceMaps: true,
        sourceFileName: relativePath
      });
      if (!logged && this.options.log) {
        log('Compile file ' + file, 'Babel', startTime);
      }
      _fs2.default.mkdir(_path2.default.dirname('' + this.outPath + _path2.default.sep + file));
      var basename = _path2.default.basename(file);
      var prefix = '//# sourceMappingURL=';
      if (data.code.indexOf(prefix) === -1) {
        data.code = data.code + '\n' + prefix + basename + '.map';
      }
      _fs2.default.writeFileSync('' + this.outPath + _path2.default.sep + file, data.code);
      var sourceMap = data.map;
      //file value must be equal sources values
      sourceMap.file = sourceMap.sources[0];
      if (orginSourceMap) {
        sourceMap = this.mergeSourceMap(orginSourceMap, sourceMap);
      }
      _fs2.default.writeFileSync('' + this.outPath + _path2.default.sep + file + '.map', JSON.stringify(sourceMap, undefined, 4));
    }
    /**
     * merge source map
     * @param  {String} content        []
     * @param  {Object} orginSourceMap []
     * @param  {Object} sourceMap      []
     * @return {}                []
     */

  }, {
    key: 'mergeSourceMap',
    value: function mergeSourceMap(orginSourceMap, sourceMap) {
      var _require = require('source-map');

      var SourceMapGenerator = _require.SourceMapGenerator;
      var SourceMapConsumer = _require.SourceMapConsumer;

      sourceMap.file = sourceMap.file.replace(/\\/g, '/');
      sourceMap.sources = sourceMap.sources.map(function (filePath) {
        return filePath.replace(/\\/g, '/');
      });
      var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(sourceMap));
      generator.applySourceMap(new SourceMapConsumer(orginSourceMap));
      sourceMap = JSON.parse(generator.toString());

      return sourceMap;
    }
    /**
     * src file is deleted, but app file also exist
     * then delete app file
     * @return {} []
     */

  }, {
    key: 'getSrcDeletedFiles',
    value: function getSrcDeletedFiles(srcFiles, appFiles) {
      var _this = this;

      var srcFilesWithoutExt = srcFiles.map(function (item) {
        return _this.replaceExtName(item);
      });
      return appFiles.filter(function (file) {
        var extname = _path2.default.extname(file);
        if (_this.allowFileExt.indexOf(extname) === -1) {
          return;
        }
        var fileWithoutExt = _this.replaceExtName(file);
        //src file not exist
        if (srcFilesWithoutExt.indexOf(fileWithoutExt) === -1) {
          var filepath = _this.outPath + _path2.default.sep + file;
          if ((0, _utils.isFile)(filepath)) {
            _fs2.default.unlinkSync(filepath);
          }
          return true;
        }
      }).map(function (file) {
        return _this.outPath + _path2.default.sep + file;
      });
    }
    /**
     * replace filepath extname
     * @param  {String} filepath []
     * @param  {String} extname  []
     * @return {String}          []
     */

  }, {
    key: 'replaceExtName',
    value: function replaceExtName(filepath) {
      var extname = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      return filepath.replace(/\.\w+$/, extname);
    }
    /**
     * compile
     * @return {} []
     */

  }, {
    key: 'compile',
    value: function compile(once) {
      var _this2 = this;

      var files = (0, _utils.getFiles)(this.srcPath, true);
      var appFiles = (0, _utils.getFiles)(this.outPath, true);
      var changedFiles = this.getSrcDeletedFiles(files, appFiles);

      if (this.compileError && !this.compiledErrorFiles.length) {
        this.compileError = null;
      }

      files.forEach(function (file) {
        var extname = _path2.default.extname(file);
        //if is not js file, only copy
        if (_this2.allowFileExt.indexOf(extname) === -1) {
          _this2.compileFile(file, true);
          return;
        }
        var mTime = _fs2.default.statSync('' + _this2.srcPath + _path2.default.sep + file).mtime.getTime();
        var outFile = '' + _this2.outPath + _path2.default.sep + file;

        //change extname to .js.
        //in typescript, file extname is .ts
        outFile = _this2.replaceExtName(outFile, '.js');

        if ((0, _utils.isFile)(outFile)) {
          var outmTime = _fs2.default.statSync(outFile).mtime.getTime();
          //if compiled file mtime is after than source file, return
          if (outmTime >= mTime) {
            return;
          }
        }
        if (!_this2.compiledMtime[file] || mTime > _this2.compiledMtime[file]) {
          var ret = _this2.compileFile(file);
          if (ret) {
            changedFiles.push(outFile);
          }

          _this2.compiledMtime[file] = mTime;

          var index = _this2.compiledErrorFiles.indexOf(file);
          if (ret) {
            if (index > -1) {
              _this2.compiledErrorFiles.splice(index, 1);
            }
          } else if (ret === false) {
            if (index === -1) {
              _this2.compiledErrorFiles.push(file);
            }
          }
        }
      });
      //notify auto reload service to clear file cache
      if (changedFiles.length && this.callback) {
        this.callback(changedFiles);
      }
      if (!once) {
        setTimeout(this.compile.bind(this), 100);
      }
    }
    /**
     * run
     * @return {} []
     */

  }, {
    key: 'run',
    value: function run() {
      this.compile();
    }
    /**
     * compile
     * @return {} []
     */

  }], [{
    key: 'compile',
    value: function compile(srcPath, outPath) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var instance = new this(srcPath, outPath, options);
      instance.compile(true);
    }
  }]);

  return _class;
}();

exports.default = _class;