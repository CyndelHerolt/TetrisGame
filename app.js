let gameBoard = document.querySelector('#game-board');

// 2D array représentant tous les tetriminos
let tetriminos = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [1, 1, 1],
        [1, 0, 0]
    ]
];
let moveDownInterval = null; // conserver une référence à l'intervalle

// prendre un tetrimino aléatoirement
let tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];
let currentPosition = {x: 5, y: 0}; // position de départ

function drawTetrimino() {
    for (let y = 0; y < tetrimino.length; y++) {
        for (let x = 0; x < tetrimino[y].length; x++) {
            if (tetrimino[y][x]) {
                let cell = document.createElement('div');
                cell.style.gridColumnStart = currentPosition.x + x;
                cell.style.gridRowStart = currentPosition.y + y;
                cell.className = 'tetrimino';
                gameBoard.appendChild(cell);
            }
        }
    }
}

function eraseTetrimino() {
    let cells = document.querySelectorAll('.tetrimino:not(.stopped)');

    // supprimer tous les tetriminos
    for (let i = 0; i < cells.length; i++) {
        cells[i].remove();
    }
}

// ...
function canMoveSide(moveX) {
    // vérifier si le tetrimino peut bouger sur le côté
    for (let y = 0; y < tetrimino.length; y++) {
        for (let x = 0; x < tetrimino[y].length; x++) {
            if (tetrimino[y][x]) {
                // vérifier si le tetrimino est à côté du tableau
                if (currentPosition.x + x + moveX < 1 || currentPosition.x + x + moveX > 10) {
                    return false;
                }
                // vérifier si le tetrimino est à côté d'un autre tetrimino arrêté
                let sideCell = gameBoard.querySelector(`[style="grid-column-start: ${currentPosition.x + x + moveX}; grid-row-start: ${currentPosition.y + y};"]`);
                if (sideCell && sideCell.classList.contains('stopped')) {
                    return false;
                }
            }
        }
    }
    return true;
}

function canMoveDownFaster() {
    // vérifier si le tetrimino peut descendre
    for (let y = 0; y < tetrimino.length; y++) {
        for (let x = 0; x < tetrimino[y].length; x++) {
            if (tetrimino[y][x]) {
                // vérifier si le tetrimino est en bas du tableau
                if (currentPosition.y + y + 1 >= 21) {
                    return false;
                }
                // vérifier si le tetrimino est sur un autre tetrimino arrêté
                let belowCell = gameBoard.querySelector(`[style="grid-column-start: ${currentPosition.x + x}; grid-row-start: ${currentPosition.y + y + 1};"]`);
                if (belowCell && belowCell.classList.contains('stopped')) {
                    return false;
                }
            }
        }
    }
    return true;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && canMoveSide(-1)) {
        // effacer le tetrimino actuel
        eraseTetrimino();
        // déplacer le tetrimino vers la gauche
        currentPosition.x--;
        // dessiner le nouveau tetrimino
        drawTetrimino();
    } else if (event.key === 'ArrowRight' && canMoveSide(1)) {
        // effacer le tetrimino actuel
        eraseTetrimino();
        // déplacer le tetrimino vers la droite
        currentPosition.x++;
        // dessiner le nouveau tetrimino
        drawTetrimino();
    } else if (event.key === 'ArrowUp') {
        // effacer le tetrimino actuel
        eraseTetrimino();
        // faire tourner le tetrimino
        rotateTetrimino();
        // dessiner le nouveau tetrimino
        drawTetrimino();
    } else if (event.key === 'ArrowDown' && canMoveDownFaster()) {
        // effacer le tetrimino actuel
        eraseTetrimino();
        // faire descendre le tetrimino
        moveDown();
    }
});

