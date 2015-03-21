define(['scripts/dice', 'scripts/utility', 'underscore'], function(dice, utils, _) {
    return function(coordinates) {

        var self = this;

        this.name = "Long Name";
        this.coordinates = coordinates;
        this.spaceport = "X";
        this.size = 0;
        this.atmosphere = 0;
        this.hydrography = 0;
        this.population = 0;
        this.government = 0;
        this.lawLevel = 0;
        this.techlevel = 0;
        this.bases = [];
        this.tradingCodes = [];
        this.travelzone = "";
        this.temperature = "";
        this.worldProfile = "";

        var rollSize = function() {
            return dice.roll("2W6-2");
        };

        var rollAtmosphere = function(size) {
            var atmosphere = dice.roll("2W6-7") + size;
            if (atmosphere < 0)
                atmosphere = 0;
            return atmosphere;
        };

        var rollTemperature = function(atmosphere) {
            var roll = dice.roll("2W6");
            switch (atmosphere) {
                case 2:
                case 3:
                    roll -= 2;
                    break;
                case 4:
                case 5:
                case 14:
                    roll -= 1;
                    break;
                case 8:
                case 9:
                    roll += 1;
                    break;
                case 10:
                case 13:
                case 15:
                    roll += 2;
                    break;
                case 11:
                case 12:
                    roll += 6;
                    break;
            }

            if (roll <= 2)
                return "frozen";
            else if (roll <= 4)
                return "cold";
            else if (roll <= 9)
                return "moderate";
            else if (roll <= 11)
                return "hot";
            else
                return "burning";
        };

        var rollHydrography = function(size, atmosphere, temperature) {
            var roll = dice.roll("2w6-7");
            roll += size;

            if (size <= 1)
                return 0;

            if (atmosphere <= 1 || atmosphere == 10 || atmosphere == 11 || atmosphere == 12)
                roll -= 4;
            if (atmosphere != 13) {
                if (temperature == "hot")
                    roll -= 2;
                else if (temperature == "burning")
                    roll -= 6;
            }
            if (roll < 0)
                roll = 0;
            return roll;
        }

        var rollPopulation = function() {
            return dice.roll("2w6-2");
        }

        var rollGovernment = function(population) {
            var roll = dice.roll("2W6-7");
            roll += population;
            if (roll < 0)
                roll = 0;
            return roll;
        }

        var rollLawLevel = function(government) {
            var roll = dice.roll("2W6-7");
            roll += government;
            if (roll < 0)
                roll = 0;
            return roll;
        }

        var rollSpacePort = function() {
            var roll = dice.roll("2W6");
            if (roll <= 2)
                return "X";
            if (roll == 3 || roll == 4)
                return "E";
            if (roll == 5 || roll == 6)
                return "D";
            if (roll == 7 || roll == 8)
                return "C";
            if (roll == 9 || roll == 10)
                return "B";
            return "A";
        }

        var rollTechLevel = function(spaceport, size, atmosphere, hydrography, population, government) {
            var roll = dice.roll("1W6");

            switch (spaceport) {
                case "X":
                    roll -= 4;
                    break;
                case "A":
                    roll += 6;
                    break;
                case "B":
                    roll += 4;
                    break;
                case "C":
                    roll += 2;
                    break;
            }

            if (size <= 1)
                roll += 2;
            else if (size <= 4)
                roll += 4;

            if (atmosphere <= 3 || atmosphere >= 10)
                roll += 1;

            if (hydrography == 0 || hydrography == 9)
                roll += 1;
            else if (hydrography == 10)
                roll += 2;

            if ((population <= 5 && population > 0) || population == 9)
                roll += 1;
            else if (population == 10)
                roll += 2;
            else if (population == 11)
                roll += 3;
            else if (population == 12)
                roll += 4;

            if (government == 0 || government == 5)
                roll += 1;
            else if (government == 7)
                roll += 2;
            else if (government == 13 || government == 14)
                roll -= 2;

            return roll;
        }

        var rollTravelZone = function(atmosphere, government, lawLevel) {

            if (atmosphere >= 10 || government == 0 || government == 7 || government == 10 || lawLevel == 0 || lawLevel >= 9)
                if (dice.roll("W6") > 4)
                    return "Y";
            if (dice.roll("W100") > 99)
                return "R";
            return "";
        }

        var rollBases = function(spaceport) {
            var result = [];
            switch (spaceport) {
                case "A":
                    if (dice.roll("2W6") >= 8)
                        result.push("M");
                    if (dice.roll("2W6") >= 10)
                        result.push("S");
                    if (dice.roll("2W6") >= 8)
                        result.push("R");
                    if (dice.roll("2W6") >= 4)
                        result.push("TAS");
                    if (dice.roll("2W6") >= 6)
                        result.push("IC");
                    break;
                case "B":
                    if (dice.roll("2W6") >= 8)
                        result.push("M");
                    if (dice.roll("2W6") >= 8)
                        result.push("S");
                    if (dice.roll("2W6") >= 10)
                        result.push("R");
                    if (dice.roll("2W6") >= 6)
                        result.push("TAS");
                    if (dice.roll("2W6") >= 8)
                        result.push("IC");
                    if (dice.roll("2W6") >= 12)
                        result.push("P");
                    break;
                case "C":
                    if (dice.roll("2W6") >= 8)
                        result.push("S");
                    if (dice.roll("2W6") >= 10)
                        result.push("R");
                    if (dice.roll("2W6") >= 10)
                        result.push("TAS");
                    if (dice.roll("2W6") >= 10)
                        result.push("IC");
                    if (dice.roll("2W6") >= 10)
                        result.push("P");
                    break;
                case "D":
                    if (dice.roll("2W6") >= 7)
                        result.push("S");
                    if (dice.roll("2W6") >= 12)
                        result.push("P");
                    break;
                case "E":
                    if (dice.roll("2W6") >= 12)
                        result.push("P");
                    break;
            }
            return result;
        }

        var calcWorldProfile = function() {
            var result = self.name;
            result += "  " + utils.pad(self.coordinates.x, 2) + utils.pad(self.coordinates.y, 2) + " ";
            result += self.spaceport;
            result += self.size.toString(32).toUpperCase();
            result += self.atmosphere.toString(32).toUpperCase();
            result += self.hydrography.toString(32).toUpperCase();
            result += self.population.toString(32).toUpperCase();
            result += self.government.toString(32).toUpperCase();
            result += self.lawLevel.toString(32).toUpperCase();
            result += "-" + self.techlevel.toString(32).toUpperCase();
            if (self.bases.length > 0)
                result += "  " + self.bases.join(" ");
            if (self.travelzone != "")
                result += "  " + self.travelzone;
            return result;
        }

        var calcTradingCodes = function() {
            var result = [];

            if (self.atmosphere >= 4 && self.atmosphere <= 9 && self.hydrography >= 4 && self.hydrography <= 8 && self.population >= 5 && self.population <= 7)
                result.push("Ag");

            if (self.size == 0 && self.atmosphere == 0 && self.hydrography == 0)
                result.push("As");

            if (self.population == 0 && self.government == 0 && self.lawLevel == 0)
                result.push("Öd");

            if (self.atmosphere >= 2 && self.hydrography == 0)
                result.push("Wü");

            if (self.atmosphere >= 10 && self.hydrography >= 1)
                result.push("Li");

            if (self.size >= 5 && self.atmosphere >= 4 && self.atmosphere <= 9 && self.hydrography >= 4 && self.hydrography <= 8)
                result.push("Ga");

            if (self.population >= 9)
                result.push("Di");

            if (self.techlevel >= 12)
                result.push("Hi");

            if (self.atmosphere >= 0 && self.atmosphere <= 1 && self.hydrography >= 1)
                result.push("Ei");

            if (_.contains([0, 1, 2, 4, 7, 9], self.atmosphere) && self.population >= 9)
                result.push("In");

            if (self.population >= 1 && self.population <= 3)
                result.push("Dü");

            if (self.techlevel <= 5)
                result.push("Lo");

            if (self.atmosphere >= 0 && self.atmosphere <= 3 && self.hydrography >= 0 && self.hydrography <= 3 && self.population >= 6)
                result.push("Na");

            if (self.population >= 4 && self.population <= 6)
                result.push("Ni");

            if (self.atmosphere >= 2 && self.atmosphere <= 5 && self.hydrography >= 0 && self.hydrography <= 3)
                result.push("Ar");

            if (_.contains([6, 8], self.atmosphere) && self.population >= 6 && self.population <= 8)
                result.push("Re");

            if (self.hydrography == 10)
                result.push("Wa");

            if (self.atmosphere == 0)
                result.push("Va");

            return result;
        }

        this.size = rollSize();
        this.atmosphere = rollAtmosphere(this.size);
        this.temperature = rollTemperature(this.atmosphere);
        this.hydrography = rollHydrography(this.size, this.atmosphere, this.temperature);
        this.population = rollPopulation();
        this.government = rollGovernment(this.population);
        this.lawLevel = rollLawLevel(this.government);
        this.spaceport = rollSpacePort();
        this.techlevel = rollTechLevel(this.spaceport, this.size, this.atmosphere, this.hydrography, this.population, this.government);
        this.bases = rollBases(this.spaceport);
        this.travelzone = rollTravelZone(this.atmosphere, this.government, this.lawLevel);
        this.worldProfile = calcWorldProfile();
        this.tradingCodes = calcTradingCodes();
    };
});