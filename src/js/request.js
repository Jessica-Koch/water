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


var getXMLRequest= function (urlExt) {

    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest(),
            url = 'https://api.rach.io/1/public/' + urlExt;
        req.open('GET', url);
        req.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
        req.onload = function() {        
            if (req.status == 200) {
                resolve(req.response); 
            } else {
                reject(Error(req.statusText)); 
            }
        };
        req.onerror = function() {
            reject(Error('Network Error')); 
        };
        req.send(); 
    });
};

getXMLRequest('person/info', true).then(function(response){
    var uid = JSON.parse(response).id;
    return uid;
}).then(function(uid){
    var url = 'person/' + uid;
    return url;
}).then(function(url){
    return getXMLRequest(url, true).then(function(response){
        var output = document.getElementById('output');
        output.innerHTML = response;
        return response;
    });
}).catch(function(error) {
    console.log('Failed!', error);
});



