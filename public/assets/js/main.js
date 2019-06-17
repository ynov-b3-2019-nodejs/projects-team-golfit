let INTRO = 0;
let DIRECTIONS = 1;
let PLAYING = 2;
let OUTRO = 3;

let level = 0;

let gameState = INTRO;
let ballImg;

let ball;
let balls = [];

let titleImg;
let bgImg;
let font;
let playButton;
let playButtonImg;
let againButton;
let shotDemoImg;
let holeDemoImg;
let obstacleDemoImg;
let controlsButton;
let controlsButtonImg;
let backButton;
let backButtonImg;
let resetButton;
let resetButtonImg;
let hole;
let holeImg;
let wallImg;
let walls;
let sand;
let sandImg;
let sands;
let meterLength = 0;
let onBall = false;

let nx = 0;
let ny = 0;

let strokes = 0;

let grass;
let grasses;
let grassImgD;
let grassImgL;

//let levels = [hole1,hole2,hole3,hole4,hole5,hole6,hole62,hole7,hole8,hole82,hole9];
const levels = holes;
let pars = [1, 2, 3, 3, 3, 2, 2, 9, 7, 7, 1];
let parScore = 31;
let currentHole = [];

let socket;
let score;
let input;

function preload() {
    bgImg = loadImage("assets/images/bg.jpg");
    playButtonImg = loadImage("assets/images/playButton.jpg");
    controlsButtonImg = loadImage("assets/images/controlsButton.jpg");
    backButtonImg = loadImage("assets/images/backButton.jpg");
    resetButtonImg = loadImage("assets/images/resetButton.jpg");
    ballImg = loadImage("assets/images/ball.png");
    ballSecondaryImg = loadImage("assets/images/ballSecondary.png");
    titleImg = loadImage("assets/images/golfBg.jpg");
    holeImg = loadImage("assets/images/hole.png");
    wallImg = loadImage("assets/images/wall.jpg");
    sandImg = loadImage("assets/images/sand.jpg");
    grassImgD = loadImage("assets/images/grassD.jpg");
    grassImgL = loadImage("assets/images/grassL.jpg");
    font = loadFont("assets/images/pixelFont.otf");
    shotDemoImg = loadImage("assets/images/shotDemo.jpg");
    holeDemoImg = loadImage("assets/images/holeDemo.jpg");
    obstacleDemoImg = loadImage("assets/images/obstacleDemo.jpg");
}

function onPlayerSpawn(data) {
    let { lvl, x, y } = data.data;
    let user = data.user;

    if ((level + 1) === lvl) {
        balls[user] = createSprite(x, y);
        ballSecondaryImg.resize(25, 25);
        balls[user].addImage(ballSecondaryImg);
        balls[user].setCollider("circle", 0, 0, 12.5, 12.5);
        balls[user].friction = 0.15;
    }
}

function onPlayerLeave(user) {
    notice(user + ' s\'est déconnecté.');

    if (balls[user]) {
        balls[user].remove();
    }
}

function onPlayerShoot(data) {
    let { lvl, tx, ty } = data.data;
    let user = data.user;

    if ((level + 1) === lvl) {
        balls[user].setVelocity(tx, ty);
    }
}

function onPlayerOverlap(data) {
    let { lvl, user } = data;

    if ((level + 1) === lvl) {
        balls[user].remove();
    }
}

function onPlayerGetUsers(data) {
    console.log(data);
}

function setup() {
    let username = randomUser();

    socket = io.connect();
    socket.on('notice', (data) => {
        notice(data);
    });

    socket.on('spawned', onPlayerSpawn);
    socket.on('leave', onPlayerLeave);
    socket.on('shoot', onPlayerShoot);
    socket.on('overlap', onPlayerOverlap);
    socket.on('users', onPlayerGetUsers);

    createCanvas(windowWidth, windowHeight);
    playButton = new Button(width / 2 - width / 12, height * .55, width / 6, height / 8, playButtonImg);
    controlsButton = new Button(width / 2 - width / 12, height * .7, width / 6, height / 8, controlsButtonImg);
    backButton = new Button(width * .05, height * .05, width / 9, height / 11, backButtonImg);
    againButton = new Button(width / 2 - width / 18, height * .7, width / 9, height / 11, playButtonImg);
    resetButton = new Button(width / 2 - width / 16, 25, width / 8, height / 16, resetButtonImg);

    walls = new Group();
    grasses = new Group();
    sands = new Group();

    input = createInput(username).position(width / 2 - width / 12, height * .50);

    startNewGame();
}

