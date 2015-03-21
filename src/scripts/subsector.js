define(['scripts/system', 'scripts/dice', 'scripts/utility'], function(System, dice, utils) {
    return function() {
        var self = this;
        this.systems = [];

        this.getSystemByCoordinates = function(coordinates) {
            for (var i = 0; i < self.systems.length; i++) {
                if (self.systems[i].coordinates.x == coordinates.x && self.systems[i].coordinates.y == coordinates.y)
                    return self.systems[i];
            }
        }

        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 10; j++) {
                if (dice.roll("W6") > 3) {
                    var system = new System(i, j);
                    this.systems.push(system);
                }
            }
        }

        _.each(this.systems, function(system) {
            _.each(utils.surroundingHexes(system.coordinates), function(coordinates) {
                var other = self.getSystemByCoordinates(coordinates);
                if (other)
                    system.neighbours.push(other);
            });
        });

        this.connections = [];

        _.each(self.systems, function(system) {
            if (system.planets[0].spacePort != "A" && !_.contains(system.planets[0].bases, "IC") && !_.contains(system.planets[0].bases, "M"))
                return;
            _.each(self.systems, function(other) {
                if (other.coordinates == system.coordinates)
                    return;
                if (other.planets[0].spacePort != "A" && !_.contains(other.planets[0].bases, "IC") && !_.contains(other.planets[0].bases, "M"))
                    return;
                var route = utils.getRouteToCoordinates(system, other, self);
                if (route) {
                    for (var i = 0; i < route.length - 1; i++) {
                        var contained = false;
                        _.each(self.connections, function(connection) {
                            if (connection.first.x == route[i].x && connection.first.y == route[i].y && connection.second.x == route[i + 1].x && connection.second.y == route[i + 1].y)
                                contained = true;
                            else if (connection.first.x == route[i + 1].x && connection.first.y == route[i + 1].y && connection.second.x == route[i].x && connection.second.y == route[i].y)
                                contained = true;
                        });
                        if (!contained) {
                            self.connections.push({
                                first: route[i],
                                second: route[i + 1]
                            });
                        }
                    };
                }
            });
        });
        console.log(self.connections);
    };
});