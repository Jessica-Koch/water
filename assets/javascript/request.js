function reqListener(){
    console.log(this.responseText)
}

var oReq = new XMLHttpRequest()

oReq.addEventListener('load', reqListener)
oReq.open('GET', 'https://api.rach.io/1/public/person/info')
oReq.send()