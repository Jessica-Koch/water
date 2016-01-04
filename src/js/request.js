var promiseCount = 0;

function testPromise() {
    var thisPromiseCount = ++promiseCount;

    var output = document.getElementById('output');
    output.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Started (<small>Sync code started</small>)<br/>');

    // We make a new promise: we promise the string 'result' (after waiting 3s)
    var p1 = new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {
            output.insertAdjacentHTML('beforeend', thisPromiseCount +
                ') Promise started (<small>Async code started</small>)<br/>');
        });

    // We define what to do when the promise is resolved/fulfilled with the then() call,
    // and the catch() method defines what to do if the promise is rejected.
    p1.then(
        // output the fulfillment value
        function(val) {
            output.insertAdjacentHTML('beforeend', val +
                ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
        }).catch(function(reason) {
            console.log('Handle rejected promise ('+reason+') here.');
        });

    output.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Promise made (<small>Sync code terminated</small>)<br/>');
}if ('Promise' in window) {
    var btn = document.getElementById('btn');
    btn.addEventListener('click',testPromise);
}
else {
    var output = document.getElementById('output');
    output.innerHTML = "Live example not available as your browser doesn't support the <code>Promise<code> interface.";
}



var getKey = (function() {
    var form = document.querySelector('form');
    var p = new Promise(function(resolve, reject){
        form.addEventListener('submit', function(event){
            var userKey = form.elements.key.value;
            sessionStorage.setItem('userKey', userKey);
            var key = sessionStorage.getItem('userKey');
            var output = document.getElementById('output');
            output.innerHTML = key;
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


