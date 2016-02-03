'use strict';

var turnON = function(evt){
    var device = JSON.parse(localStorage.getItem('device'));
    device.zones.sort(function(a,b){
        return a.zoneNumber - b.zoneNumber;
    });
    var zoneId = evt.target.id;
    api.waterZone(zoneId);
};

var stopWater = function() {
    var deviceID = JSON.parse(localStorage.getItem('device')).id;
    api.allOff(deviceID);
};

// var waterSelected = function() {
//     
//     return checkedZones;
//     api.waterMultipleZones(checkedZones);
// };
// '{ "zones" : [{ "id" : "d8913f51-3af5-41e8-b526-7c2da3646309", "duration" : 10, "sortOrder" : 1 }] }


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
        disableAllButton.addEventListener('click', stopWater, false);
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


            var lastWaterDate = document.createElement('div');
            lastWaterDate.setAttribute('class', 'waterDate');
            var waterDateLabel = document.createTextNode('Date Last Watered: ');
            lastWaterDate.appendChild(waterDateLabel);
            lastWaterDate.appendChild(document.createTextNode(zones[i].lastWateredDate));

            var lastWaterDuration = document.createElement('div');
            lastWaterDuration.setAttribute('class', 'waterDuration');
            var waterDurationLabel = document.createTextNode('Last watered for (time): ');
            lastWaterDuration.appendChild(waterDurationLabel);
            lastWaterDuration.appendChild(document.createTextNode(zones[i].lastWateredDuration));

            var zoneCheckBox = document.createElement('input');
            zoneCheckBox.type = 'checkbox';
            zoneCheckBox.name = 'zoneCheckbox';
            zoneCheckBox.setAttribute('class', 'zoneCheckbox');
            zoneCheckBox.setAttribute('id', zones[i].id);

            // individual div buttons
            var zoneButton = document.createElement('input');
            zoneButton.type = 'button';
            zoneButton.value = 'water';
            zoneButton.setAttribute('class', 'btn');
            zoneButton.setAttribute('id', zones[i].id);
            zoneButton.addEventListener('click', turnON, false);
            zone.appendChild(zoneCheckBox);
            zone.appendChild(header);
            zone.appendChild(zoneEnabled);
            zone.appendChild(zoneID);
            zone.appendChild(lastWaterDate);
            zone.appendChild(lastWaterDuration);
            zone.appendChild(zoneButton);
            zoneList.appendChild(zone);
        }
        document.getElementById('device-container').appendChild(zoneList);

        
    });
}).catch(function(error) {
    console.log('Failed!', error);
});