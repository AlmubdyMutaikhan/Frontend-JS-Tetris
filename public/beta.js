document.body.style.zoom = "100%";
// init grid for tetris
let tetris = document.createElement('div');
tetris.classList.add('tetris');


let pause = true;
let scoreDisplay = document.getElementsByClassName('score')[0];
let bgSound = document.getElementById('bgSound');


// fill grid with boxes
for(let i = 0; i < 300;i++) {
    let excel = document.createElement('div');
    excel.classList.add('excel');
    tetris.appendChild(excel);
}

// init visible part of grid for playing
let main = document.getElementsByClassName('main')[0];
main.appendChild(tetris);

let excel = document.getElementsByClassName('excel');
let i = 0;

// setting up coordinates to every single box
for(let y = 30;y>0;y--) {
    for(let x = 1; x <= 10;x++) {
        excel[i].setAttribute('posX', x);
        excel[i].setAttribute('posY', y);
        i += 1; // move to next box
    }
}

// stores coordinates for this tetromino
let x = 5;
let y = 20;

// why three dots? bcoz we already have base dot
let mainArr = [
    // stick 
    [
        [0,1],
        [0,2],
        [0,3],
    
        [
        // 90 deg
            [0,0],
            [1,-1],
            [2,-2],
            [3,-3]
        ],
        // 180deg
        [
            [0,0],
            [-1,-1],
            [-2,-2],
            [-3,-3]
        ],
        // 270deg
        [
            [0,0],
            [-1,1],
            [-2,2],
            [-3,3]
        ],
        // 360deg
        [
            [0,0],
            [1,1],
            [2,2],
            [3,3]
        ]
    
    ],
    // square
    [
        [1,0],
        [0,1],
        [1,1],

            [
            // 90 deg
                [0,0],
                [0,0],
                [0,0],
                [0,0]
            ],
            // 180deg
            [
                [0,0],
                [0,0],
                [0,0],
                [0,0]
            ],
            // 270deg
            [
                [0,0],
                [0,0],
                [0,0],
                [0,0]
            ],
            // 360deg
            [
                [0,0],
                [0,0],
                [0,0],
                [0,0]
            ]


    ],
    // T
    [
        [-1,1],
        [0,1],
        [1,1],

        // 90deg
        [
            [0,0],
            [2,0],
            [1,-1],
            [0,-2]
        ],
        // 180 deg
        [
            [0,0],
            [0,-2],
            [-1,-1],
            [-2,0]
        ],
        // 270deg
        [
            [0,0],
            [-2,0],
            [-1,1],
            [0,2]
        ],
        // 360deg
        [
            [0,0],
            [0,2],
            [1,1],
            [2,0]
        ]

    ],
    // L
    [
        [1,0],
        [0,1],
        [0,2],

            [
            // 90 deg
                [0,0],
                [-1,-1],
                [1,-1],
                [2,-2]
            ],
            // 180deg
            [
                [0,0],
                [-1,1],
                [-1,-1],
                [-2,-2]
            ],
            // 270deg
            [
                [0,0],
                [1,1],
                [-1,1],
                [-2,2]
            ],
            // 360deg
            [
                [0,0],
                [1,-1],
                [1,1],
                [2,2]
            ]
    ],
    // Z
    [
        [1,0],
        [1,1],
        [2,1],


        [
            // 90 deg
                [0,0],
                [-1,-1],
                [0,-2],
                [-1,-3]
            ],
            // 180deg
            [
                [0,0],
                [-1,1],
                [-2,0],
                [-3,1]
            ],
            // 270deg
            [
                [0,0],
                [1,1],
                [0,2],
                [1,3]
            ],
            // 360deg
            [
                [0,0],
                [1,-1],
                [2,0],
                [3,-1]
            ]

    ]
]

let colors = [
    "blue",
    "cyan",
    "red",
    "yellow",
    "green",
    "vailet",
    "orange",
    "brown",
    "salat",
    "pink"
]

let currentFigure = 0;
let currentColor = "";
let figureBody = 0;
let rotate = 1;
let score = 0;

function create() {
    function getRandom() {
        return Math.round(Math.random() * (mainArr.length - 1));
    }
    function getRandomColor() {
        return Math.round(Math.random() * (colors.length - 1));
    }
    currentColor = colors[getRandomColor()];
    console.log(currentColor)
    currentFigure = getRandom()
    figureBody = [
        document.querySelector(`[posx = "${x}"][posy = "${y}"]`),
        document.querySelector(`[posx = "${x + mainArr[currentFigure][0][0]}"][posy = "${y + mainArr[currentFigure][0][1]}"]`),
        document.querySelector(`[posx = "${x + mainArr[currentFigure][1][0]}"][posy = "${y + mainArr[currentFigure][1][1]}"]`),
        document.querySelector(`[posx = "${x + mainArr[currentFigure][2][0]}"][posy = "${y + mainArr[currentFigure][2][1]}"]`),
    ]


    for(let i = 0; i < figureBody.length;i++) {
        figureBody[i].classList.add(currentColor);
    }
}

create()

