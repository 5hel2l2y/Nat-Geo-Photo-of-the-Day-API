const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const natgeo = require('national-geographic-api').NationalGeographicAPI;
const app = express();

/**
 * Photo Module
 */
var photo = function () {
    var self = this;

    self.port = process.env.PORT || 3000;

    /**
     *
     */
    self.enableCors = function () {
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };


    /**
     *
     */
    self.run = function (options) {
        if (typeof options.port == "number") {
            self.port = options.port;
        }

        if (options.cors) {
            self.enableCors();
        }

        app.get('/', function (req, res) {
            res.send(JSON.stringify({ Hello: "World"}));
        });

        app.get('/api/dailyphoto', async(req, res, next) => {
            const result = await natgeo.getPhotoOfDay();

            res.jsonp({ 
                all:            result,
                src:            result.data[0].attributes.image.uri,
                alt:            result.data[0].attributes.image.title,
                description:    result.data[0].attributes.image.alt_text,
                credit:         result.data[0].attributes.image.credit
            });
        });

        app.listen(self.port, function() {
            console.log("Example app listening on port 3000!");
        });
    };


    return self;
}();


module.exports = photo;
