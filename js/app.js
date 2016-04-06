(function(){

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Sensor Data Feed
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var sensordata    = [];
var sensordefault = 41.5;

subscribe({
    //pub-c-6dbe7bfd-6408-430a-add4-85cdfe856b47
    subkey    : 'sub-c-2a73818c-d2d3-11e3-9244-02ee2ddab7fe'
,   channel   : 'humeon'
,   timetoken : 1
,   message   : sensorfeed
});

function sensorfeed(response) {
    response.m.forEach(function(m){
        sensordata.push(m.d.columns[0][1]);
        console.log(sensordata,m.d.columns[0][1]);
    });
}

function getsensordata() {
    return sensordata.length && sensordata.shift() || sensordefault;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SVG Graph
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var sensorgraph = grapher({
    svg      : 'sensor'
,   margin   : 0.00001
,   easing   : 'linear'
,   duration : 30
,   rmargin  : 3
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Demo Jazzhands
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
setInterval( function() {
    var val = getsensordata();
    sensorgraph.append({ classname : 'sensor-shadow', value : val * 1.4 });
    sensorgraph.append({ classname : 'sensor',        value : val       });
}, 1000 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Utility Methods
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function now(noms) { return Math.ceil(+new Date / (noms?1000:1)) }
function $(id)     { return document.getElementById(id)          }

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Supplant
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var REPL = /{([\w\-]+)}/g;
function supplant( str, values ) {
    return str.replace( REPL, function( _, match ) {
        return values[match] || _
    } );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Bind
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function bind( type, el, fun ) {
    type.split(',').forEach(function(etype){
        var rapfun = function(e) {
            if (!e) e = window.event;
            if (!fun(e)) {
                e.cancelBubble = true;
                e.preventDefault  && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
            }
        };

        if ( el.addEventListener ) el.addEventListener( etype, rapfun, false );
        else if ( el.attachEvent ) el.attachEvent( 'on' + etype, rapfun );
        else  el[ 'on' + etype ] = rapfun;
    });
}



})();
