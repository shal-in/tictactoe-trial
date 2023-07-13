let originalClientID = localStorage.getItem('originalClientID');
let clientID = localStorage.getItem('clientID');
let pathname = window.location.pathname.split('/');
const gameID = pathname[pathname.length - 1]

let headerText = document.getElementById('header-text');
headerText.addEventListener('click', () => {
    window.location.href = '/';
})

let spaces = Array(9).fill(null);
let grids = Array.from(document.getElementsByClassName('grid'));
grids.forEach(grid => grid.addEventListener('click', boxClicked));

const ws = new WebSocket('ws://localhost:3030');

if (!clientID) {
    ws.addEventListener('open', () => {
        if (originalClientID) {
            copyToClipboard(window.location.href)
            payLoad = {
                'method': 'reconnect',
                'originalClientID': originalClientID,
                'gameID': gameID
                }
        }
        else {
            payLoad = {
                'method': 'reconnect',
                'originalClientID': null,
                'gameID': gameID
            }
        }

        ws.send(JSON.stringify(payLoad));
    })
}


ws.onmessage = message => {
    const response = JSON.parse(message.data);

    // reconnect to game
    if (response.method === 'reconnect') {
        clientID = response.clientID;
        localStorage.setItem('clientID', clientID)
        
        if (response.game.clients[0].clientID === clientID) {
            playerID = 'X';
        }
        else {
            playerID = 'O';

            const payLoad = {
                'method': 'play',
                'clientID': clientID,
                'gameID': gameID,
                'move': undefined
            }
        
            ws.send(JSON.stringify(payLoad));
        }
        console.log(`${clientID}: ${playerID}`);
    }

    // updating the game
    if (response.method === 'update') {
        
        move = response.game.move
        if (!move) {
            return
        }

        if (move[1] !== playerID) {
            spaces[move[0]] = move[1];
            grids[move[0]].innerHTML = move[1];

            for (let id = 0; id < spaces.length; id++) {
                if (!spaces[id]) {
                    grids[id].addEventListener('click', boxClicked);
                }
            }
        }

        if (checkIfWinner() !== false) {
            if (checkIfWinner() !== false) {
                grids.forEach(grid => grid.removeEventListener('click', boxClicked))
                console.log(`${move[1]} wins!`)
                winningSquares = checkIfWinner();
                for (let i=0; i<winningSquares.length; i++) {
                    grids[winningSquares[i]].style.backgroundColor = winningColor
                }
            }
        }

        const nullCount = spaces.reduce((count, value) => {
            return count + (value === null);
        }, 0);
        if (nullCount === 0) {
            console.log('draw')
        }
    }
}

let themesIndex = 0
let winningSquares = null;
const themeBtn = document.getElementById('theme-btn')
themeBtn.addEventListener('click',toggleTheme);
root = document.documentElement;
const rootStyles = getComputedStyle(root);
const background = rootStyles.getPropertyValue('--background');
const primaryColor = rootStyles.getPropertyValue('--primary-color');
const secondaryColor = rootStyles.getPropertyValue('--secondary-color');
let winningColor = rootStyles.getPropertyValue('--winningSquares');
const mainFont = rootStyles.getPropertyValue('--mainFont');
let themes = [['main',background, primaryColor, secondaryColor, winningColor, mainFont],
    ['dark', '#16171B', ' #8B5FBF', ' #BFA7DC ', ' #090A0B', ' "Times New Roman" '],
    ['light', '#DEFFFC', ' #218380', ' #3B413C ', ' #85FFF5', ' "Times New Roman" ']
    ]






// clicking grids function
function boxClicked(e) {
    const id = e.target.id;
    let move;
    if (!spaces[id]) {
        spaces[id] = playerID
        e.target.innerHTML = playerID
        move = [id, playerID]
    }

    grids.forEach(grid => grid.removeEventListener('click', boxClicked))

    const payLoad = {
        'method': 'play',
        'clientID': clientID,
        'gameID': gameID,
        'move': move
    }

    ws.send(JSON.stringify(payLoad));
}

// function to check winner
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



function toggleTheme() {
    console.log('theme')
    themesIndex++;
    if (themesIndex >= themes.length){
        themesIndex = 0;
    }
    theme = themes[themesIndex];
    root.style.setProperty('--background',theme[1]);
    root.style.setProperty('--primary-color',theme[2]);
    root.style.setProperty('--secondary-color',theme[3]);
    root.style.setProperty('--winningSquares',theme[4]);
    if (theme.length == 6) {
        root.style.setProperty('--mainFont',theme[5])
    }
    winningColor = themes[themesIndex][4]
    if (winningSquares !== null) {
        for (let i=0; i<winningSquares.length; i++) {
            grids[winningSquares[i]].style.backgroundColor = winningColor;
        }
    }
}

// function to copy to clipboard;
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
}