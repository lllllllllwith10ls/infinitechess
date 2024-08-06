
/**
 * This script handles checkmate practice logic
 */

"use strict";

const checkmatepractice = (function() {

    const validCheckmates = [
        // easy
        "2Q-1k",
        "3R-1k",
        "2CH-1k",
        "1Q1CH-1k",
        "1K2R-1k",
        "1K2B2B-1k",
        "3B3B-1k",
        "1K1AM-1k",

        // medium
        "1K1Q1B-1k",
        "1K1Q1N-1k",
        "1Q1B1B-1k",
        "1Q2N-1k",
        "2R1N-1k",
        "1K1R1B1B-1k",
        "1K1AR1R-1k",
        "2AM-1rc",

        // hard
        "1K1N2B1B-1k",
        "1K2N1B1B-1k",
        "1K1R1N1B-1k",
        "1K1R2N-1k",
        "2K1R-1k",
        "1K2AR-1k",
        "1K2N7B-1k",

        // insane
        "1K3NR-1k",
        "1K1Q1P-1k",
        "1K3HA-1k",
    ];

    /**
     * This method generates a random starting position object for a given checkmate practice ID
     * @param {string} checkmateID - a string containing the ID of the selected checkmate practice problem
     * @returns a starting position object corresponding to that ID
     */
    function generateCheckmateStartingPosition(checkmateID){
        // error if user somehow submitted invalid checkmate ID
        if (!validCheckmates.includes(checkmateID)) return console.error("User tried to play invalid checkmate practice.");

        let startingPosition = {}; // the position to be generated
        let blackpieceplaced = false; // monitors if a black piece has already been placed
        let whitebishopparity = Math.floor(Math.random() * 2); // square color of first white bishop batch
        
        // read the elementID and convert it to a position
        const piecelist = checkmateID.match(/[0-9]+[a-zA-Z]+/g);
        for (let entry of piecelist) {
            let amount = entry.match(/[0-9]+/)[0]; // number of pieces to be placed
            let piece = entry.match(/[a-zA-Z]+/)[0]; // piecetype to be placed
            piece = formatconverter.ShortToLong_Piece(piece);

            // place amount many pieces of type piece
            while (amount != 0) {
                if (math.getPieceColorFromType(piece) === "white") {
                    if (blackpieceplaced) return console.error("Must place all white pieces before placing black pieces.");

                    // randomly generate white piece coordinates near origin in square from -5 to 5
                    const x = Math.floor(Math.random() * 11) - 5;
                    const y = Math.floor(Math.random() * 11) - 5;
                    const key = math.getKeyFromCoords([x,y]);

                    // check if square is occupied and white bishop parity is fulfilled
                    if (!(key in startingPosition) && !(piece == "bishopsW" && (x + y)%2 != whitebishopparity)) {
                        startingPosition[key] = piece;
                        amount -= 1;
                    }
                } else {
                    // randomly generate black piece coordinates at a distance
                    const x = Math.floor(Math.random() * 3) + 12;
                    const y = Math.floor(Math.random() * 35) - 17;
                    const key = math.getKeyFromCoords([x,y]);
                    // check if square is occupied or potentially threatened
                    if (!(key in startingPosition) && squareNotInSight(key, startingPosition)) {
                        startingPosition[key] = piece;
                        amount -= 1;
                        blackpieceplaced = true;
                    }
                }
            }

            // flip white bishop parity
            whitebishopparity = 1 - whitebishopparity;
        }

        return startingPosition;
    }

    /**
     * This method checks that the input square is not on the same row, column or diagonal as any key in the startingPosition object
     * It also checks that it is not attacked by a knightrider
     * @param {string} square - square of black piece
     * @param {Object} startingPosition - startingPosition JSON containing all white pieces
     * @returns {boolean} true or false, depending on if the square is in sight or not
     */
    function squareNotInSight(square, startingPosition) {
        const [sx,sy] = math.getCoordsFromKey(square);
        for (let key in startingPosition){
            const [x,y] = math.getCoordsFromKey(key);
            if (x == sx || y == sy || Math.abs(sx - x) == Math.abs(sy - y)) return false;
            if (startingPosition[key] === "knightridersW"){
                if (Math.abs(sx-2*x) == Math.abs(sy - 2*y) || Math.abs(2*sx-x) == Math.abs(2*sy - y) ||
                    Math.abs(sx-2*x) == Math.abs(2*sy - y) || Math.abs(2*sx-x) == Math.abs(sy - 2*y)) {
                        return false;
                    }
            }
        }
        return true;
    }

    return Object.freeze({
        generateCheckmateStartingPosition,
    })
})()