localStorage.setItem('testVar', 'some value');

let clientID = null;
let gameID = '';
let grids = [];
let spaces;
let playerID;
let response;
let turnCount;

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
        spaces = response.game.spaces;
        console.log("gameID: " + response.game.gameID)
        window.location.href = "/online/" + gameID
        copyToClipboard(gameID);
    }

    // join game
    if (response.method === 'join') {
        const game = response.game;
        if (!game) {
            console.log('invalid code');
            gameID = '';
            return;
        }
        
        game.clients.forEach(c => {
            if (c.clientID !== clientID) {
                console.log(c.clientID + ' joined')              
            }    
        })
        
        // make request to update game
        $.ajax({
            type:"post",
            url: "/",
            data: {
                    // data to send to server
            },
            success: function(response) {
                console.log(response);
            },
            error: function() {
                console.error("Error making AJAX request");
            }
        })
    }

    // updating the game
    if (response.method === 'update'){
        if (!response.game.spaces) {
            console.log('no spaces')
            return
        }

        spaces = response.game.spaces
        
        let turnCount = spaces.filter(grid => grid !== null).length;

        for (const id of Object.keys(spaces)) {
            if (!spaces[id]) {
                continue
            }
            if (spaces[id] === playerID) {
                continue
            }
            else {
                grid = document.getElementById(id);
                grid.innerHTML = spaces[id]
                grid.removeEventListener('click', boxClicked)
            }
        }

        if (checkIfWinner() !== false) {
            let winningSquares = checkIfWinner();
            console.log(winningSquares)
            return;
        }

        else {
            if (turnCount >= 9) {
                console.log('draw') 
                return
            }
        }

        if (turnCount % 2 === 0 && playerID === 'X') {
            // X plays
            for (let i = 0; i < spaces.length; i++) {
                if (spaces[i] === null) {
                    grids[i].addEventListener('click', boxClicked)
                }
            }
        }

        if (turnCount % 2 === 1 && playerID === 'O') {
            // O plays
            for (let i = 0; i < spaces.length; i++) {
                if (spaces[i] === null) {
                    grids[i].addEventListener('click', boxClicked)
                }
            }
        }
    }
}


// localBtn function
function localBtnAction() {
    window.location.href = "/local"
}

// joinBtn function
function joinBtnAction() {
    console.log('join');
    playerID = 'O';
    turnCount = 2;
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
            gridSquare.addEventListener('click', boxClicked)
            grids.push(gridSquare);
            gameBoard.appendChild(gridSquare);
        }
    }

    mainContainer.appendChild(gameBoard);


}


// onlineBtn function
function onlineBtnAction() {
    console.log('online');
    window.location.href = "/online"
    playerID = 'X';
    turnCount = 1;

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
            gridSquare.addEventListener('click', boxClicked)
            grids.push(gridSquare);
            gameBoard.appendChild(gridSquare);
        }
    }

    mainContainer.appendChild(gameBoard);
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


// function to copy to clipboard;
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
}
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