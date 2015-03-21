define(['PriorityQueue'], function(PriorityQueue) {
    return {
        pad: function(x, n) {
            var zeros = "0";
            while (zeros.length < n) zeros = "0" + zeros;
            return String(zeros + x).slice(-1 * n)
        },
        surroundingHexes: function(coordinates) {
            if ((coordinates.x - 1) % 2 == 0)
                return [{
                        x: coordinates.x - 1,
                        y: coordinates.y - 1
                    }, {
                        x: coordinates.x - 1,
                        y: coordinates.y
                    }, {
                        x: coordinates.x,
                        y: coordinates.y - 1
                    }, {
                        x: coordinates.x,
                        y: coordinates.y + 1
                    }, {
                        x: coordinates.x + 1,
                        y: coordinates.y - 1
                    }, {
                        x: coordinates.x + 1,
                        y: coordinates.y
                    }

                ];
            else
                return [{
                        x: coordinates.x - 1,
                        y: coordinates.y + 1
                    }, {
                        x: coordinates.x - 1,
                        y: coordinates.y
                    }, {
                        x: coordinates.x,
                        y: coordinates.y - 1
                    }, {
                        x: coordinates.x,
                        y: coordinates.y + 1
                    }, {
                        x: coordinates.x + 1,
                        y: coordinates.y + 1
                    }, {
                        x: coordinates.x + 1,
                        y: coordinates.y
                    }

                ];
        },
        getRouteToCoordinates: function(system, targetSystem, subsector) {

            var openList = new PriorityQueue({
                comparator: function(a, b) {
                    return a.f - b.f;
                }
            });

            openList.queue({
                system: system,
                coordinates: system.coordinates,
                f: 0
            });

            var closedList = [];

            while (openList.length > 0) {
                var current = openList.dequeue();

                if (current.coordinates == targetSystem.coordinates) {
                    var route = [];
                    var currentSystem = current;
                    route.push(currentSystem.coordinates);
                    while (currentSystem.source) {
                        currentSystem = currentSystem.source;
                        route.push(currentSystem.coordinates);
                    }
                    // console.log("route found");
                    return route;
                }

                _.each(current.system.neighbours, function(neighbour) {
                    var f = current.f + 1;
                    if (subsector) {
                        _.each(subsector.connections, function(connection) {
                            if ((connection.first == current.coordinates && connection.second == neighbour.coordinates) || (connection.second == current.coordinates && connection.first == neighbour.coordinates)) {
                                f = current.f + 0.2;
                            }
                        });
                    } else if (neighbour.planets[0].spacePort == "A") {
                        f = current.f + 0.7;
                    } else if (neighbour.planets[0].spacePort == "B") {
                        f = current.f + 0.8;
                    } else if (neighbour.planets[0].spacePort == "C") {
                        f = current.f + 0.9;
                    }
                    var inClosed = _.findWhere(closedList, {
                        coordinates: neighbour.coordinates
                    });
                    if (!inClosed) {
                        var newNode = {
                            system: neighbour,
                            coordinates: neighbour.coordinates,
                            source: current,
                            f: f
                        }
                        openList.queue(newNode);
                    }
                });

                closedList.push(current);
            }
        }
    };
});