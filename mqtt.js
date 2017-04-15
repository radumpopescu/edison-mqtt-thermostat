'use strict'
var mqtt = require('mqtt')

function Mqtt(host, user, pass, subscriptions){
    this.host = host;
    this.user = user;
    this.pass = pass;
    this.subscriptions = subscriptions;
    this.connect();
}

Mqtt.prototype.connect = function(){
    this.client = mqtt.connect(this.host, {
        username: this.user,
        password: this.pass
    });
    this.client.on('connect', () => {
        this.subscribe();

    })
    this.client.on('message', (topic, message) => {
        this.onMessage(topic, message)
    })
}  

Mqtt.prototype.subscribe = function() {
    this.subscriptions.forEach((el) => {
        this.client.subscribe(el.topic);
    })
};

Mqtt.prototype.publish = function(topic, message, opts, callback){
    this.client.publish(topic, message, opts, callback);
}

Mqtt.prototype.onMessage = function(topic, message){
    this.subscriptions.forEach(function(el){
        if (el.topic == topic){
            el.cb(message.toString(), topic);
        }
    });
}

module.exports = Mqtt