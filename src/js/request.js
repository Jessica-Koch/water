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
    return new Promise(function(resolve, reject){
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
                    results.push(zone.running = true);
                }
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.send(json_data);
    });
}

function turnON(device, zone){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water', 
            data = {'id': zone.id,'duration': 3600};
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function() {        
            if (xhr.status == 204) {
                resolve(xhr.response); 
                var ref = device.zones;
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
            console.log('start zone ' + zone.zoneNumber + ' on device ' + device.name + ' gave response ' + response.status + ', data ' + response.data);
        };
        xhr.send(); 
    });
}
  

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
        deviceContainer.appendChild(document.createTextNode(deviceID));
        // deviceContainer.appendChild(disableAllButton);
        // disableAllButton.type = 'button';
        // disableAllButton.value = 'Disable All';
        // disableAllButton.setAttribute('class', 'btn');
        // disableAllButton.setAttribute('id', 'allButton');
        // disableAllButton.onclick = allOff(device);
        var orderedZones = unorderedZones.sort(function(a,b){
            return a.zoneNumber - b.zoneNumber;
        });
        var zoneList = document.createElement('ol');
        for(var i =0; i < orderedZones.length; i++){
            var zone = document.createElement('section');
            zone.setAttribute('id', orderedZones[i].zoneNumber);
            var header = document.createElement('div');
            var zoneButton = document.createElement('input');
            zoneButton.type = 'button';
            zoneButton.value = orderedZones[i].enabled;
            zoneButton.setAttribute('class', 'btn');
            zoneButton.setAttribute('id', orderedZones[i].id);
            zoneButton.onclick = function(){
                if(this.value === true){
                    alert('true');
                } else {
                    alert('not true at alllllll!');
                }
            };

            header.setAttribute('class', 'header');
            header.appendChild(document.createTextNode(orderedZones[i].name));
            zone.appendChild(header);
            zone.appendChild(zoneButton);
            zoneList.appendChild(zone);
        }
        document.getElementById('device-container').appendChild(zoneList);

        
    });
}).catch(function(error) {
    console.log('Failed!', error);
});