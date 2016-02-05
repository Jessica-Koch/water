'use strict';

function createElem(name, className, idName, text, dynText){
    var elem = document.createElement(name);
    elem.setAttribute('class', className);
    elem.setAttribute('id', idName);
    elem.appendChild(document.createTextNode(text));
    elem.appendChild(document.createTextNode(dynText));
    return elem;
};

function createInput(type, name, value) {
    var elem = createElem('input');
    elem.type = type;
    elem.name = name;
    elem.value = value;
    return elem;
}

function popDOM() {
    var deviceContainer = document.getElementById('device-container');


}

// var zContainer = document.createDocumentFragment();
// function createZones(name, zones) {
//     zContainer.appendChild(createElem('ol', '', 'zoneList');)
// }
//         for(var i =0; i < zones.length; i++){
//             // wrapper section
//             var zone = createElem('section', '', zones[i].zoneNumber);
//             // append zone name
//             var header = createElem('div', 'header');
//             header.appendChild(document.createTextNode(zones[i].name));

//             var zoneEnabled = createElem('div', 'runningStatus');

//             var statusLabel = document.createTextNode('Enabled: ');

//             zoneEnabled.appendChild(statusLabel);
//             zoneEnabled.appendChild(document.createTextNode(zones[i].enabled));
//             var zoneID = createElem('div', 'runningStatus');
         
//             var idLabel = document.createTextNode('ID: ');
//             zoneID.appendChild(idLabel);
//             zoneID.appendChild(document.createTextNode(zones[i].id));


//             var lastWaterDate = createElem('div', 'waterDate');
      
//             var waterDateLabel = document.createTextNode('Date Last Watered: ');
//             lastWaterDate.appendChild(waterDateLabel);
//             lastWaterDate.appendChild(document.createTextNode(zones[i].lastWateredDate));

//             var lastWaterDuration = createElem('div', 'waterDuration');
    
//             var waterDurationLabel = document.createTextNode('Last watered for (time): ');
//             lastWaterDuration.appendChild(waterDurationLabel);

//             lastWaterDuration.appendChild(document.createTextNode(zones[i].lastWateredDuration));

//             var zoneCheckBox = createElem('input', 'zoneCheckbox', zones[i].id);
//             zoneCheckBox.type = 'checkbox';
//             zoneCheckBox.name = 'zoneCheckbox';

//             // individual div buttons
//             var zoneButton = createElem('input', 'btn', zones[i].id);
//             zoneButton.type = 'button';
//             zoneButton.value = 'water';
//             zoneButton.addEventListener('click', turnON, false);
            
//             zone.appendChild(zoneCheckBox);
//             zone.appendChild(header);
//             zone.appendChild(zoneEnabled);
//             zone.appendChild(zoneID);
//             zone.appendChild(lastWaterDate);
//             zone.appendChild(lastWaterDuration);
//             zone.appendChild(zoneButton);
//             zoneList.appendChild(zone);

// deviceContainer.appendChild(document.createTextNode(device.id));
//         deviceContainer.appendChild(deviceInfo);
//         deviceContainer.appendChild(devicePaused);
//         deviceContainer.appendChild(devicePower);
//         deviceContainer.appendChild(scheduleRuleID);
//         deviceContainer.appendChild(currentSchedule);
//         deviceContainer.appendChild(currentScheduleStatus);