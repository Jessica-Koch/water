function testPromise() {
    if ('Promise' in window) {
        var btn = document.getElementById('btn');
        btn.addEventListener('click',testPromise);
    } else {
        var output = document.getElementById('output');
        output.innerHTML = "Live example not available as your browser doesn't support the <code>Promise<code> interface.";
    }
}


var getApiKey = (function() {
    var form = document.querySelector('form');
    var p = new Promise(function(resolve, reject){
        form.addEventListener('submit', function(event){
            var userKey = form.elements.key.value;
            sessionStorage.setItem('userKey', userKey);
            var key = sessionStorage.getItem('userKey');
            p.
            console.log('Saved: ' + key);
            event.preventDefault();
        });
    });
});


var getXMLRequest = function (urlExt) {
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

var turnOff = function(device){
    var device = JSON.parse(localStorage.getItem('device'));
    var deviceID = device.id;
    return new Promise(function(resolve, reject){
        var json_data = JSON.stringify({id: deviceID});
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water',
            data = {'id': device.id};
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
                return results;
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

function allOff(device) {
    var device = JSON.parse(localStorage.getItem('device'));
    var selectAllButton = document.querySelector('#allButton');
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
            alert(xhr.status);
        };
        xhr.send(json_data);
    });
}

function turnON(device, zone){
    var deviceContainer = JSON.parse(localStorage.getItem('device'));
    var deviceID = device.id;
    return new Promise(function(resolve, reject){
        var json_data = JSON.stringify({id: deviceID, 'duration': 60});
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/zone/start';
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function() {        
            if (xhr.status === 204) {
                resolve(xhr.response); 
                var ref = device.zones;
                console.log(ref);
                var results = [];
                for (var i = 0, len = ref.length; i < len; i++) {
                    var otherZone = ref[i];
                    otherZone.running = false;
                }
                zone.running = true;
                zone.requestProcessing = false;
                return results;
            } else {
                reject(Error(xhr.statusText)); 
                zone.requestProcessing = true;
            } 
            console.log('start zone ' + zone.zoneNumber + ' on device ' + device.name + ' gave response ' + xhr.status + ', data ' + xhr.data);
        };
        xhr.send(json_data); 
    });
}
  
// this.schedules.sort(function schdSort(a, b) {
//   var retVal = 0;
//   if (a.data.enabled === false && b.data.enabled === false) {
//     retVal = 0;
//   } else if (a.data.enabled === false) {
//     retVal = 1;
//   } else if (b.data.enabled === false) {
//     retVal = -1;
//   }
//   return retVal;
// });
// runZones: function(zoneRunDurations, callback) {
//       var data = {
//         deviceId: this.data.id,
//         zoneRunDurations: zoneRunDurations
//       };
//       this.api.call('device-run-zones', null, data, callback);
//     },
//     stopWatering: function(callback) {
//       var data = {id: this.data.id};
//       this.api.call('device-schedule-stop', null, data, callback);
//     },
// var zones = [];
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
        var unorderedZones = device.zones;
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


        var orderedZones = unorderedZones.sort(function(a,b){
            return a.zoneNumber - b.zoneNumber;
        });
        var zoneList = document.createElement('ol');
        disableAllButton.addEventListener('click', allOff, false);
        for(var i =0; i < orderedZones.length; i++){
            // wrapper section
            var zone = document.createElement('section');
            zone.setAttribute('id', orderedZones[i].zoneNumber);
            // append zone name
            var header = document.createElement('div');
            header.setAttribute('class', 'header');
            header.appendChild(document.createTextNode(orderedZones[i].name));
            var runStatus = document.createElement('div');
            runStatus.setAttribute('class', 'runningStatus');
            var statusLabel = document.createTextNode('RunStatus: ');
            runStatus.appendChild(statusLabel);
            runStatus.appendChild(document.createTextNode(orderedZones[i].enabled));
            // individual div buttons
            var zoneButton = document.createElement('input');
            zoneButton.type = 'button';
            zoneButton.value = orderedZones[i].enabled;
            zoneButton.setAttribute('class', 'btn');
            zoneButton.setAttribute('id', orderedZones[i].id);
            zoneButton.addEventListener('click', turnON, false);
            zone.appendChild(header);
            zone.appendChild(runStatus);
            zone.appendChild(zoneButton);
            zoneList.appendChild(zone);
        }
        document.getElementById('device-container').appendChild(zoneList);

        
    });
}).catch(function(error) {
    console.log('Failed!', error);
});