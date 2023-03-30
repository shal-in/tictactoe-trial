const express = require('express');
const app = express();
const path = require('path');

const dirName = __dirname;
const parentDirName = path.dirname(dirName);

app.get('/', (req, res) => res.sendFile(parentDirName + '/public/landing-page.html'));

// Set MIME type for CSS files
app.get('/styles/landing-page.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(parentDirName + '/public/styles/landing-page.css');
});

// Set MIME type for JS files
app.get('/landing-page.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirName + '/public/landing-page.js');
});

app.use(express.static('public'));

app.listen(3031, () => console.log('Listening on port 3031!'));

const http = require('http');
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(3030, () => console.log('Listening on port 3030!'));

const clients = {};

const wsServer = new websocketServer({
    'httpServer' : httpServer
});


wsServer.on('request', request => {
    // connect
    const connection = request.accept(null, request.origin);
    connection.on('open', () => console.log('opened!'));
    connection.on('close', () => console.log('closed!'));
    connection.on('message', message => {
        const result = JSON.parse(message.utf8Data);
        // message received from client
        
        // creating a new game


    })



    // generate a new cliendID
    const clientID = generateClientID();
    clients[clientID] = {
        'connection': connection
    };

    const payLoad = {
        'method': 'connect',
        'clientID': clientID
    }

        // send back the client connect
    connection.send(JSON.stringify(payLoad))


})

function generateClientID() {
    // Generate a random 8-character string of letters and numbers
    const randomString = Math.random().toString(36).substring(2, 10);
    return randomString;
  }
  