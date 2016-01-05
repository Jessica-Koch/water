// A-> $http function is implemented in order to follow the standard Adapter pattern
function $http(url) {
    // A small example of object
    var core = {
        // Method that performs an ajax request
        ajax: function (method, url, args) {
            //Creating a promise
            var promise = new Promise(function (resolve, reject) {
                //Instantiates teh XMLHttpRequest
                var client = new XMLHttpRequest();
                var uri = 'https://api.rach.io/1/public/' + url;

                if (args && (method === 'POST' || method === 'PUT')) {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }
                client.open(method, uri);
                client.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('userKey'));
                client.send();

                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        // Performs the function "resolve" when this.status is equal to 2xx
                        resolve(this.response);
                    } else {
                        // Performs the function "reject" when this.status is different than 2xx
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            });
            // Return the promise
            return promise;
        }
    };
    // Adapter pattern
    return {
        'get': function (args) {
            return core.ajax('GET', url, args);
        },
        'post': function (args) {
            return core.ajax('POST', url, args);
        },
        'put': function (args) {
            return core.ajax('PUT', url, args);
        },
        'delete': function (args) {
            return core.ajax('DELETE', url, args);
        }
    };
}
// End A

// B-> Here you define its functions and its payload
var rachAPI = 'https://api.rach.io/1/public/';
var payload = {
    'topic': 'js',
    'q': 'Promise'
};

var callback = {
    success: function (data) {
        console.log(1, 'success', JSON.parse(data));
    },
    error: function (data) {
        console.log(2, 'error', JSON.parse(data));
    }
};
// End B

// Executes the method call
$http(rachAPI).get(payload).then(callback.success).catch(callback.error);

// Executes the method call but an alternative way (1) to handle Promise Reject case
$http(rachAPI).get(payload).then(callback.success, callback.error);

// Executes the method call but an alternative way (2) to handle Promise Reject case
$http(rachAPI).get(payload).then(callback.success).then(undefined, callback.error);