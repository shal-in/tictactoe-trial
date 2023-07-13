const express = require('express');
const app = express();
const path = require('path');

const dirName = __dirname;
const parentDirName = path.dirname(dirName);

app.get('/', (req, res) => res.sendFile(parentDirName + '/public/landing-page.html'));
app.get('/local', (req, res) => res.sendFile(parentDirName + '/public/local.html'));

// Set MIME type for CSS files
app.get('/styles/landing-page.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(parentDirName + '/public/styles/landing-page.css');
});

app.get('/styles/local.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(parentDirName + '/public/styles/local.css');
  });

  app.get('/styles/online.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(parentDirName + '/public/styles/online.css');
  });

// Set MIME type for JS files
app.get('/landing-page.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(parentDirName + '/public/landing-page.js');
});

app.get('/local.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(parentDirName + '/public/local.js');
  });

  app.get('/online.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(parentDirName + '/public/online.js');
  });

app.use(express.static('public'));

app.listen(3031, () => console.log('Client port: 3031!'));

app.post("/",(req,res) => {
    updateGameState();
})

const http = require('http');
const {client} = require('websocket');
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(3030, () => {
    console.log('Server port: 3030!')
    });


const clients = {};
const games = {};

const wsServer = new websocketServer({
    'httpServer' : httpServer
});

wsServer.on('request', request => {
    
    // connect
    const connection = request.accept(null, request.origin);
    connection.on('open', () => console.log('opened!'));
    connection.on('message', message => {
        const result = JSON.parse(message.utf8Data);
        // message received from client

        if (result.method === 'connect') {
            let clientID = createClientID();
            clients[clientID] = {
                'connection': connection
            };

            const payLoad = {
                'method': 'connect',
                'clientID': clientID
            }

            // send back the client connect
            connection.send(JSON.stringify(payLoad));
        }

        // creating a new game
        if (result.method === "create") {
            clientID = result.clientID;
            const gameID = createGameID();
            const url = '/online/' + gameID
            app.get((url), (req, res) => res.sendFile(parentDirName + '/public/online.html'));
            app.get(url + '/styles/online.css', (req, res) => {
                res.set('Content-Type', 'text/css');
                res.sendFile(parentDirName + '/public/styles/online.css');
            });

            const payLoad = {
                "method": "create",
                "gameID": gameID
            }
            
            clients[clientID].connection.send(JSON.stringify(payLoad));
        
            games[gameID] = {
                "gameID": gameID,
                "clients": [],
                'spaces': Array(9).fill(null)}
        }

        // reconnecting to game (on online.js)
        if (result.method === 'reconnect') {
            clientID = createClientID();
            gameID = result.gameID;
            clients[clientID] = {
                'connection': connection
            };

            games[gameID].clients.push({
                'clientID': clientID
            })

            const payLoad = {
                'method': 'reconnect',
                'clientID': clientID,
                'game': games[gameID]
            }

            connection.send(JSON.stringify(payLoad));
            // updateGameState()

            // delete originalID
            originalClientID = result.originalClientID;
            if (originalClientID) {
                delete clients[originalClientID]
            }
        }

        // joining a game
        if (result.method === 'join') {
            clientID = result.clientID;            
            gameID = result.gameID;

            if (!games[gameID]) {
                // invalid code
                const payLoad = {
                    'method': 'join',
                    'gameID': undefined
                }
                clients[clientID].connection.send(JSON.stringify(payLoad));
                return;
            }

            const game = games[gameID];
            if (game.clients.length === 2) {
                 // max players reached
                return;
            }

            const payLoad = {
                'method': 'join',
                'gameID': gameID
            }

            clients[clientID].connection.send(JSON.stringify(payLoad));
        }

        // playing the game
        if (result.method === 'play') {
            gameID = result.gameID;
            let move = result.move; // [id, character]

            if (move) {
                games[gameID].move = move;
            }
            updateGameState()
        }
    })

})

// function for updating game state
function updateGameState() {  
    const game = games[gameID];
    payLoad = {
        'method': 'update',
        'game':game
    }
    game.clients.forEach(c => {
        clients[c.clientID].connection.send(JSON.stringify(payLoad));
    })

}









// function to create a clientID: random 8-character string of letters and numbers
function createClientID() {
    
    const randomString = Math.random().toString(36).substring(2, 10);
    return randomString;
  }

