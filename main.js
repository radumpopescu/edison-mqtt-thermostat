'use strict'
var Mqtt = require('./mqtt.js')

var subscriptions = [
    {
        "topic":"",
        "cb":setRelay
    }
];

var mqt = new Mqtt('', subscriptions);

function setRelay(message, topic){
    console.log("setting relay", message);
}