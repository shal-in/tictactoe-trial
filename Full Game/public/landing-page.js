let clientID = null;

let localBtn = document.getElementById('local-btn');
let onlineBtn = document.getElementById('online-btn');
let joinBtn = document.getElementById('join-btn')
let startBtnContainer = document.getElementById('start-btn-container')

// localBtn function
function localBtnAction() {
    console.log('local');
}

// joinBtn function
function joinBtnAction() {
    console.log('join');
}


// onlineBtn function
function onlineBtnAction() {
    console.log('online');
}

localBtn.addEventListener('click', localBtnAction);
onlineBtn.addEventListener('click', onlineBtnAction);
joinBtn.addEventListener('click', joinBtnAction);

let ws = new WebSocket('ws://localhost:3030');
ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // connect to server
    if (response.method === 'connect') {
        clientID = response.clientID;
        console.log(`client ${clientID} joined!`)
    }
}