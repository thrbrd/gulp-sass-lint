//////////////////////////////
// Sass Lint
//  - A Gulp Plugin
//
// Lints Sass files
//////////////////////////////
'use strict';

//////////////////////////////
// Variables
//////////////////////////////
var through = require('through2'),
    gutil = require('gulp-util'),
    lint = require('sass-lint'),
    path = require('path'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'sass-lint';

//////////////////////////////
// Export
//////////////////////////////
var sassLint = function (options) {
  options = options || {};
  var compile = through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    file.sassLint = [lint.lintText({
      'text': file.contents,
      'format': path.extname(file.path).replace('.', ''),
      'filename': path.relative(process.cwd(), file.path)
    }, options)];

    this.push(file);
    cb();
  });
  return compile;
}

sassLint.format = function (reportFn) {
  var compile = through.obj(function (file, encoding, cb) {
    if (file.sassLint && typeof reporterFn === 'function') {
      reporterFn(file.sassLint);
      return cb();
    }
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    console.log(lint.format(file.sassLint));

    this.push(file);
    cb();
  });
  return compile;
}

sassLint.failOnError = function () {
  var compile = through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.sassLint[0].errorCount > 0) {
      this.emit('error', new PluginError(PLUGIN_NAME, file.sassLint[0].errorCount + ' errors detected in ' + file.relative));
      return cb();
    }

    this.push(file);
    cb();
  });
  return compile;
}


module.exports = sassLint;
