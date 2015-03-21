requirejs.config({
    baseUrl: './',
    paths: {
        'jquery': 'components/jquery/jquery',
        'chart': 'components/chartjs/Chart',
        'underscore': 'components/underscore/underscore',
        'PriorityQueue': 'components/js-priority-queue/js/PriorityQueue',
        // 'priority-queue': 'PriorityQueue'
    },
    shim: {
        'chart': {
            'exports': 'Chart'
        },
        'underscore': {
            'exports': '_'
        }
    }
});


require(['jquery', 'scripts/rendering', 'scripts/subsector'], function($, rendering, Subsector) {
    $(function() {
        var hexRadius = 60;
        var hexHeight = Math.sqrt(3) * hexRadius;
        var canvas = $("#mainCanvas")[0];
        canvas.width = (8 + 1) * 1.5 * hexRadius;
        canvas.height = (10 + 1) * hexHeight;
        var context = canvas.getContext('2d');
        var subsector = new Subsector();
        //console.log(subsector);

        var options = {};
        var style = {};

        rendering.drawSubsector(context, subsector, hexRadius, options, style);

        $(':checkbox').change(function() {
            options.drawBases = $('#displayBases').prop('checked');
            options.drawTravelZones = $('#displayTravelZones').prop('checked');
            options.drawNames = $('#displayNames').prop('checked');
            options.drawSpacePorts = $('#displaySpacePorts').prop('checked');
            options.drawGrid = $('#displayGrid').prop('checked');
            options.drawCommunicationRoutes = $('#displayCommRoutes').prop('checked');

            // context.setTransform(1, 0, 0, 1, 0, 0);
            // context.clearRect(0, 0, (8 + 1) * 1.5 * hexRadius, (10 + 1) * hexHeight);
            rendering.drawSubsector(context, subsector, hexRadius, options, style);
        });


        $('#saveMap').attr("href", canvas.toDataURL("image/png;base64"));

    });
});