function createHole() {
    for (let r = 0; r < currentHole[0].length; r++) {
        for (let c = 0; c < currentHole[0][r].length; c++) {
            if (currentHole[0][r].charAt(c) == " " || currentHole[0][r].charAt(c) == "h" || currentHole[0][r].charAt(c) == "b") {
                if (r % 2 == 0) {
                    if (c % 2 == 0) {
                        grass = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                        grassImgD.resize(26, 26);
                        grass.addImage(grassImgD);
                        grasses.add(grass);
                    } else if (c % 2 == 1) {
                        grass = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                        grassImgL.resize(26, 26);
                        grass.addImage(grassImgL);
                        grasses.add(grass);
                    }
                } else if (r % 2 == 1) {
                    if (c % 2 == 0) {
                        grass = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                        grassImgL.resize(26, 26);
                        grass.addImage(grassImgL);
                        grasses.add(grass);
                    } else if (c % 2 == 1) {
                        grass = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                        grassImgD.resize(26, 26);
                        grass.addImage(grassImgD);
                        grasses.add(grass);
                    }
                }
            }
            if (currentHole[0][r].charAt(c) == "1") {
                let wall = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                wallImg.resize(26, 26);
                wall.addImage(wallImg);
                wall.setCollider("rectangle");
                wall.immovable = true;
                walls.add(wall);
            }
            if (currentHole[0][r].charAt(c) == "h") {
                hole = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                holeImg.resize(25, 25);
                hole.addImage(holeImg);
                hole.setCollider("circle", 0, 0, 12.5, 12.5);
            }
            if (currentHole[0][r].charAt(c) == "b") {
                ball = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                ballImg.resize(25, 25);
                ball.addImage(ballImg);
                ball.setCollider("circle", 0, 0, 12.5, 12.5);
                ball.friction = 0.15;

                if(level !== 0) {
                    socket.emit('spawn', {
                        lvl: level + 1,
                        x: ball.position.x,
                        y: ball.position.y
                    });
                }
            }
            if (currentHole[0][r].charAt(c) == "s") {
                sand = createSprite((width / 2 - (currentHole[0][r].length * 25) / 2) + 12.5 + c * 25, (height / 2 - (currentHole[0].length * 25) / 2) + 12.5 + r * 25, 25, 25);
                sandImg.resize(26, 26);
                sand.addImage(sandImg);
                sand.setCollider("rectangle");
                sands.add(sand);
            }
        }
    }
}

function removeHole() {
    walls.removeSprites();
    grasses.removeSprites();
    sands.removeSprites();
    ball.remove();
    hole.remove();
    currentHole.pop();

    balls.forEach((el) => {
        el.remove();
    });

    if (level < 11) {
        currentHole.push(levels[level]);
    }
}

function startNewGame() {
    level = 0;
    strokes = 0;
    currentHole.push(holes[0]);
    createHole();
}

function resetHole() {
    strokes++;
    walls.removeSprites();
    grasses.removeSprites();
    sands.removeSprites();
    ball.remove();
    hole.remove();
    createHole();
}

function meter() {
    if (mouseIsPressed && ball.overlapPoint(mouseX, mouseY)) {
        onBall = true;
    }
    if (mouseIsPressed && onBall) {
        if (Math.abs(ball.velocity.x) < .05 && Math.abs(ball.velocity.y) < .05) {
            meterLength = dist(ball.position.x, ball.position.y, mouseX, mouseY);
            let cx = (mouseX - ball.position.x);
            let cy = (mouseY - ball.position.y);

            if (meterLength <= 160) {
                nx = cx;
                ny = cy;
            } else {
                nx = 160 * cx / meterLength;
                ny = 160 * cy / meterLength;
            }
            strokeWeight(20);

            if (meterLength < 160 * .25) {
                stroke('green');
            } else if (meterLength < 160 * .5) {
                stroke('yellow');
            } else if (meterLength < 160 * .75) {
                stroke('orangered');
            } else {
                stroke('red');
            }
            line(ball.position.x, ball.position.y, ball.position.x + nx, ball.position.y + ny);
        }
    }
}

function shot() {
    onBall = false;
    meterLength = 0;
    strokes++;

    let tx = -nx * .75;
    let ty = -ny * .75;
    ball.setVelocity(tx, ty);

    socket.emit('shot', {
        lvl: level + 1,
        tx: tx,
        ty: ty
    });
}

function notice(str) {
    $('.notice').append('<p class="system">' + str + '</p>');
}

