(function(){

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Configuration
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var pubkey = 'pub-c-6dbe7bfd-6408-430a-add4-85cdfe856b47';
var subkey = 'sub-c-2a73818c-d2d3-11e3-9244-02ee2ddab7fe';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Command and Control
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
subscribe({
    subkey    : subkey
,   channel   : 'command'
,   timetoken : 1
,   timeout   : 300000
,   message   : command
});

function command(response) {
    response.m.forEach(function(m){
        var message = m.d;
        console.log(m,message);

        if (message.type == "grant")
            $("request-access").style.display = 'none';
        if (message.type == "revoke")
            $("request-access").style.display = 'block';
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Sensor Data Feed
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var sensordata    = [];
var sensordefault = 41.5;

subscribe({
    subkey    : subkey
,   channel   : 'humeon'
,   timetoken : 1
,   timeout   : 5000
,   message   : sensorfeed
});

function sensorfeed(response) {
    response.m.forEach(function(m){
        sensordata.push(m.d.columns[0][1]);
        console.log(sensordata,m.d.columns[0][1]);
    });
}

function getsensordata() {
    return sensordata.length && sensordata.pop() || sensordefault;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Monitor Connection Status
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var con_count = 0;
var con_max   = 20;

setInterval( function() {
    !sensordata.length ?
        (con_count < con_max && con_count++) :
        (con_count > 0       && (con_count = 0));

    if (con_count == con_max) $('status-display').className = 'status-alert';
    if (con_count == 0)       $('status-display').className = ' ';

    console.log(con_count);
}, 250 );

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
