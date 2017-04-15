'use strict'
var Mqtt = require('./mqtt.js')
var Grove = require('./grove.js')
var config = require('./config')

var subscriptions = [
    {
        "topic": config.relay_topic,
        "cb": onRelayMessage
    }
];
var mqt = new Mqtt(config.mqtt_host, config.mqtt_user, config.mqtt_pass, subscriptions);
var grove = new Grove(thermoCallback);

var lastTempReport = {
    "time": Date.now(),
    "averageTemp": 0,
    "number": 0
}
var lastReported = 99;

function thermoCallback(data){
    if (Date.now() - lastTempReport.time > config.average_temp_seconds * 1000){
        var temp = lastTempReport.averageTemp.toFixed(2);
        if (Math.abs(temp - lastReported) > config.minimum_temp_difference){
            mqt.publish(config.temp_topic, temp);
            lastReported = temp;
        }
        
        lastTempReport = {
            "time": Date.now(),
            "averageTemp": 0,
            "number": 0
        }
    }
    else{
        lastTempReport.averageTemp = (lastTempReport.averageTemp * lastTempReport.number + data.temp) / ++lastTempReport.number;
    }
}

function onRelayMessage(message, topic){
    if (message == config.relay_on_message){
        grove.switchRelay(config.relay_port, true);
    }
    else{
        grove.switchRelay(config.relay_port, false);   
    }
}
