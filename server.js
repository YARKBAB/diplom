
const express = require('express');
const app = express();

const path = require('path');
const mapper = require('./mapper');

const bp = require('body-parser').json;

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

        let data = await mapper.getfromorder({},cpage * pagesize,pagesize);
        res.render('page',{ d : data});
    });

    app.listen(2021, () => { console.log('online!'); });
};

main();