function rotateTetrimino() {
    // créer un nouveau tableau vide
    let newTetrimino = [];

    // remplir le nouveau tableau avec les valeurs du tetrimino actuel
    for (let y = 0; y < tetrimino[0].length; y++) {
        newTetrimino[y] = [];
        for (let x = 0; x < tetrimino.length; x++) {
            newTetrimino[y][x] = tetrimino[tetrimino.length - 1 - x][y];
        }
    }

    // remplacer le tetrimino actuel par le nouveau tetrimino
    tetrimino = newTetrimino;
}

function deleteFullRows() {
    // Démarrer à partir de la ligne du bas et remonter jusqu'en haut
    for (let y = 20; y > 0; y--) {
        let cells = gameBoard.querySelectorAll(`[style*="grid-row-start: ${y};"]`);
        // Si la ligne contient 10 blocs (c'est-à-dire la largeur du plateau), elle est pleine
        if (cells.length === 10) {
            // Supprimez tous les blocs de cette ligne
            for (let i = 0; i < cells.length; i++) {
                cells[i].remove();
            }
            // Décalez toutes les lignes supérieures d'une rangée vers le bas
            for (let y2 = y - 1; y2 > 0; y2--) {
                let upperCells = gameBoard.querySelectorAll(`[style*="grid-row-start: ${y2};"]`);
                for (let i = 0; i < upperCells.length; i++) {
                    // Modifier la position de la rangée (gridRowStart) de chaque bloc situé au-dessus de la ligne complète
                    let styles = upperCells[i].getAttribute('style').split(';');
                    for (let j = 0; j < styles.length; j++) {
                        if (styles[j].trim().startsWith('grid-row-start')) {
                            let newVal = parseInt(styles[j].split(':')[1]) + 1;
                            styles[j] = `grid-row-start: ${newVal}`;
                            break;
                        }
                    }
                    upperCells[i].setAttribute('style', styles.join(';'));
                }
            }
        }
    }
}

function canMoveDown() {
    // vérifier si le tetrimino peut descendre
    for (let y = 0; y < tetrimino.length; y++) {
        for (let x = 0; x < tetrimino[y].length; x++) {
            if (tetrimino[y][x]) {
                // vérifier si le tetrimino est en bas du tableau
                if (currentPosition.y + y + 1 >= 21) {
                    return false;
                }
                // vérifier si le tetrimino est sur un autre tetrimino arrêté
                let belowCell = gameBoard.querySelector(`[style="grid-column-start: ${currentPosition.x + x}; grid-row-start: ${currentPosition.y + y + 1};"]`);
                if (belowCell && belowCell.classList.contains('stopped')) {
                    return false;
                }
            }
        }
    }
    return true;
}

function moveDown() {
    // vérifier si le tetrimino peut descendre
    if (canMoveDown()) {
        // effacer le tetrimino actuel
        eraseTetrimino();
        // descendre le tetrimino
        currentPosition.y++;
        // dessiner le nouveau tetrimino
        drawTetrimino();
    } else {
        // s'il ne peut pas descendre, ajouter la classe 'stopped' à chaque cellule du tetrimino
        let cells = gameBoard.querySelectorAll('.tetrimino');
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.add('stopped');
        }

        // supprimer les lignes complètes
        deleteFullRows();

        // choisir un nouveau tetrimino
        tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];
        currentPosition = {x: 5, y: 0}; // reset position de départ

        // dessiner le nouveau tetrimino
        drawTetrimino();
    }
}

// Si la barre espace est pressée, appeler la fonction moveDown
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // Si il y a déjà un tetrimino, utiliser la fonction eraseTetrimino pour effacer le tetrimino actuel avant de dessiner un nouveau
        if (document.querySelectorAll('.tetrimino').length > 0) {
            eraseTetrimino();
        }

        // choisir un nouveau tetrimino
        tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];

        // appeler la fonction drawTetrimino pour dessiner le nouveau tetrimino
        drawTetrimino();

        // si un interval pour moveDown existe déjà, le supprimer
        if (moveDownInterval !== null) {
            clearInterval(moveDownInterval);
        }

        // créer un nouvel interval pour moveDown
        moveDownInterval = setInterval(moveDown, 500);
    }
});

