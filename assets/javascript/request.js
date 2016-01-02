var getRequest = function(getKey){
    var reqListener = function(){
        var responseId = this.responseText;
        console.log(responseId);
        return {
            responseId: responseId
        };
    };

    var oReq = new XMLHttpRequest();

    oReq.addEventListener('load', reqListener);
    oReq.open('GET', 'https://api.rach.io/1/public/person/info');
    oReq.setRequestHeader('Authorization', 'Bearer ' + this.getKey.key);
    oReq.send();

    return oReq;
};

window.onload = getRequest;