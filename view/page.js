
console.log('included');
let page;
page = getParameterByName('page');
if(!page) page = 0;

const DATATYPES = [ "order", "client", "location", "product" ];

let type;
type = getParameterByName('type');
if(!type || !DATATYPES.includes(type)) type = "order";

document.getElementById(`bt${type}`).style.display = 'none';

document.getElementById('next').onclick = () => {
    console.log("next =>>>")
    ++page;

    reloadme();
}

document.getElementById('prev').onclick = () => {
    console.log("prev <<<=");
    --page;
    page = Math.max(0,page);

    reloadme();
}

for(let bttypes of DATATYPES)
{
    document.getElementById(`bt${bttypes}`).onclick = () => {
        type = bttypes;
        page = 0;
        reloadme();
    }
}

function reloadme()
{
    location.href = `/?page=${page}&type=${type}`;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}