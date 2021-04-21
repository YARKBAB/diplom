
const express = require('express');//подлюкаем модуль для работы с запросами http
const app = express();

const path = require('path');
const mapper = require('./mapper');

const bp = require('body-parser').json;
const DATATYPES = [ "order", "client", "location", "product" ];

const pagesize = 20;

function getkeys(array)
{
    let keys = [];
    if(array.length) 
    {
        let allkeys = Object.keys(array[0]);
        for(let k of allkeys)
        {
            if(k === '_id') continue;
            if(k.includes('ID')) continue;
            keys.push(k);
        }
    }

    return keys;
}

async function main()
{   
    mapper.init();

    app.set('view engine','pug');//шаблонизатор
    app.set('views', path.resolve(__dirname,'view'));//указываем в какой директории искать шаблоны дляс траниц 

    app.use(bp());

    app.get('/', async (req,res) => {
        let cpage = req.query['page'];
        cpage = parseInt(cpage);
        if(!cpage) cpage = 0;

        let ctype = req.query['type'];
        if(!ctype) ctype = 'order';
        if(!DATATYPES.includes(ctype)) return res.sendStatus(400);

        let data = await mapper.getfrom(ctype,{},cpage * pagesize,pagesize);
        let size = await mapper.getcount(ctype,{});

        let keys = getkeys(data);

        if(ctype === 'client') data = data.map(d => { d.more = `/user/${d._id}`; return d });
        if(ctype === 'order') data = data.map(d => { d.more = `/order/${d._id}`; return d });

        let shownext = true;

        let f = cpage * pagesize + 1;
        let t = f + pagesize - 1;
        if(size <= t) { t = size; shownext = false; }
        if(size < f) f = size + 1;

        let more = false;
        if(ctype === 'client') more = true;
        if(ctype === 'order') more = true;

        res.render('page',{ d : data, k : keys, s : size, f, t, shownext, more });
    });

    app.get('/user/:id', async (req,res) => {

        let id = req.params['id'];
        let user = await mapper.getuser(id);
        if(!user) return res.sendStatus(400);

        let orders = await mapper.getuserorders(user);
        let locations = await mapper.getuserlocations(user);

        let okeys = getkeys(orders);
        let lkeys = getkeys(locations);

        let model = { 
            user,
            okeys,
            lkeys,
            odata : orders,
            ldata : locations
        }

        res.render('user',model);

    });

    app.get('/order/:id', async (req,res) => {

        let id = req.params['id'];
        let order = await mapper.getfullorder(id);
        if(!order) return res.sendStatus(400);

        res.render('order',order);

    });

    app.listen(2021, () => { console.log('online!'); });
};

main();
