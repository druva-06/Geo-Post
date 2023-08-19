
let ipAddEle = document.getElementsByClassName('ip-address')[0];

async function fetchIpAddress(){
    const ipUrl = `https://api.ipify.org?format=json`
    let response = await fetch(ipUrl);
    let ipObj = await response.json();
    let {ip} = ipObj;
    ipAddEle.innerText = ip;
    return ip;
}

async function updateIpAddress(){
    let ip = await fetchIpAddress();
    console.log(ip)
}

updateIpAddress()
