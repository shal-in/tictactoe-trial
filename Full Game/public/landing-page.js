let clientID = null;
let gameID = '';

const headerContainer = document.getElementById('header-container');
const localBtn = document.getElementById('local-btn');
const onlineBtn = document.getElementById('online-btn');
const joinBtn = document.getElementById('join-btn');
const joinInput = document.getElementById("join-input");
const startBtnContainer = document.getElementById('start-btn-container');
const mainContainer = document.getElementById('main-container');
const gameBoard = document.createElement('div');
const ws = new WebSocket('ws://localhost:3030');

ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // connect to server
    if (clientID === null) {
        if (response.method === 'connect') {
            clientID = response.clientID;
            console.log(`your clientID: ${clientID}`)
        }
    }

    // create game
    if (response.method === "create") {
        gameID = response.game.gameID; 
        console.log("gameID: " + response.game.gameID)
    }

    // join game
    if (response.method === 'join') {
        const game = response.game;

        game.clients.forEach(c => {
            if (c.clientID !== clientID) {
                console.log(c.clientID + ' joined')                
            }

        })
        
    }
}

// localBtn function
function localBtnAction() {
    console.log('local');
    const homeBtn = document.createElement('button');
    const restartBtn = document.createElement('button');

    // remove buttons container
    startBtnContainer.remove();

    // add home & restart button
    homeBtn.addEventListener('click', homeBtnAction);
    homeBtn.setAttribute('id', 'home-btn');
    homeBtn.textContent = 'home';

    restartBtn.addEventListener('click', restartBtnAction);
    restartBtn.setAttribute('id', 'restart-btn');
    restartBtn.textContent = 'restart';

    // restyle header container
    headerContainer.style.height = '145px';
    headerContainer.style.width = '';

    const headerText = headerContainer.querySelector('#header-text');
    headerText.style.fontSize =  '100px';
    headerText.style.height =  '100px';
    headerText.style.width =  '';

    const subHeaderText = headerContainer.querySelector('#subheader-text');
    subHeaderText.style.fontSize =  '40px';
    subHeaderText.textContent = 'by shalin'
    subHeaderText.style.height =  '40px';
    subHeaderText.style.width =  '160px';
    subHeaderText.style.marginLeft =  '2px';
    subHeaderText.style.marginRight =  'auto';


    headerContainer.insertBefore(restartBtn,subHeaderText);
    headerContainer.insertBefore(homeBtn,subHeaderText);
    
    // add grid
    gameBoardId = gameBoard.id;
    if (!gameBoardId){
        gameBoard.setAttribute('id','gameboard');
        for (let i = 0; i < 9; i++) {
            const gridSquare = document.createElement('div');
            gridSquare.classList.add('grid');

            gridSquare.setAttribute('id', i.toString());
            gameBoard.appendChild(gridSquare); 
        }
    }

    mainContainer.appendChild(gameBoard);
    
}

// joinBtn function
function joinBtnAction() {
    console.log('join');
    if (gameID === '') {
        gameID = joinInput.value;
    }   

    const payLoad = {
        "method": "join",
        "clientID": clientID,
        "gameID": gameID
    }
    
    ws.send(JSON.stringify(payLoad));
    console.log(`joining game: ${gameID}`)
}




// onlineBtn function
function onlineBtnAction() {
    console.log('online');

    const payLoad = {
        "method": "create",
        "clientID": clientID
    }

    ws.send(JSON.stringify(payLoad));

    const homeBtn = document.createElement('button');
    const restartBtn = document.createElement('button');

    // remove buttons container
    startBtnContainer.remove();

    // add home & restart button
    homeBtn.addEventListener('click', e => homeBtnAction());
    homeBtn.setAttribute('id', 'home-btn');
    homeBtn.textContent = 'home';

    restartBtn.addEventListener('click', restartBtnAction);
    restartBtn.setAttribute('id', 'restart-btn');
    restartBtn.textContent = 'restart';

    // restyle header container
    headerContainer.style.height = '145px';
    headerContainer.style.width = '';

    const headerText = headerContainer.querySelector('#header-text');
    headerText.style.fontSize =  '100px';
    headerText.style.height =  '100px';
    headerText.style.width =  '';

    const subHeaderText = headerContainer.querySelector('#subheader-text');
    subHeaderText.style.fontSize =  '40px';
    subHeaderText.textContent = 'by shalin'
    subHeaderText.style.height =  '40px';
    subHeaderText.style.width =  '160px';
    subHeaderText.style.marginLeft =  '2px';
    subHeaderText.style.marginRight =  'auto';


    headerContainer.insertBefore(restartBtn,subHeaderText);
    headerContainer.insertBefore(homeBtn,subHeaderText);

    // add grid
    gameBoardId = gameBoard.id;
    if (!gameBoardId){
        gameBoard.setAttribute('id','gameboard');
        for (let i = 0; i < 9; i++) {
            const gridSquare = document.createElement('div');
            gridSquare.classList.add('grid');

            gridSquare.setAttribute('id', i.toString());
            gameBoard.appendChild(gridSquare); 
        }
    }

    mainContainer.appendChild(gameBoard);
}

// homeBtn function
function homeBtnAction(){
    console.log('home');
    
    // remove home & restart button
    const homeBtn = headerContainer.querySelector('#home-btn');
    const restartBtn = headerContainer.querySelector('#restart-btn');
    homeBtn.remove()
    restartBtn.remove()

    // add button container
    mainContainer.appendChild(startBtnContainer);

    // restyle header container
    headerContainer.style.height = '212px';
    headerContainer.style.width = '';

    const headerText = headerContainer.querySelector('#header-text');
    headerText.style.fontSize =  '150px';
    headerText.style.height =  '140px';
    headerText.style.width =  '';

    const subHeaderText = headerContainer.querySelector('#subheader-text');
    subHeaderText.style.fontSize =  '70px';
    subHeaderText.textContent = 'made by shalin'
    subHeaderText.style.height =  '70px';
    subHeaderText.style.width =  '457px';
    subHeaderText.style.margin = 'auto';

    gameBoard.remove()
}

// restartBtn function
function restartBtnAction(){
    console.log('restart');
}

localBtn.addEventListener('click', e => localBtnAction());
onlineBtn.addEventListener('click', e => onlineBtnAction());
joinBtn.addEventListener('click', e => joinBtnAction());
joinInput.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        joinBtnAction();
    }
});
