var five = require("johnny-five");
var Edison = require("edison-io");

function Grove(thermoCB){
    this.board = board = new five.Board({
        io: new Edison(),
        repl:false
    });
    this.thermoCB = thermoCB;
    this.board.on("ready", ()=>{
        this.onReady();
    });
}

Grove.prototype.onReady = function(){
    var thermometer = new five.Thermometer({
        controller: "LM35",
        pin: "A0"
    });
    var that = this;
    thermometer.on("change", function(){
        that.thermoCB({"temp": this.celsius/10});
    });
}

Grove.prototype.switchRelay = function(pin, status){
    var relay = new five.Relay(pin);
    if (status){
        relay.on();
    }
    else{
        relay.off();
    }
}

module.exports = Grove

