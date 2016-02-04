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
        var deviceInfo = createElem('div', 'deviceInfo');
        var entry = device.scheduleRules[0];
        // for(var prop in entry) {
        //     console.log("obj." + prop + " = " + entry[prop]);
        // }
        deviceInfo.appendChild(document.createTextNode('Device Status: '));
        deviceInfo.appendChild(document.createTextNode(device.status));

        var devicePower = createElem('div', 'devicePower');
        devicePower.appendChild(document.createTextNode('Device Power: '));
        devicePower.appendChild(document.createTextNode(device.on));

        var devicePaused = createElem('div', 'devicePaused');
        devicePaused.appendChild(document.createTextNode('Device Paused?:  '));
        devicePaused.appendChild(document.createTextNode(device.paused));

        var scheduleRuleID = createElem('div');
        scheduleRuleID.appendChild(document.createTextNode('Device Rule ID: '));
        scheduleRuleID.appendChild(document.createTextNode(entry.id));

        var currentSchedule = createElem('div');
        currentSchedule.appendChild(document.createTextNode('Current Schedule: '));
        currentSchedule.appendChild(document.createTextNode(device.current_schedule));

        var currentScheduleStatus = createElem('div');
        currentScheduleStatus.appendChild(document.createTextNode('Current Schedule Status: '));
        currentScheduleStatus.appendChild(document.createTextNode(device.current_schedule));




        deviceContainer.appendChild(document.createTextNode(device.id));
        deviceContainer.appendChild(deviceInfo);
        deviceContainer.appendChild(devicePaused);
        deviceContainer.appendChild(devicePower);
        deviceContainer.appendChild(scheduleRuleID);
        deviceContainer.appendChild(currentSchedule);
        deviceContainer.appendChild(currentScheduleStatus);


        var zoneList = createElem('ol', '', 'zoneList');
        for(var i =0; i < zones.length; i++){
            // wrapper section
            var zone = createElem('section', '', zones[i].zoneNumber);
            // append zone name
            var header = createElem('div', 'header');
            header.appendChild(document.createTextNode(zones[i].name));

            var zoneEnabled = createElem('div', 'runningStatus');

            var statusLabel = document.createTextNode('Enabled: ');

            zoneEnabled.appendChild(statusLabel);
            zoneEnabled.appendChild(document.createTextNode(zones[i].enabled));
            var zoneID = createElem('div', 'runningStatus');
         
            var idLabel = document.createTextNode('ID: ');
            zoneID.appendChild(idLabel);
            zoneID.appendChild(document.createTextNode(zones[i].id));


            var lastWaterDate = createElem('div', 'waterDate');
      
            var waterDateLabel = document.createTextNode('Date Last Watered: ');
            lastWaterDate.appendChild(waterDateLabel);
            lastWaterDate.appendChild(document.createTextNode(zones[i].lastWateredDate));

            var lastWaterDuration = createElem('div', 'waterDuration');
    
            var waterDurationLabel = document.createTextNode('Last watered for (time): ');
            lastWaterDuration.appendChild(waterDurationLabel);

            lastWaterDuration.appendChild(document.createTextNode(zones[i].lastWateredDuration));

            var zoneCheckBox = createElem('input', 'zoneCheckbox', zones[i].id);
            zoneCheckBox.type = 'checkbox';
            zoneCheckBox.name = 'zoneCheckbox';

            // individual div buttons
            var zoneButton = createElem('input', 'btn', zones[i].id);
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