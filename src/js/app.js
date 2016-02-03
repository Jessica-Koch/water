'use strict';

var getXMLRequest = function(urlExt) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/' + urlExt;
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function() {        
            if (xhr.status == 200) {
                resolve(xhr.response); 
            } else {
                reject(Error(xhr.statusText)); 
            }
        };
        xhr.onerror = function() {
            reject(Error('Network Error')); 
        };
        xhr.send(); 
    });
};

var baseURL = 'https://api.rach.io/1/public/';
var userKey = sessionStorage.getItem('userKey');

var putXMLRequest = function(url, data) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', baseURL + url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + userKey);

        xhr.onload = function(xReqst) {  
            resolve(xhr.response);   
        };
        xhr.onerror = function() {
            resolve(xhr.response);
        };
            
        xhr.send(JSON.stringify(data)); 
    });
};

var api = {
    getApiKey: function() {
        var form = document.querySelector('form');
        form.addEventListener('submit', function(evnt){
            var userKey = form.elements.key.value;
            sessionStorage.setItem('userKey', userKey);
            sessionStorage.getItem('userKey');
            return false;
        });
    },
    allOff: function(deviceID){
        putXMLRequest('device/stop_water', {'id': deviceID}).then(
            function(response){
                console.log(response);
            }, function(errorResponse) {
                console.log(errorResponse);
        });
    },
    waterZone: function(zoneId) {
        putXMLRequest('zone/start', {'id': zoneId, 'duration': 100}).then(function(response){
            console.log(response + ' on');
        }, function(errorResponse){
            console.log(errorResponse);
        });
    }

};