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
        var deviceContainer = document.getElementById('device-container');
        var zones = device.zones.sort(function(a,b){
            return a.zoneNumber - b.zoneNumber;
        });
        var deviceInfo = createElem('div', 'deviceInfo', '', 'Device Status: ', device.status);
        var entry = device.scheduleRules[0];
        // for(var prop in entry) {
        //     console.log("obj." + prop + " = " + entry[prop]);
        // }

        var devicePower = createElem('div', 'devicePower', '', 'Device Power: ', device.on);

        var devicePaused = createElem('div', 'devicePaused', '', 'Device Paused?: ', device.paused);

        var scheduleRuleID = createElem('div', '', '', 'Device Rule ID: ', entry.id);

        var currentSchedule = createElem('div', '', '', 'Current Schedule: ', device.current_schedule);

        var currentScheduleStatus = createElem('div', '', '', 'Current Schedule Status: ', device.current_schedule);




        deviceContainer.appendChild(document.createTextNode(device.id));
        deviceContainer.appendChild(deviceInfo);
        deviceContainer.appendChild(devicePaused);
        deviceContainer.appendChild(devicePower);
        deviceContainer.appendChild(scheduleRuleID);
        deviceContainer.appendChild(currentSchedule);
        deviceContainer.appendChild(currentScheduleStatus);


        var zoneList = createElem('ol', '', 'zoneList', '', '');
        for(var i =0; i < zones.length; i++){
            var zone = createElem('section', '', zones[i].zoneNumber, '', '');
            var header = createElem('div', 'header', '', '', zones[i].name);
            var zoneEnabled = createElem('div', 'runningStatus', '', 'Enabled: ', zones[i].enabled);
            var zoneID = createElem('div', 'runningStatus', '', 'ID: ', zones[i].id);
            var lastWaterDate = createElem('div', 'waterDate', '', 'Date Last Watered: ', zones[i].lastWateredDate);

            var lastWaterDuration = createElem('div', 'waterDuration', '', 'Last watered for (time): ', zones[i].lastWateredDuration);
            var zoneCheckBox = createElem('input', 'zoneCheckbox', zones[i].id, '', '');
            zoneCheckBox.type = 'checkbox';
            zoneCheckBox.name = 'zoneCheckbox';

            // individual div buttons
            var zoneButton = createElem('input', 'btn', zones[i].id, '', '');
            zoneButton.type = 'button';
            zoneButton.value = 'water';
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