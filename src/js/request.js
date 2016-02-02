'use strict';

var getApiKey = (function() {
    var form = document.querySelector('form');
    form.addEventListener('submit', function(evnt){
        var userKey = form.elements.key.value;
        sessionStorage.setItem('userKey', userKey);
        var key = sessionStorage.getItem('userKey');
        return false;
    });
});

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

var turnOff = function(device) {
    var device = JSON.parse(localStorage.getItem('device'));
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water',
            json_data = JSON.stringify({'id': device.id});
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function() {        
            if (xhr.status == 204) {
                resolve(xhr.response); 
                var ref = device.zones;
                var results = [];
                for (var i = 0, len = ref.length; i < len; i++) {
                    var zone = ref[i];
                    results.push(zone.running = false);
                }
                console.log(results);
                return results;
            } else {
                reject(Error(xhr.statusText)); 
            }
        };
        xhr.onerror = function() {
            reject(Error('Network Error')); 
        };
        xhr.send(json_data); 
    });
};

function allOff(device) {
    var device = JSON.parse(localStorage.getItem('device'));
    var selectAllButton = document.querySelector('#disableAllZonesButton');
    var deviceID = device.id;
    selectAllButton.addEventListener('click', allOff);
    new Promise(function(resolve, reject){
        var json_data = JSON.stringify({id: deviceID});
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water';
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function(){
            if (xhr.status === 204) {
                var ref = device.zones;
                var results = [];
                for (var i = 0, len = ref.length; i < len; i++) {
                    var zone = ref[i];
                    results.push(zone.running = false);
                }
            } else {
                reject(Error(xhr.statusText));
            }
            console.log('stop all water request gave response ' + xhr.status + ', data ' + json_data);
        };
        xhr.send(json_data);
    });
}

// function getId(event){
//     alert(event.target.id);
// }

function turnON(evt){
    var device = JSON.parse(localStorage.getItem('device'));
    var zones = device.zones.sort(function(a,b){
        return a.zoneNumber - b.zoneNumber;
    });
    var zoneId = evt.target.id;

    new Promise(function(resolve, reject){
        console.log(zones);
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/zone/start';
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        // console.log(zones[]);
        var json_data = JSON.stringify({'id': zoneId, 'duration': 100});
        xhr.onload = function(xReqst) {  
            console.log(xReqst);      
            if (xhr.status === 204) {
                var ref = device.zones;
                var results = [];
                for (var i = 0, len = ref.length; i < len; i++) {
                    var zone = ref[i];
                    zone.running = false;
                    results.push(zone.running = false);

                }
                zone.running = true;
                // zone.requestProcessing = false;
                console.log(results);
            } else {
                reject(Error(xhr.statusText)); 
                // zone.requestProcessing = true;
                xhr.response;
            } 
            console.log('start zone ' + zone.zoneNumber + ' on device ' + device.name + ' gave response ' + xhr.status + ', data ' + json_data + ' results are: ' + results);
        };
        xhr.send(json_data); 
    });
}
  
getXMLRequest('person/info', true).then(function(response){
    var uid = JSON.parse(response).id;
    return uid;
}).then(function(uid){
    var url = 'person/' + uid;
    return url;
}).then(function(url){
    return getXMLRequest(url, true).then(function(response){
        var userName = document.getElementById('userName');
        var fullName = JSON.parse(response).fullName;
        userName.innerHTML = 'Welcome ' + fullName + ' to your landscaping dashboard!';
        var originalDevice = JSON.parse(response).devices[0];
        localStorage.setItem('device', JSON.stringify(originalDevice));
        var device = JSON.parse(localStorage.getItem('device'));
        return device;
    }).then(function(device){
        var deviceID = device.id;
        var deviceContainer = document.getElementById('device-container');
        var disableAllButton = document.createElement('input');
        var zones = device.zones.sort(function(a,b){
            return a.zoneNumber - b.zoneNumber;
        });


        
        var deviceInfo = document.createElement('div');
            deviceInfo.setAttribute('class', 'deviceInfo');
            deviceInfo.appendChild(document.createTextNode('Device Status: '));
            deviceInfo.appendChild(document.createTextNode(device.status));
        var devicePower = document.createElement('div');
        devicePower.setAttribute('class', 'devicePower');
        devicePower.appendChild(document.createTextNode('Device Power: '));
        devicePower.appendChild(document.createTextNode(device.on));var devicePaused = document.createElement('div');
        devicePaused.setAttribute('class', 'devicePaused');
        devicePaused.appendChild(document.createTextNode('Device Paused?:  '));
        devicePaused.appendChild(document.createTextNode(device.paused));
        deviceContainer.appendChild(document.createTextNode(deviceID));
        deviceContainer.appendChild(deviceInfo);
        deviceContainer.appendChild(devicePaused);
        deviceContainer.appendChild(devicePower);


        var zoneList = document.createElement('ol');
        zoneList.setAttribute('id', 'zoneList');
        disableAllButton.addEventListener('click', allOff, false);
        for(var i =0; i < zones.length; i++){
            // wrapper section
            var zone = document.createElement('section');
            zone.setAttribute('id', zones[i].zoneNumber);
            // append zone name
            var header = document.createElement('div');
            header.setAttribute('class', 'header');
            header.appendChild(document.createTextNode(zones[i].name));
            var zoneEnabled = document.createElement('div');
            zoneEnabled.setAttribute('class', 'runningStatus');
            var statusLabel = document.createTextNode('Enabled: ');
            zoneEnabled.appendChild(statusLabel);
            zoneEnabled.appendChild(document.createTextNode(zones[i].enabled));
            var zoneID = document.createElement('div');
            zoneID.setAttribute('class', 'runningStatus');
            var idLabel = document.createTextNode('ID: ');
            zoneID.appendChild(idLabel);
            zoneID.appendChild(document.createTextNode(zones[i].id));
            // individual div buttons
            var zoneButton = document.createElement('input');
            zoneButton.type = 'button';
            zoneButton.value = 'water';
            zoneButton.setAttribute('class', 'btn');
            zoneButton.setAttribute('id', zones[i].id);
            zoneButton.addEventListener('click', turnON, false);
            zone.appendChild(header);
            zone.appendChild(zoneEnabled);
            zone.appendChild(zoneID);
            zone.appendChild(zoneButton);
            zoneList.appendChild(zone);
        }
        document.getElementById('device-container').appendChild(zoneList);

        
    });
}).catch(function(error) {
    console.log('Failed!', error);
});