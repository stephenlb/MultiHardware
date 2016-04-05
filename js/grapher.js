(function(){

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SVG GRAPHER
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var grapher = window.grapher = function(setup) {
    var canvas = document.getElementById(setup.svg||setup.id)||setup.elm;

    if (!canvas) return console.error( "Missing SVG Element", setup );

    var container = setup.todo          || null // TODO TODO TODO
    ,   margin    = setup.margin        || 0.00000001
    ,   rmargin   = setup.rmargin       || 15
    ,   center    = setup.center        || false
    ,   easing    = setup.easing        || 'linear'
    ,   classname = setup.classname     || 'grapher'
    ,   duration  = setup.duration      || 60
    ,   container = canvas.getBoundingClientRect() || {}
    ,   width     = container.width     || canvas.parentNode.offsetWidth
    ,   height    = container.height    || canvas.parentNode.offsetHeight
    ,   started   = +new Date()
    ,   ceiling   = 1
    ,   scale     = 1
    ,   group     = document.createElementNS(
        'http://www.w3.org/2000/svg', 'g'
    );

    // TODO container autocreate SVG Canvas Element.
    // TODO container autocreate SVG Canvas Element.
    // TODO container autocreate SVG Canvas Element.

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Rescale Graph to fit New Ceiling
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function rescale(value) {
        // Check if Scale Calculation is Required
        if (value <= ceiling) return;

        // Recalculate Scale to fit new Maxinum Graph Size
        ceiling = value;
        scale   = height / value;

        // Get All Lines on the SVG Canvas for Adjustment
        var lines = group.getElementsByTagName("line")
        ,   line  = 0;

        // Adjust All Graph Lines for New Scale
        for (;line < lines.length;line++) {
            adjust( lines[line], +lines[line].getAttribute('value') );
        }
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Adjust Line Value for Graph Size
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function adjust( line, value ) {
        var scaled   = value * scale
        ,   centered = height / 2 - scaled / 2
        ,   adjusted = height - scaled;

        if (center) {
            line.setAttribute( 'y1', centered < margin ? margin : centered );
            line.setAttribute( 'y2',
                centered + scaled + margin > height ?
                height - margin                     :
                centered + scaled
            );
        }
        else {
            if (adjusted > height - margin) adjusted = height - margin;
            if (adjusted <= margin)         adjusted = margin;
            line.setAttribute( 'y1', adjusted );
        }
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Append Data to the Graph
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function append(settings) {
        // Don't render on Non Visible Tab
        if (!vis()) return false;

        var value     = settings.value
        ,   cname     = settings.classname || classname
        ,   timedelta = (((+new Date - started) / 1000) / duration) + 1
        ,   line      = document.createElementNS(
            'http://www.w3.org/2000/svg', 'line'
        );

        // Recapture Width and Height (in case we resize)
        var container = canvas.getBoundingClientRect() || {}
        width  = (container.width||canvas.parentNode.offsetWidth)+rmargin;
        height = container.height||canvas.parentNode.offsetHeight;

        // Rescale if we Hit Ceiling
        rescale(settings.ceiling || value);

        // Save Basic Information
        line.setAttribute( 'value', value );
        line.setAttribute( 'class', cname );
        line.setAttribute( 'y2', height - margin );
        line.setAttribute( 'x1', width * timedelta );
        line.setAttribute( 'x2', width * timedelta );

        // Prepare and Adjust for Scaled Rendering and Centering
        adjust( line, value );

        // Plot and Render The Line
        group.appendChild(line);

        // Start End of Life Clock
        setTimeout( function() {
            group.removeChild(line);
            if (value >= ceiling) repeak();
        }, duration * 1100 );
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Recalculate Ceiling So When Peak Disappears on Graph
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function repeak() {
        var lines = group.getElementsByTagName("line")
        ,   line  = 0
        ,   value = 0
        ,   peak  = 0;

        // Reset Ceiling
        ceiling = 1;

        // Adjust All Graph Lines for New Scale
        for (;line < lines.length;line++) {
            value = +lines[line].getAttribute('value');
            if (value > peak) peak = value;
        }

        // Rescale Based on New Peak
        rescale(peak);
    }

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // Setup and Start Animation of Chart
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function chart_motion() {
        var tdet   = (((+new Date - started) / 1000) / duration) + 1
        ,   offset = (width*tdet);

        group.setAttribute( 'style', [
            'transition:all '                + duration + 's ' + easing,
            '-o-transition:all '             + duration + 's ' + easing,
            '-moz-transition:all '           + duration + 's ' + easing,
            '-webkit-transition:all '        + duration + 's ' + easing,
            'transform:translateX(-'         + offset + 'px)',
            '-o-transform:translateX(-'      + offset + 'px)',
            '-moz-transform:translateX(-'    + offset + 'px)',
            '-webkit-transform:translateX(-' + offset + 'px)'
        ].join(';') );
    }

    // Continuous Motion
    canvas.appendChild(group);
    setTimeout(  chart_motion, 50 );
    setInterval( chart_motion, duration * 500 );

    // Provide Manipulation Interface
    var self = function(){ return self };

    // Public Methods
    self.append = append;

    // Return API
    return self;
};

})();
