let grids = Array.from(document.getElementsByClassName('grid'))
let restartBtn = document.getElementById('restart-btn')
let themeBtn = document.getElementById('theme-btn')
let spaces = Array(9).fill(null);
let currentPlayer = 1;
let turnCount = 0;
let themesIndex = 0;
let winningSquares = null;

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

restartBtn.addEventListener('click',restart);
themeBtn.addEventListener('click',toggleTheme);
grids.forEach(grid => grid.addEventListener('click',boxClicked));

function boxClicked(e) {
    const id = e.target.id;
    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        if (currentPlayer == 1) {
            gridText = "X";
        }
        else {
            gridText = "O";
        }
        e.target.innerText=gridText;
        turnCount ++;

        winningColor = themes[themesIndex][4]
        winnerText = document.getElementById('header');
        if (checkIfWinner() !== false) {
            winnerText.textContent = `${gridText} wins!`;
            winningSquares = checkIfWinner();
            for (let i=0; i<winningSquares.length; i++) {
                grids[winningSquares[i]].style.backgroundColor = winningColor
            }
        }
        
        else {
            if (turnCount >= 9){
            winnerText.textContent = `draw!`
            }
        }

        if (currentPlayer == 1) {
            currentPlayer = 2;
        }
        else {
            currentPlayer = 1;
        }
    }
}

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

function restart() {
    spaces.fill(null);
    grids.forEach(grid => {
        grid.innerHTML = '';
        grid.style.backgroundColor = '';
    });
    grids.forEach(grid => grid.addEventListener('click',boxClicked));
    currentPlayer = 1;
    turnCount = 0;
    winnerText.textContent = "tic tac toe";
    winningSquares = null;
};

function toggleTheme() {
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

