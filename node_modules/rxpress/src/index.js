'use strict';

const rx = require('rx');
const expressStream = require('./express');

function createResponse (str) {
    const headers = [];

    function addHeader (name, value) {
        headers.push({
            name: name,
            value: value
        });
    }


    return {
        data: str,
        headers: headers,
        addHeader: addHeader
    };
}

module.exports = {
    createResponse: createResponse,
    create: function (defaultRoutes) {
        return expressStream.map((expressApp) => {

            expressApp.addRoutes = function (routesStream) {
                return rx.Observable.create(function (o) {
                    routesStream.subscribe((routeData) => {
                        console.log(`Listening for ${routeData.method.toUpperCase()} ${routeData.path}`);

                        expressApp[routeData.method](routeData.path, function (req, res) {
                            routeData.handler(req).first()
                                .subscribe(function (resp) {
                                    let response = resp;

                                    if (typeof resp === 'string') {
                                        response = createResponse(resp);
                                    }

                                    response.headers.forEach(function (header) {
                                        res.setHeader(header.name, header.value);
                                    });

                                    res.write(response.data);
                                    res.end();

                                }, function (error) {
                                    res.write(error.message);
                                    res.end();
                                });
                        });

                    }, function () {}, function () {
                        o.onNext(expressApp);
                        o.onCompleted();
                    });
                });
            };

            return expressApp;

        })
        .first();
    }

}
