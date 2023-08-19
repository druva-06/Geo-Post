
let ipAddEle = document.getElementsByClassName('ip-address')[0];
let geoLocEle = document.getElementsByClassName('value');
let mapEle = document.getElementsByTagName('iframe')[0];
let timeZoneEle = document.getElementsByClassName('time-zone-value')[0];
let dateTimeEle = document.getElementsByClassName('date-time-value')[0];
let pincodeEle = document.getElementsByClassName('pincode-value')[0];
let messageEle = document.getElementsByClassName('message-value')[0];
let postOfficeEle = document.getElementsByClassName('post-office-details')[0];
let searchBtn = document.querySelector('.search-bar > input')
let latEle = document.getElementsByClassName('lat')[0]
let longEle = document.getElementsByClassName('long')[0]
let cityEle = document.getElementsByClassName('city')[0]
let regionEle = document.getElementsByClassName('region')[0]

let listOfPostOffice = []

async function fetchIpAddress(){
    const ipUrl = `https://api.ipify.org?format=json`
    let response = await fetch(ipUrl);
    let ipObj = await response.json();
    let {ip} = ipObj;
    return ip;
}

async function updateGeoLoc(){
    let ip = await fetchIpAddress();
    ipAddEle.innerText = ip;
    let geoLocUrl = `https://ipinfo.io/${ip}?token=7a7ea822d5ab3d`
    let response = await fetch(geoLocUrl);
    let geoObj = await response.json();

    // let geoObj = {
    //     "ip": "152.58.236.24",
    //     "city": "Hyderābād",
    //     "region": "Telangana",
    //     "country": "IN",
    //     "loc": "17.3840,78.4564",
    //     "org": "AS55836 Reliance Jio Infocomm Limited",
    //     "postal": "500001",
    //     "timezone": "Asia/Kolkata",
    //     "readme": "https://ipinfo.io/missingauth"
    // }

    let lat = geoObj.loc.split(',')[0]
    let long = geoObj.loc.split(',')[1]
    let timeZone = geoObj.timezone
    let postal = geoObj.postal
    let city = geoObj.city
    let region = geoObj.region

    latEle.innerText = lat
    longEle.innerText = long
    cityEle.innerText = city
    regionEle.innerText = region


    updateMap(lat,long)
    updateMoreInfo(timeZone,postal)
    updatePostOffice(postal)
}

function updateMap(lat,long){
    let mapUrl = `https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed`
    mapEle.src = mapUrl
}

function updateMoreInfo(timeZone,postal){
    let curr_datetime_str = new Date().toLocaleString("en-US", { timeZone: timeZone });
    timeZoneEle.innerText = timeZone
    dateTimeEle.innerText = curr_datetime_str
    pincodeEle.innerText = postal
}

async function updatePostOffice(postal){
    let postUrl = `https://api.postalpincode.in/pincode/${postal}`
    let response = await fetch(postUrl)
    let postObj = (await response.json())[0]
    messageEle.innerText = postObj.Message;
    listOfPostOffice = postObj.PostOffice
    updatePostPage(listOfPostOffice)
}

function updatePostPage(listOfPostOffice){
    document.querySelectorAll('.post-office-details > *').forEach((element) => {
        element.remove()
    })

    if(listOfPostOffice === null) return

    listOfPostOffice.forEach(element => {

        let singlePostOffice = document.createElement('div')
        singlePostOffice.className = 'post-office-card'

        let card = `
            <div class="name">
                <span class="card-headings">Name:</span>
                <span class="data name">${element.Name}</span>
            </div>
            <div class="branch-type">
                <span class="card-headings">Branch Type:</span>
                <span class="data branch-type">${element.BranchType}</span>
            </div>
            <div class="delivery-status">
                <span class="card-headings">Delivery Status:</span>
                <span class="data delivery-status">${element.DeliveryStatus}</span>
            </div>
            <div class="district">
                <span class="card-headings">District:</span>
                <span class="data district">${element.District}</span>
            </div>
            <div class="division">
                <span class="card-headings">Division:</span>
                <span class="data division">${element.Division}</span>
            </div>
        `

        singlePostOffice.innerHTML = card;
        postOfficeEle.appendChild(singlePostOffice)
    });
}

function filterPostOffice(name){
    if(name.trim() === ''){
        updatePostPage(listOfPostOffice)
    }
    else{
        let newListOfPOstOffice = listOfPostOffice.filter((element) => {
            console.log(element.Name,name)
            return element.Name === name;
        })
        console.log(newListOfPOstOffice)
        updatePostPage(newListOfPOstOffice)
    }
}

searchBtn.addEventListener('keyup', (event) => {
    if(event.key == 'Enter'){
        filterPostOffice(searchBtn.value)
    }
})

updateGeoLoc()