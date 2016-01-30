/**
 *
 * Common constants
 */
var C = {

    // Size of the board
    MIN_X:   0,
    MIN_Y:   0,
    MAX_X: 400,
    MAX_Y: 400,

    // Step size
    X_STEP: 100,
    Y_STEP:  80,

    /**
     * Output strings
     */
    strings: {
            "luck": "Good Luck!",
            "move": "Move with the cursor keys.",
            "movon": "You Better Move On!",
            "win": "Congratulaitons you win!",
            "lose": "You lose!",
            "try": "Click on first player to try again."
    },

    /**
     * For debugging only, draws a rectangle around enemies and player to
     * display the area verified for a collision.
     */
    drawCollisionArea: false

};
