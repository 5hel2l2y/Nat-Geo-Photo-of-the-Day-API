var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express();

const natgeo = require('national-geographic-api').NationalGeographicAPI;


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

        app.listen(self.port);
    };


    return self;
}();


module.exports = photo;
