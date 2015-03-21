define(function() {
    var diceRegex = /^(\d*)[WwDd](\d+)([+-]\d*)?$/;
    var dice = {
        roll: function(pattern) {
            var result = diceRegex.exec(pattern);
            if (!result)
                throw "Could not parse statement";
            var diceCount = parseInt(result[1]) || 1;
            var diceSides = parseInt(result[2]);
            var modifier = parseInt(result[3]);

            if (diceCount < 0)
                throw "Dice count must be positive";
            if (diceSides < 0)
                throw "Dice sides must be positive";

            // console.log({
            //     count: diceCount,
            //     sides: diceSides,
            //     modifier: modifier
            // });
            var result = 0;
            for (var i = 0; i < diceCount; i++) {
                result += dice.rollDice(diceSides);
            };
            if (modifier)
                result += modifier;
            return result;
        },

        rollDice: function(sides) {
            return Math.floor(Math.random() * (sides) + 1);
        }
    };
    return dice;
});