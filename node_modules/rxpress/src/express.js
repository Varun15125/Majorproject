'use strict';

const rx = require('rx');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = rx.Observable.create(function (o) {
    const expressApp = express();

    o.onNext(expressApp);
    o.onCompleted();
});
