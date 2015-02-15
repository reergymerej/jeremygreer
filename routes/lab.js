'use strict';

exports['2048'] = function (req, res) {
    res.render('lab/2048/index');
};

exports.cube = function (req, res) {
    console.log('render cube');
    res.render('lab/cube/index.html');
};