function moveDown() {
    if(!pause) {
    scoreDisplay.innerHTML = "Your score: " + score;
    let moveFlag = true;
    // save coordinates for temporary array
    let coordinates = [
        [figureBody[0].getAttribute('posx'), figureBody[0].getAttribute('posy')],
        [figureBody[1].getAttribute('posx'), figureBody[1].getAttribute('posy')],
        [figureBody[2].getAttribute('posx'), figureBody[2].getAttribute('posy')],
        [figureBody[3].getAttribute('posx'), figureBody[3].getAttribute('posy')],       
    ]
    // check edges
    for(let i = 0; i < coordinates.length;i++) {
        // if y == 1
        if(coordinates[i][1] == 1 || document.querySelector(`[posx = "${coordinates[i][0]}"][posy = "${coordinates[i][1] - 1}"]`)
            .classList.contains('set')) {
            moveFlag = false;
            break;
        }
    }

    for(let i = 0; i < figureBody.length;i++) {
        figureBody[i].classList.remove(currentColor);
    }

    
    if(moveFlag) {    
      
        figureBody = [
            document.querySelector(`[posx = "${coordinates[0][0]}"][posy = "${coordinates[0][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[1][0]}"][posy = "${coordinates[1][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[2][0]}"][posy = "${coordinates[2][1] - 1}"]`),
            document.querySelector(`[posx = "${coordinates[3][0]}"][posy = "${coordinates[3][1] - 1}"]`),
        ]
        for(let i = 0; i < figureBody.length;i++) {
            figureBody[i].classList.add(currentColor);
        }    
    } else {
        let fallTetromino = new Audio('./sounds/fallTetromino.wav');
        fallTetromino.play();
        // reset rotate
        rotate = 1;
        for(let i = 0; i < figureBody.length;i++) {
            figureBody[i].classList.add('set');
            figureBody[i].classList.add(currentColor);
        }

        for(let row = 1;row<=20;row++) {
            let count = 0;
            for(let col = 1; col <= 10;col++) {
                if(document.querySelector(`[posx="${col}"][posy="${row}"]`).classList.contains('set')) {
                    count++;
                }

                if(count == 10) {
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
                break;
            }
        }
        


   
        create();
    }
}



 
 
}

let btn = document.getElementById('play');

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


interval = setInterval(moveDown, 500);

window.addEventListener('keydown', function (e) {
    let coordinates1 = [ figureBody[0].getAttribute('posx'), figureBody[0].getAttribute('posy')];
    let coordinates2 = [ figureBody[1].getAttribute('posx'), figureBody[1].getAttribute('posy')];
    let coordinates3 = [ figureBody[2].getAttribute('posx'), figureBody[2].getAttribute('posy')];
    let coordinates4 = [ figureBody[3].getAttribute('posx'), figureBody[3].getAttribute('posy')];


    function moveByX(d) {
        let newFigure = [
            document.querySelector(`[posx = "${+coordinates1[0] + d}"][posy = "${coordinates1[1]}"]`),
            document.querySelector(`[posx = "${+coordinates2[0] + d}"][posy = "${coordinates2[1]}"]`),
            document.querySelector(`[posx = "${+coordinates3[0] + d}"][posy = "${coordinates3[1]}"]`),
            document.querySelector(`[posx = "${+coordinates4[0] + d}"][posy = "${coordinates4[1]}"]`),
        ]

        let moveByXFlag = true
        for(let i = 0; i < newFigure.length;i++) {
            if(!newFigure[i]  || newFigure[i].classList.contains('set')) {
                moveByXFlag = false;
                break;
            }
        }
        
        if(moveByXFlag) {
            for(let i = 0; i < figureBody.length;i++) {
                figureBody[i].classList.remove(currentColor);
            }

            figureBody = newFigure;
            for(let i = 0; i < figureBody.length;i++) {
                figureBody[i].classList.add(currentColor);
            }
        }

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
        let newFigure = [
            document.querySelector(`[posx = "${coordinates1[0]}"][posy = "${coordinates1[1]}"]`),
            document.querySelector(`[posx = "${+coordinates2[0] + mainArr[currentFigure][rotate + 2][1][0]}"][posy = "${+coordinates2[1] + mainArr[currentFigure][rotate + 2][1][1]}"]`),
            document.querySelector(`[posx = "${+coordinates3[0] + mainArr[currentFigure][rotate + 2][2][0]}"][posy = "${+coordinates3[1] + mainArr[currentFigure][rotate + 2][2][1]}"]`),
            document.querySelector(`[posx = "${+coordinates4[0] + mainArr[currentFigure][rotate + 2][3][0]}"][posy = "${+coordinates4[1] + mainArr[currentFigure][rotate + 2][3][1]}"]`),
        ]

        let to_rotate = true;

        for(let i = 0; i < newFigure.length;i++) {
            if(!newFigure[i]  || newFigure[i].classList.contains('set')) {
                to_rotate = false;
                break;
            }
        }
         
        if(to_rotate) {
            console.log("rotate: " +  rotate);
            for(let i = 0; i < figureBody.length;i++) {
                figureBody[i].classList.remove(currentColor);
            }

            figureBody = newFigure;
            for(let i = 0; i < figureBody.length;i++) {
                figureBody[i].classList.add(currentColor);
            }
            if(rotate < 4) {
                rotate++;
            } else {
                rotate = 1;
            }
        }
    }

})


