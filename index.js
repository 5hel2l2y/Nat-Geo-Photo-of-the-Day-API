const express = require('express');
const natgeo = require('national-geographic-api').NationalGeographicAPI;
const app = express();


const port = process.env.PORT || 3000;

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

app.listen(port, function() {
    console.log("Listening on port 3000!");
});
