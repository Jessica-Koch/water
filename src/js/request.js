var getKey = (function() {
    var form = document.querySelector('form');
    var p = new Promise(function(resolve, reject){
        form.addEventListener('submit', function(event){
            var userKey = form.elements.key.value;
            sessionStorage.setItem('userKey', userKey);
            var key = sessionStorage.getItem('userKey');
            console.log('Saved: ' + key);
            event.preventDefault();
        });
    });
});

function get(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();

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
}


get('https://api.rach.io/1/public/person/info', true).then(function(response){
    console.log('success!', response);
}, function(error) {
  console.error('Failed!', error);
});


