
console.log('included');
let page;
page = getParameterByName('page');
if(!page) page = 0;

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

function reloadme()
{
    location.href = `/?page=${page}`;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}