'use strict';

var path = require('path');
var txRng = require('texas-ranger');
var cwd = process.cwd();
var musicPath = path.join(cwd, 'public', 'music');

txRng.settings.set('relative', false);

exports.index = function (req, res) {
  txRng.find(musicPath, 'mp3', true, function (err, files) {
    if (err) {
      res.end('whoops');
    } else {
      // change the absolute file path into web-relative
      files = files.map(function (file) {
        return file.replace(path.join(cwd, 'public'), '');
      });
      res.jsonp(files);
    }
  });
};