localStorage.clear()

let clientID;
let gameID;

const ws = new WebSocket('ws://localhost:3030');

ws.addEventListener('open', () => {
    payLoad = {
        'method': 'connect'
    }

    ws.send(JSON.stringify(payLoad));
})


ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // connect to server
    if (response.method === 'connect') {
        clientID = response.clientID;
    }

    // create game
    if (response.method === "create") {
        localStorage.setItem('originalClientID', clientID);
        gameID = response.gameID;
        const url = '/online/' + gameID
        window.location.href = url
    }

    // join game
    if (response.method === 'join') {
        if (!response.gameID) {
            console.log('invalid code');
            gameID = null;
            return;
        }

        localStorage.setItem('originalClientID', clientID);
        gameID = response.gameID
        const url = '/online/' + gameID
        window.location.href = url
    }
}


// localBtn function
function localBtnAction() {
    window.location.href = "/local"
}

// joinBtn function
function joinBtnAction() {
    if (!gameID) {
        gameID = joinInput.value;
    }   

    const payLoad = {
        "method": "join",
        "clientID": clientID,
        "gameID": gameID
    }
    
    ws.send(JSON.stringify(payLoad));
}


// onlineBtn function
function onlineBtnAction() {
    playerID = 'X';
    turnCount = 1;

    const payLoad = {
        "method": "create",
        "clientID": clientID
    }

    ws.send(JSON.stringify(payLoad))
}

// clicking grids function
function boxClicked(e) {
    const id = e.target.id;
    if (!spaces[id]) {
        spaces[id] = playerID
    }
    let move = [id, playerID]
    
    e.target.innerHTML = playerID;
    grids.forEach(grid => grid.removeEventListener('click',boxClicked))

    const payLoad = {
        'method': 'play',
        'clientID': clientID,
        'gameID': gameID,
        'move': move
    }
    ws.send(JSON.stringify(payLoad));
}

const localBtn = document.getElementById('local-btn');
const onlineBtn = document.getElementById('online-btn');
const joinBtn = document.getElementById('join-btn');
const joinInput = document.getElementById("join-input");
localBtn.addEventListener('click', e => localBtnAction());
onlineBtn.addEventListener('click', e => onlineBtnAction());
joinBtn.addEventListener('click', e => joinBtnAction());
joinInput.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        joinBtnAction();
    }
});

// function to check for winner
function checkIfWinner() {
    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    
    for (let i = 0; i < winningCombos.length; i++) {
        [a,b,c] = winningCombos[i]
        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            grids.forEach(grid => grid.removeEventListener('click',boxClicked));
            return [a,b,c]
        }
    }
    return false
}