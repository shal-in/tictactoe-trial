let clientID = null;
let gameID = '';

const headerContainer = document.getElementById('header-container');
const localBtn = document.getElementById('local-btn');
const onlineBtn = document.getElementById('online-btn');
const joinBtn = document.getElementById('join-btn');
const joinInput = document.getElementById("join-input");
const startBtnContainer = document.getElementById('start-btn-container');

// localBtn function
function localBtnAction() {
    console.log('local');
    // remove buttons container
    startBtnContainer.remove();

    // add back button
    let backBtn = document.createElement('button');
    backBtn.setAttribute('id', 'back-btn')
    backBtn.textContent = 'back'
    headerContainer.style.height = '300px'
    headerContainer.appendChild(backBtn)
}

// joinBtn function
function joinBtnAction() {
    if (gameID === ''){
        gameID = joinInput.value;
        if (gameID !== '') {
        console.log('button: ' + gameID);
        }
    }
    console.log('join');
}

// onlineBtn function
function onlineBtnAction() {
    console.log('online');
}

//backBtn function
function backBtnAction(){
    console.log('back')
}

localBtn.addEventListener('click', localBtnAction);
onlineBtn.addEventListener('click', onlineBtnAction);
joinBtn.addEventListener('click', joinBtnAction);
joinInput.addEventListener('keyup', (e) => {
    if (gameID === '') {
        if (e.keyCode === 13){
            gameID = joinInput.value;
            console.log("enter: " + gameID);
        }
    }   
}
);

let ws = new WebSocket('ws://localhost:3030');
ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // connect to server
    if (response.method === 'connect') {
        clientID = response.clientID;
        console.log(`client ${clientID} joined!`)
    }
}