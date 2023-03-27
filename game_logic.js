let playerText = document.getElementById('playerText')
let grids = Array.from(document.getElementsByClassName('grid'));
let spaces = Array(9).fill(null);
let player1_col = getComputedStyle(document.body).getPropertyValue('--player1');
let player2_col = getComputedStyle(document.body).getPropertyValue('--player2');
let currentPlayer = 1;
let turnCount = 0;

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

        if (checkIfWinner() !== false) {
            console.log(`${gridText} wins!`);
        }
        
        else {
            if (turnCount >= 9){
                console.log(`Draw!`);
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
}