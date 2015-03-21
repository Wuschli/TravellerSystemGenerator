define(['scripts/utility', 'underscore', 'scripts/dice'], function(utils, _, dice) {

    var defaultOptions = {
        drawBases: true,
        drawTravelZones: true,
        drawNames: true,
        drawSpacePorts: true,
        drawGrid: true,
        drawCommunicationRoutes: true
    };

    var defaultStyle = {
        backgroundColor: 'black',
        travelZoneYStroke: 'rgba(255, 225, 0, 0.4)',
        travelZoneRStroke: 'rgba(255, 0, 0, 0.4)',
        travelZoneRFill: 'rgba(255, 122, 122, 0.4)',
        gridColor: "#333",
        gridTextColor: '#555',
        gridTextFont: "italic bold 8pt Helvetica",
        labelColor: "#fff",
        labelFont: "bold 10pt Helvetica",
        communicationRouteStroke: 'rgba(255, 0, 0, 0.3)',
        communicationRouteStrokeWidth: 7,
    };

    var getHexCoords = function(x, y, hexHeight, hexRadius) {
        return {
            x: x * hexRadius * 1.5,
            y: y * hexHeight + ((x - 1) % 2 * hexHeight / 2),
        };
    };

    var drawHex = function(context, x, y, radius) {

        var innerRadius = (Math.sqrt(3) / 2) * radius;

        context.beginPath();
        context.moveTo(x - radius, y);
        context.lineTo(x - radius / 2, y - innerRadius);
        context.lineTo(x + radius / 2, y - innerRadius);
        context.lineTo(x + radius, y);
        context.lineTo(x + radius / 2, y + innerRadius);
        context.lineTo(x - radius / 2, y + innerRadius);
        context.closePath();
        context.stroke();
    };

    var drawHexfield = function(context, hexRadius, style) {
        style = _.defaults(style, defaultStyle);

        var hexHeight = Math.sqrt(3) * hexRadius;
        var hexWidth = hexRadius * 2;

        context.strokeStyle = style.gridColor;

        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 10; j++) {
                var coords = getHexCoords(i, j, hexHeight, hexRadius);
                drawHex(context, coords.x, coords.y, hexRadius);


                context.fillStyle = style.gridTextColor;
                context.textAlign = 'center';
                context.textBaseline = 'hanging';
                context.font = style.gridTextFont;
                context.fillText(utils.pad(j, 2) + utils.pad(i, 2), coords.x, coords.y - hexHeight * 0.45);
            }
        }
    };

    var drawSubsector = function(context, subsector, hexRadius, options, style) {
        context.setTransform(1, 0, 0, 1, 0, 0);

        options = _.defaults(options, defaultOptions);
        style = _.defaults(style, defaultStyle);

        var hexHeight = Math.sqrt(3) * hexRadius;
        var hexWidth = hexRadius * 2;

        //clear Canvas
        context.beginPath();
        context.rect(0, 0, (8 + 1) * 1.5 * hexRadius, (10 + 1) * hexHeight);
        context.fillStyle = style.backgroundColor;
        context.fill();

        //offset
        //context.translate(hexRadius * 1.5, hexHeight * 1.5 / 2);
        context.translate(0, -hexHeight / 4);


        if (options.drawGrid) {
            drawHexfield(context, hexRadius, style);
        }

        //draw Communication routes
        if (options.drawCommunicationRoutes) {
            _.each(subsector.connections, function(connection) {
                console.log("draw connection");
                context.beginPath();
                context.lineWidth = style.communicationRouteStrokeWidth;
                context.strokeStyle = style.communicationRouteStroke;
                var hexCoords = getHexCoords(connection.first.x, connection.first.y, hexHeight, hexRadius);
                context.moveTo(hexCoords.x, hexCoords.y);
                hexCoords = getHexCoords(connection.second.x, connection.second.y, hexHeight, hexRadius);
                context.lineTo(hexCoords.x, hexCoords.y);
                context.stroke();
            });
        }

        for (var i = subsector.systems.length - 1; i >= 0; i--) {
            var system = subsector.systems[i];
            var coords = getHexCoords(system.coordinates.x, system.coordinates.y, hexHeight, hexRadius);

            //draw Travelzone
            if (options.drawTravelZones) {
                if (system.planets[0].travelzone != "") {
                    context.beginPath();

                    if (system.planets[0].travelzone == "Y") {
                        context.strokeStyle = style.travelZoneYStroke;
                    } else if (system.planets[0].travelzone == "R") {
                        context.strokeStyle = style.travelZoneRStroke;
                        context.fillStyle = style.travelZoneRFill;
                    }

                    context.lineWidth = 2;
                    context.arc(coords.x, coords.y, hexRadius * 0.65, 0, 2 * Math.PI, false);


                    if (system.planets[0].travelzone == "R") {
                        context.fill();
                    }
                    context.stroke();
                }
            }

            //draw SpacePort
            if (options.drawSpacePorts) {
                context.fillStyle = style.labelColor;
                context.strokeStyle = style.backgroundColor;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = style.labelFont;
                context.strokeText(system.planets[0].spaceport, coords.x, coords.y - hexHeight * 0.2);
                context.fillText(system.planets[0].spaceport, coords.x, coords.y - hexHeight * 0.2);
            }

            //draw Bases
            if (options.drawBases) {
                var bases = system.planets[0].bases;
                var baseCount = bases.length;
                context.fillStyle = style.labelColor;
                context.strokeStyle = style.backgroundColor;

                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = "9pt FontAwesome";
                for (var j = bases.length - 1; j >= 0; j--) {
                    var icon = bases[j];
                    switch (bases[j]) {
                        case "M":
                            icon = "\uf005";
                            break;
                        case "S":
                            icon = "\uf14e";
                            break;
                        case "R":
                            icon = "\uf0c3";
                            break;
                        case "TAS":
                            icon = "\uf185";
                            break;
                        case "IC":
                            icon = "\uf04d";
                            break;
                        case "P":
                            icon = "\uf071";
                            break;
                    }

                    if (icon != "") {
                        var angle = Math.PI / 2 / (baseCount) * (j + 1);
                        var x = coords.x - Math.sin(angle) * hexRadius * 0.65;
                        var y = coords.y - Math.cos(angle) * hexRadius * 0.65;
                        context.strokeText(icon, x, y);
                        context.fillText(icon, x, y);
                    }
                };
            }

            //draw Name
            if (options.drawNames) {
                context.fillStyle = style.labelColor;
                context.drawStyle = style.backgroundColor;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = style.labelFont;
                context.strokeText(system.planets[0].name, coords.x, coords.y + hexHeight * 0.2);
                context.fillText(system.planets[0].name, coords.x, coords.y + hexHeight * 0.2);
            }

            //draw Star
            context.beginPath();
            var grd = context.createRadialGradient(coords.x, coords.y, 0, coords.x, coords.y, hexRadius * 0.3);
            grd.addColorStop(0, 'rgba(255,255,255,1)');
            grd.addColorStop(0.1, 'rgba(255,255,255,1)');
            grd.addColorStop(0.2, 'rgba(140,140,255,0.4)');
            grd.addColorStop(1, 'rgba(140,140,255,0');
            context.fillStyle = grd;
            context.lineWidth = 1;
            context.arc(coords.x, coords.y, hexRadius / 6, 0, 2 * Math.PI, false);
            context.fill();
        }
    }

    return {

        getHexCoords: getHexCoords,
        drawHex: drawHex,
        drawHexfield: drawHexfield,
        drawSubsector: drawSubsector
    };
});