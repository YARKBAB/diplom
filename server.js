
const express = require('express');
const app = express();

const path = require('path');
const mapper = require('./mapper');

const bp = require('body-parser').json;
const DATATYPES = [ "order", "client", "location", "product" ];

const pagesize = 20;

async function main()
{   
    mapper.init();

    app.set('view engine','pug');
    app.set('views', path.resolve(__dirname,'view'));

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
        let keys = [];
        if(data.length) 
        {
            let allkeys = Object.keys(data[0]);
            for(let k of allkeys)
            {
                if(k === '_id') continue;
                if(k.includes('ID')) continue;
                keys.push(k);
            }
        }

        let shownext = true;

        let f = cpage * pagesize + 1;
        let t = f + pagesize - 1;
        if(size <= t) { t = size; shownext = false; }
        if(size < f) f = size + 1;
        res.render('page',{ d : data, k : keys, s : size, f, t, shownext});
    });

    app.listen(2021, () => { console.log('online!'); });
};

main();