function draw() {
    background(bgImg);

    if (gameState === INTRO) {
        image(titleImg, 0, 0, width, height);

        textSize(35);
        textFont(font);
        fill('white');
        text("Pseudo", width / 2 - width / 20, height * .48);

        playButton.draw();
        controlsButton.draw();
    } else if (gameState === DIRECTIONS) {
        backButton.draw();
        textSize(50);
        textFont(font);
        fill('white');

        text("Cliquez et relâchez", width * .45, height * .15);
        text("la balle pour tirer", width * .45, height * .15 + 50);
        image(shotDemoImg, width * .35 - 100, height * .15 - 100, 200, 200);

        text("Évitez les obstacles", 500, height * .525);
        image(obstacleDemoImg, width * .85 - 100, height * .5 - 100, 200, 200);

        text("Finissez le parcours en", 350, height * .8);
        text("moins de coups possible", 350, height * .8 + 50);
        image(holeDemoImg, 75, height * .8 - 100, 200, 200);
    } else if (gameState === PLAYING) {
        fill('White');
        textSize(50);
        textFont(font);

        if (level < 6) {
            text("Trou " + (level + 1), 25, 50);
        } else if (level >= 6 && level < 9) {
            text("Trou " + level, 25, 50);
        } else {
            text("Trou " + (level - 1), 25, 50);
        }

        text("Coups: " + strokes, width - 325, 50);
        drawSprites();

        if (level === 10) {
            hole.bounce(walls);
            if (frameCount % 60 === 0) {
                hole.setVelocity(random(-10, 10), random(-10, 10));
            }
        }

        text("Par " + pars[level], 25, 112);
        meter();

        drawSprite(ball);
        drawSprite(hole);
        ball.bounce(walls);

        if (ball.overlap(sands)) {
            ball.friction = .65;
        } else {
            ball.friction = .15;
        }

        balls.forEach((el) => {
            el.bounce(walls);

            if (el.overlap(sands)) {
                el.friction = .65;
            } else {
                el.friction = .15;
            }
        });

        if (ball.overlap(hole)) {
            socket.emit('hole', level + 1);
            level++;
            removeHole();

            if (level === 11) {
                score = strokes - parScore;
                socket.emit('finish', {
                    strokes: strokes,
                    score: (score > 0) ? '+' + score : score
                });
                gameState = OUTRO;
            } else {
                createHole();
            }
        }
        resetButton.draw();
    } else if (gameState === OUTRO) {
        textSize(75);
        textFont(font);
        fill('white');
        text("Félicitations !", width * .5 - 400, height * .15);
        textSize(40);
        text("Vous avez terminé le parcours", width * .5 - 450, height * .25);
        text("en " + strokes + " coups", width * .5 - 175, height * .3);
        textSize(50);

        if (score > 0) {
            text("Score: +" + score, width * .5 - 190, height * .4);
        } else {
            text("Score: " + score, width * .5 - 190, height * .4);
        }

        text("Rejouer?", width * .5 - 150, height * .685);
        againButton.draw();
    }
}

function mouseClicked() {
    if (gameState === INTRO) {
        if (playButton.isClicked(mouseX, mouseY)) {
            input.hide();
            socket.emit('connected', input.value());
            socket.emit('spawn', {
                lvl: level + 1,
                x: ball.position.x,
                y: ball.position.y
            });
            gameState = PLAYING;
        }
        if (controlsButton.isClicked(mouseX, mouseY)) {
            input.hide();
            gameState = DIRECTIONS;
        }
    } else if (gameState === DIRECTIONS) {
        if (backButton.isClicked(mouseX, mouseY)) {
            input.show();
            gameState = INTRO;
        }
    } else if (gameState === PLAYING) {
        if (resetButton.isClicked(mouseX, mouseY)) {
            resetHole();
        }
    } else if (gameState === OUTRO) {
        if (againButton.isClicked(mouseX, mouseY)) {
            socket.emit('restarting');
            startNewGame();
            gameState = PLAYING;
        }
    }
}

function touchStarted() {
    if (gameState === INTRO) {
        if (playButton.isClicked(mouseX, mouseY)) {
            input.hide();
            socket.emit('connected', input.value());
            socket.emit('spawn', {
                lvl: level + 1,
                x: ball.position.x,
                y: ball.position.y
            });
            gameState = PLAYING;
        }
        if (controlsButton.isClicked(mouseX, mouseY)) {
            input.hide();
            gameState = DIRECTIONS;
        }
    } else if (gameState === DIRECTIONS) {
        if (backButton.isClicked(mouseX, mouseY)) {
            input.show();
            gameState = INTRO;
        }
    } else if (gameState === PLAYING) {
        if (resetButton.isClicked(mouseX, mouseY)) {
            resetHole();
        }
    } else if (gameState === OUTRO) {
        if (againButton.isClicked(mouseX, mouseY)) {
            socket.emit('restarting');
            startNewGame();
            gameState = PLAYING;
        }
    }
}

function mouseReleased() {
    if (gameState === PLAYING && onBall) {
        shot();
    }
}

function touchEnded() {
    if (gameState === PLAYING && onBall) {
        shot();
    }
}

function randomUser() {
    return 'User_' + Math.random().toString(36).substr(2, 9);
}