// function to create gameID: "word1-word2-word3" form
function createGameID() {

    const words = ["act", "add", "age", "aid", "aim", "air", "and", "ant", "any", "ape",
            "apt", "arc", "are", "ark", "arm", "art", "ash", "ask", "ate", "awe",
            "axe", "aye", "bad", "bag", "ban", "bar", "bat", "bay", "bed", "bee", 
            "beg", "bet", "bib", "bid", "big", "bin", "bit", "boa", "bob", "bog", 
            "boo", "bow", "box", "boy", "bra", "bud", "bug", "bum", "bun", "bus", 
            "but", "buy", "bye", "cab", "can", "cap", "car", "cat", "cod", "cog", 
            "col", "con", "coo", "cop", "cot", "cow", "coy", "cry", "cub", "cue", 
            "cup", "cut", "dad", "dam", "day", "den", "dew", "did", "die", "dig", 
            "dim", "din", "dip", "doe", "dog", "don", "dot", "dry", "dub", "due", 
            "dug", "dun", "ear", "eat", "eel", "egg", "ego", "eke", "elf", "elk", 
            "elm", "end", "eon", "era", "eve", "ewe", "eye", "fad", "fan", "far", 
            "fat", "fax", "fed", "fee", "fen", "few", "fib", "fig", "fin", "fir", 
            "fit", "fix", "flu", "fly", "fog", "for", "fox", "fry", "fun", "fur", 
            "gab", "gag", "gal", "gap", "gas", "gay", "gel", "gem", "get", "gig", 
            "gin", "got", "gum", "gun", "gut", "guy", "gym", "had", "hag", "ham", 
            "has", "hat", "hay", "hem", "hen", "her", "hey", "hid", "him", "hip", 
            "his", "hit", "hog", "hop", "hot", "how", "hub", "hue", "hug", "huh", 
            "hum", "hut", "ice", "icy", "ill", "ink", "inn", "ion", "ire", "irk", 
            "its", "ivy", "jab", "jar", "jaw", "jay", "jet", "jew", "jig", "job", 
            "jog", "jot", "joy", "jug", "jut", "keg", "key", "kid", "kin", "kit", 
            "lab", "lad", "lag", "lap", "law", "lax", "lay", "lea", "led", "lee", 
            "leg", "let", "lid", "lie", "lip", "lit", "lob", "log", "loo", "lop", 
            "lot", "low", "lox", "lug", "lye", "mad", "man", "map", "mat", "maw", 
            "may", "men", "met", "mew", "mid", "mix", "mob", "mod", "mom", "moo", 
            "mop", "mow", "mud", "mug", "mum", "nab", "nag", "nap", "nay", "net", 
            "new", "nip", "nit", "nix", "nod", "non", "nor", "not", "now", "nun", 
            "nut", "oaf", "oak", "oar", "oat", "odd", "off", "oft", "oil", "old", 
            "one", "ooh", "opt", "orb", "ore", "our", "out", "owe", "owl", "own", 
            "pad", "pal", "pan", "pap", "par", "pat", "paw", "pay", "pea", "peg", 
            "pen", "pep", "per", "pet", "pew", "phi", "pic", "pie", "pig", "pin", 
            "pip", "pit", "ply", "pod", "pop", "pot", "pow", "pro", "pry", "pub", 
            "pug", "pun", "pup", "pus", "put", "qua", "rad", "rag", "ran", "rap", 
            "rat", "raw", "ray", "red", "ree", "ref", "rem", "rep", "rev", "rid", 
            "rig", "rim", "rip", "rob", "rod", "roe", "rot", "row", "rub", "rue", 
            "rug", "rum", "run", "rut", "rye", "sac", "sad", "sag", "sal", "sap", 
            "sat", "saw", "say", "sea", "see", "set", "sew", "she", "shy", "sin", 
            "sip", "sir", "sit", "six", "ski", "sky", "sly", "sob", "sod", "son", 
            "sop", "sow", "soy", "spa", "spy", "sty", "sub", "sue", "sum", "sun", 
            "sup", "tab", "tad", "tag", "tan", "tap", "tar", "tax", "tea", "ted", 
            "tee", "ten", "the", "tho", "thy", "tic", "tie", "tin", "tip", "toe", 
            "tog", "tom", "ton", "too", "top", "tot", "tow", "toy", "try", "tub", 
            "tug", "two", "ugh", "ump", "urn", "use", "van", "vat", "vet", "vie", 
            "vim", "von", "vow", "wad", "wag", "wan", "war", "was", "wax", "way", 
            "web", "wed", "wee", "wet", "who", "why", "wig", "win", "wit", "wok", 
            "won", "woo", "wow", "wry", "wye", "yak", "yam", "yap", "yaw", "yea", 
            "yen", "yep", "yes", "yet", "yew", "yin", "yon", "you", "yow", "yuk", 
            "yum", "zap", "zen", "zig", "zip", "zit", "zoo"];

        let index = [];
        let gameId = "";
        while (index.length !== 3) {
            x = Math.floor(Math.random() * words.length);
            if (index.includes(x)) {
                continue;
            }
            index.push(x);
        }
        for (let i of index) {
            if (i !== index[2]) {
            gameId += words[i] + "-";
            }
            else{
                gameId += words[i];
            }
        }

    return gameId;
}

