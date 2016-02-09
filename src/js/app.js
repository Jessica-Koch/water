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
        },
        // '{ "zones" : [{ "id" : "d8913f51-3af5-41e8-b526-7c2da3646309", "duration" : 10, "sortOrder" : 1 }] }'
        waterMultipleZones: function(zones) {
            var checkBoxes = document.getElementsByName('zoneCheckbox');
            var z = [];
            var checkedZones = [];
            for(var i = 0; i < checkBoxes.length; i++) {
                if(checkBoxes[i].checked) {
                    checkedZones.push(checkBoxes[i].id);
                }
            }
            checkedZones.z = checkedZones;
            for(var i =0; i < checkedZones.length; i++) {
                z.push({id: checkedZones[i], duration: 100, sortOrder: 1});
            }
            var zones = JSON.stringify(z);
            putXMLRequest('zone/start_multiple', {'zones': JSON.parse(zones) }).then(function(response){
                console.log(response);
            }, function(errorResponse){
                console.log(errorResponse);
            });
        }

    };