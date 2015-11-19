var Random = require('random-js');
var http = require('http'),
    httpProxy = require('http-proxy');
var url = require( "url" );
var querystring = require( "querystring" );
var express = require('express');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

var random = new Random(Random.engines.mt19937().seed(0));

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var alertRaised = false;
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
    if (alertRaised == true) console.log('Alert has been raised'); 
    if (!alertRaised && random.bool(0.30)) {
       // 30% to canary
       console.log("Redirect to canary")
       targetUrl = 'http://52.10.59.55:5000';
    } else {
       // 90% to stable
       console.log("Redirect to main server")
       targetUrl = 'http://52.33.130.146:5000';
    }
    proxy.web(req, res, { target: targetUrl });
});

console.log("Proxy server listening on port 80")
server.listen(80);


var app = express()
app.get('/', function(req, res) {
    if (alertRaised == false) console.log('Raised alert!');
    alertRaised = true;
    res.end();
});


var alertServer = app.listen(10000, function () {
  var host = alertServer.address().address
  var port = alertServer.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});

