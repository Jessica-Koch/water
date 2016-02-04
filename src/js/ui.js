'use strict';

function createElem(name, className, idName){
    var elem = document.createElement(name);
    elem.setAttribute('class', className);
    elem.setAttribute('id', idName);
    return elem;
};

function createInput(type, name, value) {
    var elem = createElem('input');
    elem.type = type;
    elem.name = name;
    elem.value = value;
    return elem;
}

