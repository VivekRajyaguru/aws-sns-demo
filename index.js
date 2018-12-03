var express = require('express');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

var app = express();

AWS.config.update({region: 'us-west-2'});

var sns = new AWS.SNS({apiVersion: '2010-03-31'});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())                                    
app.use(bodyParser.json({ type: 'application/json'}))  

app.get('/checkAttribute', (req, res) => {
    var params = {
        attributes: [
            'DefaultSMSType',
            'ATTRIBUTE_NAME'
        ]
    };
    sns.getSMSAttributes(params, (err, data) => {
        if(err) res.send(err);
        else res.send(data);
    });
});

app.post('/sendSMS', (req, res) => {
    var attributeParams = {
        attributes: {
            DefaultSMSType: req.body.smsType
        }
    };
    sns.setSMSAttributes(attributeParams, (err, data) => {
        if(err) res.send(err);
        else {
            var params = {
                Message: req.body.message,
                PhoneNumber: req.body.phoneNumber
            };
            sns.publish(params, (err, data) => {
                if(err) res.send(err);
                else res.send(data);
            });
        }
    });
    
});

var server = app.listen(8080, () => {});