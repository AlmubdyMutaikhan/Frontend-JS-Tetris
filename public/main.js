// imports
import * as env from './modules/init.js'
import * as token from './tokens/token.js'

// base setups
document.body.style.zoom = "101%";

// global main variables
let scoreDisplay = document.getElementsByClassName('score')[0];
let bgSound = document.getElementById('bgSound');
let btn = document.getElementById('play');

let currentColor = "";
let currentFigure = 0; // index
let pause = true;
let figureBody = [];
let rotate = 1;
let score = 0;
let interval;

// rs btn
let rs = document.getElementById('restart')
rs.addEventListener('click', () => {
    console.log("restart...")
    start()
})

// creates full grid
env.build()

/*
token.entryPoint = [x, y]
*/

function reset() {
    clearInterval(interval)
    btn.style.display = "block";
    figureBody = []
    currentFigure = 0
    currentFigure = 0
    rotate = 1
    score = 0
    pause = true;
    let blocks = document.getElementsByClassName('excel');

    for(let i = 0; i < blocks.length;i++) {
        blocks[i].classList.remove(blocks[i].classList[1])
        blocks[i].classList.remove('set')
    }
}

function start() {
    reset();
    reset();
    create();
    interval = setInterval(moveDown, 500);
}

function fillBoxesWithColor(elem, is_set) {
    for(let i = 0; i < elem.length;i++) {
        elem[i].classList.add(currentColor)
        if(is_set) {
            elem[i].classList.add('set')
        }
    }
}

function unfillBoxes(elem) {
        for(let i = 0; i < elem.length;i++) {
            elem[i].classList.remove(currentColor)
        }
}


function create() {

    function getRandomIndex(arr) {
        return Math.round(Math.random() * (arr.length - 1))
    }

    function initFigureBody() {
        figureBody = [
            document.querySelector(`[posx = "${token.entryPoint[0]}"][posy = "${token.entryPoint[1]}"]`),
            document.querySelector(`[posx = "${token.entryPoint[0] + token.mainArr[currentFigure][0][0]}"][posy = "${token.entryPoint[1] + token.mainArr[currentFigure][0][1]}"]`),
            document.querySelector(`[posx = "${token.entryPoint[0] + token.mainArr[currentFigure][1][0]}"][posy = "${token.entryPoint[1] + token.mainArr[currentFigure][1][1]}"]`),
            document.querySelector(`[posx = "${token.entryPoint[0] + token.mainArr[currentFigure][2][0]}"][posy = "${token.entryPoint[1] + token.mainArr[currentFigure][2][1]}"]`),
        ]    
        return figureBody
    }

    currentColor = token.colors[getRandomIndex(token.colors)]
    console.log(currentColor)
    currentFigure = getRandomIndex(token.mainArr)
    initFigureBody()
    fillBoxesWithColor(figureBody, false)
}

start()

function moveDown() {
    let moveFlag = true;

    function getCoordinates() {
        let coordinates = [
            [figureBody[0].getAttribute('posx'), figureBody[0].getAttribute('posy')],
            [figureBody[1].getAttribute('posx'), figureBody[1].getAttribute('posy')],
            [figureBody[2].getAttribute('posx'), figureBody[2].getAttribute('posy')],
            [figureBody[3].getAttribute('posx'), figureBody[3].getAttribute('posy')],       
        ]
        return coordinates
    }
    
    function checkEdges(coordinates) {
        for(let i = 0; i < coordinates.length;i++) {
        // if y == 1
        if(coordinates[i][1] == 1 || document.querySelector(`[posx = "${coordinates[i][0]}"][posy = "${coordinates[i][1] - 1}"]`)
            .classList.contains('set')) {
            moveFlag = false;
            break;
        }
    }
    }

    function init_new_figure(coordinates) {
        let figure = [
            document.querySelector(`[posx = "${coordinates[0][0]}"][posy = "${coordinates[0][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[1][0]}"][posy = "${coordinates[1][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[2][0]}"][posy = "${coordinates[2][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[3][0]}"][posy = "${coordinates[3][1] - 1}"]`),
        ]
        return figure
    }

    function check_lines() {
        for(let row = 1;row<=20;row++) {
            let full_row = true;

            for(let col = 1; col <= 10;col++) {
                if(!document.querySelector(`[posx="${col}"][posy="${row}"]`).classList.contains('set')) {
                    full_row = false;
                    break;
                }
            }

            if(full_row) {
                let yayBtn = document.getElementById('boom');
                let boomEffect = new Audio('./sounds/boom.wav');
                boomEffect.play();
                yayBtn.style.display = "block";
                setTimeout(() => {
                    yayBtn.style.display = "none";
                },602);


                score += 10;
                
                for(let i = 1;i<=10;i++) {
                    let block = document.querySelector(`[posx="${i}"][posy="${row}"]`).classList
                    block.remove('set');
                    block.remove(block[1]);
                }

                let set = document.querySelectorAll('.set');
                let newSet = []
                let colorSet = []

                for(let s = 0;s<set.length;s++) {
                    let setCoordinates = [set[s].getAttribute('posx'), set[s].getAttribute('posy')]
                    if(setCoordinates[1] > row) {
                        set[s].classList.remove('set');
                        let block_color = set[s].classList[1];
                        set[s].classList.remove(block_color);
                        newSet.push(document.querySelector(`[posx="${setCoordinates[0]}"][posy="${setCoordinates[1] - 1}"]`))
                        colorSet.push(block_color);
                    }
                }
                for(let i = 0; i < newSet.length;i++) {
                    newSet[i].classList.add('set');
                    newSet[i].classList.add(colorSet[i]);
                }
                row--;
            }
        }
    }


    function is_game_over() {     
        for(let col = 1; col <= 10;col++) {
            if(document.querySelector(`[posx="${col}"][posy="${20}"]`).classList.contains('set')) {
                scoreDisplay.innerHTML = "Game Over, Your Score is " + score;
                document.querySelector('.title').innerHTML = "Tetris | Game Over";
                let gameOverSound = new Audio('./sounds/gameover.wav');
                gameOverSound.play();
                if(!bgSound.paused) {
                    bgSound.pause();
                }
                clearInterval(interval)
                
                return true
            }
        }
        return false;
    }

    if(!pause) {
        scoreDisplay.innerHTML = "Your score: " + score;
        // save coordinates for temporary array
        let coordinates = getCoordinates()
        // check edges, can be block moved further
        checkEdges(coordinates)
        unfillBoxes(figureBody)
        
        if(moveFlag) {    
            figureBody = init_new_figure(coordinates)
            fillBoxesWithColor(figureBody)  
        } else {
            let fallTetromino = new Audio('./sounds/fallTetromino.wav');
            fallTetromino.play();
            // reset rotate
            rotate = 1;
            fillBoxesWithColor(figureBody, true)
            check_lines()
            if(!is_game_over()) {
                create(); // next figure
            }
    }
    }

}


