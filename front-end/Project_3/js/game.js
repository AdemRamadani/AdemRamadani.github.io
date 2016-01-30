/**
 * game.js
 *
 * This file contains three object
 *
 * Game
 * Calculate intersection of objects.
 *
 * StatusLine
 * Line to be displayed at the bottom of the game board.
 *
 * GoalLine
 * Line to be displayed in the middle of the game board.
 *
 * Star
 * Star to be displayed in the top row.
 */

/**
 * Game - Provides some methods to provide functionalty to the arcade game like
 * verfication of intersection between a player and the enemy objects.
 */
var Game = function () {
};

/**
 * Returns true if areaPlayer and areaEnemy have an intersection.
 *
 * @param areaPlayer specification of an rectangle by upper lift an lower right corner.
 * @param areaEnemy specification of an rectangle by upper lift an lower right corner.
 */
Game.prototype.checkCollision = function(areaPlayer, areaEnemy) {

    var intersecting = this.isIntersecting(areaPlayer.p1, areaEnemy.p1, areaEnemy.p2) ||
        this.isIntersecting({x: areaPlayer.p1.x, y: areaPlayer.p2.y }, areaEnemy.p1, areaEnemy.p2) ||
        this.isIntersecting({x: areaPlayer.p2.x, y: areaPlayer.p1.y }, areaEnemy.p1, areaEnemy.p2) ||
        this.isIntersecting(areaPlayer.p2, areaEnemy.p1, areaEnemy.p2);

    if (intersecting) {
        statusLine = new StatusLine(C.strings.try);
        goalLine = new GoalLine(C.strings.lose);
    }

    return intersecting;
};

/**
 * Return true if the point point is within the area of a rectangle depict by the
 * upper left point 'upper' and the lower right point 'lower'.
 */
Game.prototype.isIntersecting = function(point, upper, lower) {
    return point.x >= upper.x && point.x <= lower.x
        && point.y >= upper.y && point.y <= lower.y
};

/***
 * Returns true if the row of the star is not occupied yet
 * .
 * @param star - a new star
 * @param allStars - array of all current stars
 * @returns {boolean} true if row of star is not occcupied jet.
 */
Game.prototype.isNewStar = function(star, allStars) {
    for (var i = 0; i < allStars.length; i++) {
        if (star.getRow() ===  allStars[i].getRow()) {
            return false;
        }
    }
    return true;
};

/**
 * Stops all enemies from moving.
 * @param allEnemies - array of Enemy's
 */
Game.prototype.stopEnemies = function (allEnemies) {
    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies[i].canMove(false);
    }
};

/**
 * Increases the step size of all enemies by a random value between 1 .. 20.
 */
Game.prototype.increaseStep = function(allEnemies) {
    for (var i = 0; i<allEnemies.length; i++) {
        allEnemies[i].increaseStep(Math.floor((Math.random() * 30) + 10));
    }
};

/**
 * Stops moving enemies and displays messages about winning the game and restart.
 */
Game.prototype.win = function() {
    game.stopEnemies(allEnemies);
    goalLine = new GoalLine(C.strings.win);
    statusLine = new StatusLine(C.strings.try);
};



/**
 * To draw a message at the bottem of the game board.
 * @param text - the text to display
 * @constructor
 */
var StatusLine = function (text) {
    this.text = text;
};

/**
 * Called  by the engine to display the content.
 */
StatusLine.prototype.render = function() {
    ctx.font="20px Verdana";
    ctx.strokeStyle = "green";
    ctx.strokeText(this.text, 40, 575);
    ctx.fillStyle = "red";
    ctx.fillText(this.text, 40, 575);
};



/**
 * To draw a message in the middle of the game board.
 * @param text - the text to display
 * @constructor
 */
var GoalLine = function (text) {
    this.text = text;
};

/**
 * Called  by the engine to display the text of the goal line.
 */
GoalLine.prototype.render = function() {
    ctx.font="32px Verdana";
    ctx.strokeStyle = "red";
    ctx.fillText(this.text, 40, 435);
};



/**
 * If the player reaches the top row a star will be displayed in the square at the current location.
 *
 * @param x coordinate where the star will be drawn.
 * @param y coordinate where the star will be drawn.
 */
var Star = function (x, y) {

    this.row = undefined;
    this.sprite = "images/Star.png";
    this.x =  this.center(x);
    this.y = y;

};

/**
 * The render function is called periodically by the engine to display the image of the object.
 */
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Returns the center of a column
 */
Star.prototype.center = function(xpos) {
    var r;
    if (xpos < 50) {
        r =   0;
        this.row = 0
    } else if (xpos< 150) {
        r = 100;
        this.row = 1
    } else if (xpos < 250) {
        r = 200;
        this.row = 2
    } else if (xpos < 350) {
        r = 300;
        this.row = 3
    } else {
        r = 400;
        this.row = 4
    }
    return r;
};

/**
 * Returns the row of the Star, the range is 0 .. 4.
 */
Star.prototype.getRow = function() {
    return this.row;
};
