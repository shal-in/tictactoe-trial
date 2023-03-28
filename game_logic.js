let grids = Array.from(document.getElementsByClassName('grid'));
let spaces = Array(9).fill(null);
let currentPlayer = 1;
let turnCount = 0;
let themesIndex = 0;

//[theme name,background, textTitle, textGame, winningSquares, mainFont] 
const themes =[
    ['purple','#4C3B4D','#A6C2B4','#82968C','#392C3A','Times New Roman'],
    ['green','#CAD593','#2A3C24','#7A895C','#75704E'],
    ['indigo','#08415C','#CC2936','#6A3549','#15407A']
]

let winningColor = themes[themesIndex][4]

const root = document.documentElement;

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

        winnerText = document.getElementById('header');
        if (checkIfWinner() !== false) {
            winnerText.textContent = `${gridText} wins!`;
            winningSquares = checkIfWinner();
            for (let i=0; i<winningSquares.length; i++) {
                grids[winningSquares[i]].style.backgroundColor = winningColor
                console.log(themesIndex);
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
    winningSquares;
};



function toggleTheme() {
    themesIndex++;
    if (themesIndex >= themes.length){
        themesIndex = 0;
    }
    theme = themes[themesIndex];
    winningColor = theme[4]
    root.style.setProperty('--background',theme[1]);
    root.style.setProperty('--textTitle',theme[2]);
    root.style.setProperty('--textGame',theme[3]);
    root.style.setProperty('--winningSquares',theme[4]);
    if (theme.length == 6) {
        root.style.setProperty('--mainFont',theme[5])
    }
    if (winningSquares !== null) {
        for (let i=0; i<winningSquares.length; i++) {
            grids[winningSquares[i]].style.backgroundColor = winningColor;
        }
    }

}
