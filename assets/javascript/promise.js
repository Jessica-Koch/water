function formSubmit() {
    var form = document.querySelector('form');
    form.addEventListener('submit', function(event){
        var userKey = form.elements.key.value;
        console.log('Saving value', userKey);
        event.preventDefault();
    });
}
