/*
    Inits game elements
*/

function createGrid() {
    let tetris = document.createElement('div');
    tetris.classList.add('tetris');
    return tetris;
}

function fillTetris() {
    // init grid
    let grid = createGrid();

    // fill grid with boxes
    for(let i = 0; i < 300;i++) {
        let box = document.createElement('div');
        box.classList.add('excel');
        grid.appendChild(box);
    }

    return grid;
}

function createVisiblePart() {
    // init visible part of grid for playing
    let main = document.getElementsByClassName('main')[0];
    let grid = fillTetris(); // get fulled grid 
    main.appendChild(grid);
    return main;
}

function setCoordinates() {
    // sets coordinates for every box in the grid
    let boxes = document.getElementsByClassName('excel');
    let i = 0;

    // setting up coordinates to every single box
    for(let y = 30;y>0;y--) {
        for(let x = 1; x <= 10;x++) {
            boxes[i].setAttribute('posX', x);
            boxes[i].setAttribute('posY', y);
            i += 1; // move to next box
        }
    }
    return boxes;
}

// main function
function build() {
    createVisiblePart();
    setCoordinates();
}

export { build };


