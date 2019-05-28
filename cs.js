// Server version

const express = require('express');
const formidable = require('express-formidable');
var port = process.env.PORT || 443;

const app = express();
const fs = require('fs');
const scraper = require('./scraper');

// Certificate
const privateKey = fs.readFileSync('./ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./ssl/cert.pem', 'utf8');
const ca = fs.readFileSync('./ssl/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const https = require('https').Server(credentials, app);


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


// HTTP redirects to HTTPS
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);


https.listen(port);