let grids = Array.from(document.getElementsByClassName('grid'));
let spaces = Array(9).fill(null);
let currentPlayer = 1;
let turnCount = 0;

const root = document.querySelector(':root');
const winningColor = getComputedStyle(root).getPropertyValue('--winningSquares');

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
                grids[winningSquares[i]].style.backgroundColor = winningColor;
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
};