btn.addEventListener('click', function(e) {
    if(!pause) {
        clearInterval(interval);
        interval = null;
        pause = true;
        btn.style.display = "block";
    } else {
        pause = false;
        bgSound.play();
        btn.style.display = "none";
    }
})



window.addEventListener('keydown', function (e) {
    let coordinates1 = [ figureBody[0].getAttribute('posx'), figureBody[0].getAttribute('posy')];
    let coordinates2 = [ figureBody[1].getAttribute('posx'), figureBody[1].getAttribute('posy')];
    let coordinates3 = [ figureBody[2].getAttribute('posx'), figureBody[2].getAttribute('posy')];
    let coordinates4 = [ figureBody[3].getAttribute('posx'), figureBody[3].getAttribute('posy')];


    function moveByX(d) {
        let moveByXFlag = true
        let newFigure = [
            document.querySelector(`[posx = "${+coordinates1[0] + d}"][posy = "${coordinates1[1]}"]`),
            document.querySelector(`[posx = "${+coordinates2[0] + d}"][posy = "${coordinates2[1]}"]`),
            document.querySelector(`[posx = "${+coordinates3[0] + d}"][posy = "${coordinates3[1]}"]`),
            document.querySelector(`[posx = "${+coordinates4[0] + d}"][posy = "${coordinates4[1]}"]`),
        ]

        for(let i = 0; i < newFigure.length;i++) {
            if(!newFigure[i]  || newFigure[i].classList.contains('set')) {
                moveByXFlag = false;
                break;
            }
        }
        
        if(moveByXFlag) {
            unfillBoxes(figureBody)
            figureBody = newFigure;
            fillBoxesWithColor(figureBody, false)
        }

    }

    function init_new_figure() {
        let newFigure = [
            document.querySelector(`[posx = "${coordinates1[0]}"][posy = "${coordinates1[1]}"]`),
            document.querySelector(`[posx = "${+coordinates2[0] + token.mainArr[currentFigure][rotate + 2][1][0]}"][posy = "${+coordinates2[1] + token.mainArr[currentFigure][rotate + 2][1][1]}"]`),
            document.querySelector(`[posx = "${+coordinates3[0] + token.mainArr[currentFigure][rotate + 2][2][0]}"][posy = "${+coordinates3[1] + token.mainArr[currentFigure][rotate + 2][2][1]}"]`),
            document.querySelector(`[posx = "${+coordinates4[0] + token.mainArr[currentFigure][rotate + 2][3][0]}"][posy = "${+coordinates4[1] + token.mainArr[currentFigure][rotate + 2][3][1]}"]`),
        ]
        return newFigure
    }
  
    if(e.keyCode == 81) {
        if(pause) {
            btn.style.display = "none";
            pause = false;
        } else {
            btn.style.display = "block";
            pause = true;
        }
    }
    if(e.keyCode == 37) {
        moveByX(-1);
    } else if(e.keyCode == 39) {
        moveByX(1);
    } else if(e.keyCode == 40) {
        moveDown();
    } else if(e.keyCode == 38) {
        let newFigure = init_new_figure()
        let to_rotate = true;

        for(let i = 0; i < newFigure.length;i++) {
            if(!newFigure[i]  || newFigure[i].classList.contains('set')) {
                to_rotate = false;
                break;
            }
        }
         
        if(to_rotate) {
            console.log("rotate: " +  rotate);
            unfillBoxes(figureBody)
            figureBody = newFigure;
            fillBoxesWithColor(figureBody)

            if(rotate < 4) {
                rotate++;
            } else {
                rotate = 1;
            }
        }
    }

})


/*
    What I learnt from this project ?
    + getAttribute(attr_name), setAttribute(attr_name, value)
    + events
        addEventListener('event', function)
    + classList
       add(class)
       remove(class)
       [0],[1] iterate over it
    + querySelector() selects any element, takes any argument related to that certain element
    + appendChild()
*/
