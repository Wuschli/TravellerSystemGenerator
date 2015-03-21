define(['scripts/planet'], function(Planet) {
    return function(x, y) {
        this.coordinates = {
            x: x,
            y: y
        };
        this.neighbours = [];
        this.planets = [];

        var planet = new Planet(this.coordinates);
        this.planets.push(planet);

    };
});