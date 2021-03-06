const canvas = document.querySelector('#tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);



function arenaSweep() {/* eightenth */
    let rowCount = 1;

    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        var row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
        console.log(rowCount)
    }
}


// const matrix = [  /* first */
//     [0, 0, 0],
//     [1, 1, 1],
//     [0, 1, 0]
// ]

function collide(arena, player) { /* eleventh */
    let [m, o] = [player.matrix, player.pos]
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) { /* eighth */
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) { /* fiftenth */
    if (type === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    } else if (type === "O") {
        return [
            [2, 2],
            [2, 2],
        ]
    } else if (type === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ]
    } else if (type === "J") {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ]
    } else if (type === "I") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ]
    } else if (type === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ]
    } else if (type === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ]
    }
}

function drawMatrix(matrix, offset) { /* second */
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        })
    });
}

function draw() { /* fifth */
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) { /* tenth */
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() { /* seventh */
    player.pos.y++;

    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) { /* twelvth */
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() { /* sixtenth */
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

/*  
    [1, 2, 3]               [1, 4, 7]              [7, 4, 1]
    [4, 5, 6]   TRANSOSE    [2, 5, 8]    REVERSE   [8, 5, 2]   =  ROTATE
    [7, 8, 9]               [3, 6, 9]              [9, 6, 3]

                           thirtenth 
    on console example
    let a = "AAA";           // undefined
    let b = "BBB";           // undefined
    var temp = a;            // undefined
    a = b;                   // "BBB"
    b = temp                 // "AAA"
    console.log(a, b)        // BBB AAA
    [a, b] = [b, a]          // ["AAA", "BBB"]
*/

function rotate(matrix, dir) {/*thirtenth*/
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y],
                ]
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerRotate(dir) { /* forthenth */
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(plaer.matrix, -dir);
            pos;
            return;
        }
    }
}


let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) { /* forth */
    let deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const colors = [ /* sevententh */
    null,
    '#23036a',
    '#1abc9c',
    '#2e86de',
    '#09857c',
    '#088a3c',
    '#d36156',
    '#fe4066'
];

const arena = createMatrix(12, 20); /* ninth */

var player = { /* third */
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event => { /* sixth */
    // console.log(event)
    if (event.keyCode === 37) { /* leftarrow */
        playerMove(-1);
    } else if (event.keyCode === 39) { /* rightarrow */
        playerMove(1);
    } else if (event.keyCode === 40) { /* downarrow */
        playerDrop();
    } else if (event.keyCode === 81) { /* q */
        playerRotate(-1);
    } else if (event.keyCode === 87) { /* w */
        playerRotate(1);
    }
})

playerReset();
updateScore();
update();