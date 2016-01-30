// Enemies our player must avoid
var Enemy = function(x, y, step) {
    this.MIN_X = -10;
    this.MAX_X = 405;

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = x;
    this.y =  y;
    this.step = step;
    this.moveEnabled = true;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    if (!this.moveEnabled) {
        return;
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.step;
    if (this.x > this.MAX_X) { this.x = this.MIN_X }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (C.drawCollisionArea) {
        drawArea(this.getArea());
    }
};

// Returns the are used for collision detection
Enemy.prototype.getArea = function() {
    return {
        p1: { x: this.x +5 ,   y: this.y + 80 },
        p2: { x: this.x + 95,  y: this.y + 80 + 60 }
    };
};


Enemy.prototype.canMove = function(move) {
    this.moveEnabled = move;
};

Enemy.prototype.increaseStep = function(value) {
    this.step += value;
};



/**
 * A player - has to cross the board
 * Can be moved by keys
 *
 * @param x the x coordinate of the player
 * @param y the y coordinate of the player
 * @param spriteId id counted from 0 to 4 to identify the images left from the board.
 * @constructor
 */
var Player = function (x, y, spriteId) {
    this.spriteId = spriteId;
    this.imageId = "#p" + spriteId;
    this.sprite = $(this.imageId).attr('src');
    $(this.imageId).css("background", "aquamarine");
    this.x = x;
    this.y = y;
    this.moveEnabled = true;
};

/**
 * 'Factory' method to create the next player
 */
Player.prototype.getNextPlayer = function() {
    this.clearSelection();
    var col = Math.floor(Math.random() * 4)
    var x = col * C.X_STEP;
    return new Player(x, C.MAX_Y, this.spriteId + 1);
};


Player.prototype.clearSelection = function() {
    if (this.imageId !== undefined) {
        $(this.imageId).removeAttr("style");
    }
};


/**
 * Enable disable if a player can move.
 * @param move true player can move, false player cannot move.
 */
Player.prototype.canMove = function(move) {
    this.moveEnabled = move;
};

/**
 * Process keyboard input.
 * @param key a key in the range of 'left', 'right', 'up' and 'down'.
 */
Player.prototype.handleInput = function(key) {

    if (!this.moveEnabled) {
        return;
    }

    switch (key) {
        case 'left':
            this.x -= C.X_STEP;
            break;
        case'up':
            this.y -= C.Y_STEP;
            break;
        case 'right':
            this.x += C.X_STEP;
            break;
        case 'down':
            this.y += C.Y_STEP;
            break;
    }
    goalLine = undefined;
    if (this.x < C.MIN_X) {
        this.x = C.MIN_X;
    }
    if (this.x > C.MAX_X) {
        this.x = C.MAX_X;
    }
    if (this.y < C.MIN_Y) {
        this.y = C.MIN_Y;
        var newStar = new Star(this.x, this.y);
        if (game.isNewStar(newStar, allStars)) {
            game.increaseStep(allEnemies);
            allStars.push(newStar);
            if (allStars.length === 5) {
                this.sprite = undefined;
                this.moveEnabled = false;
                game.win();
            } else {
                player = this.getNextPlayer();
            }
        } else {
            goalLine = new GoalLine(C.strings.movon);
        }
    }
    if (this.y > C.MAX_Y) {
        this.y = C.MAX_Y;
    }
    console.log("New coord: " + this.x + " / " + this.y)
};

/**
 * Returns true if player has colided with an enemy.
 */
Player.prototype.hasCollided = function() {
    var hasCollision = false;
    for (var i=0; i<allEnemies.length; i++) {
        if (game.checkCollision(this.getArea(), allEnemies[i].getArea())) {
            hasCollision = true;
            break;
        }
    }
    if (hasCollision) {
        this.canMove(false);
        game.stopEnemies(allEnemies)
    }
};


/**
 * Update player move - nothing to do plyer is moved by curser keys.
 */
Player.prototype.update = function(dt) {
};


/**
 * Renders the image of the player.
 * Can optionally draw the rectangle utilized for collision detection.
 */
Player.prototype.render = function() {
    if (this.sprite !== undefined) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    if (C.drawCollisionArea) {
        drawArea(this.getArea());
    }
};


/**
 * Returns the are used for collision detection
 */
Player.prototype.getArea = function() {
    return {
        p1: { "x": this.x + 22,      "y": this.y + 67 },
        p2: { "x": this.x + 20 + 60, "y": this.y + 67 + 58 }
    };
};

/**
 * Draws a rectangle specified by upper left (area.p1) and a lower right corner (area.p2).
 */
var drawArea = function(area) {
    ctx.beginPath();
    ctx.moveTo(area.p1.x, area.p1.y);
    ctx.lineTo(area.p1.x, area.p2.y);
    ctx.lineTo(area.p2.x, area.p2.y);
    ctx.lineTo(area.p2.x, area.p1.y);
    ctx.closePath();
    ctx.stroke();
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies;

/**
 * Create the first player.
 * Intilaized in engine.reset().
 */
var player;

/**
 * For every row at most one star can be gained
 */
var allStars;

/**
 * The goal line for messges in the middle of the game board.
 * Intilaized in engine.reset().
 */
var goalLine;

/**
 * The status line for messages at the bottom of the board.
 * Intilaized in engine.reset().
 */
var statusLine;

/**
 * Some additional functionality like collision detection has been moved to a separate object,
 * the Game Object.
 * Intilaized in engine.reset().
 */
var game;

/**
 *
 * @type {boolean}
 */
var doReset = false;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


/**
 * Click on the first player to restart the game using the reset() method
 */
$('#p0').click(function() {
    player.clearSelection();
    doReset = true;
});


/**
 * Click on the second player to restart the game using browser reload.
 */
$('#p1').click(function() {
    location.reload();
});
