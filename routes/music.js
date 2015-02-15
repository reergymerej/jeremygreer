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
        var filepath = file.replace(path.join(cwd, 'public'), '');
        var parts = filepath.split(path.sep);
        var album = parts[2];
        var track = parts[3].replace(/\.mp3$/i, '');

        return {
          path: filepath,
          album: album,
          track: track
        };
      });
      res.jsonp(files);
    }
  });
};