'use strict';

var txRng = require('texas-ranger');

// TODO: Find the proper way to get the path.
var PATH = '/home/grizzle/code/jeremygreer/public/music';

exports.index = function (req, res) {
    txRng.find(PATH, 'mp3', true, function (err, files) {
        if (err) {
            res.end('whoops');
        } else {
            res.jsonp(files);
        }
    });
};