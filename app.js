window.onload = function () {
    var startScreen = document.getElementById('start-screen');
    var gameOverScreen = document.getElementById('game-over');

    // Appuyez sur la barre d'espace pour démarrer le jeu

    document.body.onkeyup = function (e) {
        if (e.key === ' ') {
            score = 0;
            document.getElementById('score').innerText = score;
            if (gameOverScreen.style.display === 'flex') {
                gameOverScreen.style.display = 'none';
            }
                startScreen.style.display = 'none';
                // Si il y a déjà un tetrimino, utiliser la fonction eraseTetrimino pour effacer le tetrimino actuel avant d'en faire un nouveau
                if (document.querySelectorAll('.tetrimino').length > 0) {
                    restartGame();
                }

                // choisir un nouveau tetrimino
                tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];

                // appeler la fonction drawTetrimino pour faire le nouveau tetrimino
                drawTetrimino();

                // si un interval pour moveDown existe déjà, le supprimer
                if (moveDownInterval !== null) {
                    clearInterval(moveDownInterval);
                }

                // créer un nouvel interval pour moveDown
                moveDownInterval = setInterval(moveDown, 500);
            }
    }

    let gameBoard = document.querySelector('#game-board');

// représentation de tous les tetriminos
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

    let moveDownInterval = null;

// prendre un tetrimino random
    let tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];
    let currentPosition = {x: 5, y: 0}; // position de départ

    function drawTetrimino() {
        // dessiner le tetrimino
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
        // récupérer tous les tetriminos
        let cells = document.querySelectorAll('.tetrimino:not(.stopped)');

        // lese supprimer
        for (let i = 0; i < cells.length; i++) {
            cells[i].remove();
        }
    }

    function restartGame() {
        // supprimer tous les tetriminos
        eraseTetrimino();

        // supprimer tous les tetriminos arrêtés
        let stoppedCells = document.querySelectorAll('.stopped');
        for (let i = 0; i < stoppedCells.length; i++) {
            stoppedCells[i].remove();
        }

        // supprimer l'intervalle moveDown
        clearInterval(moveDownInterval);

        // choisir un nouveau tetrimino
        tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];

        // réinitialiser la position de départ
        currentPosition = {x: 5, y: 0};
    }


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
            // faire le nouveau tetrimino
            drawTetrimino();
        } else if (event.key === 'ArrowRight' && canMoveSide(1)) {
            // effacer le tetrimino actuel
            eraseTetrimino();
            // déplacer le tetrimino vers la droite
            currentPosition.x++;
            // faire le nouveau tetrimino
            drawTetrimino();
        } else if (event.key === 'ArrowUp') {
            // effacer le tetrimino actuel
            eraseTetrimino();
            // faire tourner le tetrimino
            rotateTetrimino();
            // faire le nouveau tetrimino
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
        let fullRowFound = false;
        let numberOfDeletedRows = 0;

        // Démarrer à partir de la rangée du bas et remonter
        for (let y = 20; y > 0; y--) {
            let cells = gameBoard.querySelectorAll(`[style*="grid-row-start: ${y};"]`);

            // Si la rangée contient 10 cellules, elle est pleine
            if (cells.length === 10) {
                numberOfDeletedRows++;
                // Supprimer tous les cellules de cette rangée
                for (let i = 0; i < cells.length; i++) {
                    cells[i].remove();
                }

                // Décaler toutes les rangées supérieures d'une rangée vers le bas
                for (let yAbove = y - 1; yAbove > 0; yAbove--) {
                    let aboveCells = gameBoard.querySelectorAll(`[style*="grid-row-start: ${yAbove};"]`);
                    for (let i = 0; i < aboveCells.length; i++) {
                        // Vérifier si la cellule peut être déplacée vers le bas
                        let belowCell = gameBoard.querySelector(`[style="grid-column-start: ${aboveCells[i].style.gridColumnStart}; grid-row-start: ${yAbove + 1};"]`);
                        if (!belowCell || (belowCell && !belowCell.classList.contains('stopped'))) {
                            // Modifier la position de gridRowStart
                            aboveCells[i].style.gridRowStart = yAbove + 1;
                        }
                    }
                }

                // Mise à jour du score
                if (numberOfDeletedRows === 4) {
                    updateScore(100);
                } else {
                    updateScore(10 * numberOfDeletedRows);
                }
            }

            // au moins une ligne complète
            fullRowFound = true;
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
        if (canMoveDown()) {
            eraseTetrimino();
            currentPosition.y++;
            drawTetrimino();
        } else {
            let cells = gameBoard.querySelectorAll('.tetrimino');
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.add('stopped');
                deleteFullRows();
            }

            // vérifie si un tétrimino est en haut du tableau
            gameOver();

            // utiliser setTimeout pour différez la création de la nouvelle pièce
            setTimeout(() => {
                tetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)];
                currentPosition = {x: 5, y: 0};
                drawTetrimino();
            }, 100);
        }
    }

    let score = 0;

    function updateScore(points) {
        score += points;
        document.getElementById('score').innerText = score;
    }

// si la touche échap est pressée, appeler la fonction restartGame
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelector('#start-screen').style.display = 'flex';
            restartGame();
        }
    });

    function gameOver() {
        let finalScore = document.querySelector('#final-score');
        finalScore.innerText = score;
        let cells = document.querySelectorAll('.tetrimino');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].style.gridRowStart === '1') {
                document.querySelector('#game-over').style.display = 'flex';
                restartGame();
            }
        }
    }


}