function testPromise() {
    if ('Promise' in window) {
        var btn = document.getElementById('btn');
        btn.addEventListener('click', testPromise);
    } else {
        var output = document.getElementById('output');
        output.innerHTML = "Live example not available as your browser doesn't support the <code>Promise<code> interface.";
    }
}

var getApiKey = function () {
    var form = document.querySelector('form');
    var p = new Promise(function (resolve, reject) {
        form.addEventListener('submit', function (event) {
            var userKey = form.elements.key.value;
            sessionStorage.setItem('userKey', userKey);
            var key = sessionStorage.getItem('userKey');
            p.console.log('Saved: ' + key);
            event.preventDefault();
        });
    });
};

var getXMLRequest = function (urlExt) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/' + urlExt;
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error('Network Error'));
        };
        xhr.send();
    });
};

function turnOff(device) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water',
            data = { 'id': device.id };
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function () {
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
        xhr.onerror = function () {
            reject(Error('Network Error'));
        };
        xhr.send();
    });
}
function allOff(device) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water',
            data = { 'id': device.id };
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        console.log("stop all water request gave response " + response.status + ", data " + response.data);
        if (response.status === 204) {
            var ref = device.zones;
            var results = [];
            for (var i = 0, len = ref.length; i < len; i++) {
                var zone = ref[i];
                results.push(zone.running = false);
            }
            return results;
        }
    });
}

function turnON(device, zone) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/device/stop_water',
            data = { 'id': zone.id, 'duration': 3600 };
        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        xhr.onload = function () {
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
getXMLRequest('person/info', true).then(function (response) {
    var uid = JSON.parse(response).id;
    return uid;
}).then(function (uid) {
    var url = 'person/' + uid;
    return url;
}).then(function (url) {
    return getXMLRequest(url, true).then(function (response) {
        var userName = document.getElementById('userName');
        var fullName = JSON.parse(response).fullName;
        userName.innerHTML = 'Welcome ' + fullName + ' to your landscaping dashboard!';
        var deviceId = JSON.parse(response).devices[0].id;
        localStorage.setItem('deviceId', deviceId);
        var deviceContainer = document.getElementById('device-container');
        var device = localStorage.getItem('deviceId');
        var unorderedZones = JSON.parse(response).devices[0].zones;
        var orderedZones = unorderedZones.sort(function (a, b) {
            return a.zoneNumber - b.zoneNumber;
        });
        // var zoneList =
        var zoneTable = document.createElement('table');
        for (var i = 0, tr, td; i < orderedZones.length; i++) {
            thead = document.createElement('thead');
            th = document.createElement('th');
            tr = document.createElement('tr');
            td = document.createElement('td');
            th.appendChild(document.createTextNode(orderedZones[i].name));
            thead.appendChild(th);
            td.appendChild(document.createTextNode(orderedZones[i].id));
            tr.appendChild(td);
            zoneTable.appendChild(th);
            zoneTable.appendChild(tr);
        }
        document.getElementById('device-container').appendChild(zoneTable);
    });
}).catch(function (error) {
    console.log('Failed!', error);
});