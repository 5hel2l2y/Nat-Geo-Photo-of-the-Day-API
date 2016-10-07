var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express();


/**
 * Photo Module
 */
var photo = function () {
    var self = this;

    self.url  = "http://photography.nationalgeographic.com/photography/photo-of-the-day/";
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

        var photoContentJSONAccess;

        app.get('/api/dailyphoto', function(req, res){
            request(self.url, function(err, response, html){
                if (err) res.jsonp(err);
                var $ = cheerio.load(html);

                // load image json source
                photoContentJSONAccess = $('div.infinite.section>div').data('platformEndpoint');

                // request json from path
                request.get(photoContentJSONAccess, function(err, response, html){
                    if (err) res.jsonp(err);

                    var imageInfo = JSON.parse(response.body).items[0];
                    if(imageInfo.originalUrl != undefined)
                        var originalUrl = imageInfo.originalUrl;
                    else
                        var originalUrl = "";
                    var imageSrc = imageInfo.url + originalUrl;

                    res.jsonp({ 
                        src:    imageSrc,
                        alt:    imageInfo.title,
                        description: imageInfo.altText,
                        credit: imageInfo.credit
                    });
                });
            });
        });

        app.listen(self.port);
    };


    return self;
}();


module.exports = photo;
