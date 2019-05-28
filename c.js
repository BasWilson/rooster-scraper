// Local version

const express = require('express');
const formidable = require('express-formidable');

const app = express();
const fs = require('fs');
const scraper = require('./scraper');

const http = require('http').Server(app)
app.use(formidable());

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/login', function (req, res) {

    if (JSON.parse(req.fields.submitData)) {
        
        var parsedData = JSON.parse(req.fields.submitData);
        if (!parsedData.username || !parsedData.password)
            return res.status(200).send(JSON.stringify(false));

        // Try to scrape the school site
        
        scraper.newRetriever(parsedData.username, parsedData.password).then((schedule) => {
            return res.status(200).send(JSON.stringify(schedule))
        });
    }
});

http.listen(8000);