
const { MongoClient } = require("mongodb");  
const url = "mongodb://localhost:27017/";

let deleted = 0;

async function main()
{
    const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
    const client = await mongoClient.connect();

    const db = client.db("cursach");
    const main = db.collection("main");
    const clean = db.collection("clean");
    
    await clean.insertOne({});
    await clean.drop();

    let result = await main.find({}).toArray();

    let filtered = [];

    for(let i = 0; i < result.length; ++i)
    {
        adddistinct(filtered,result[i]);
        if(i % 1000 === 0) console.log(i);
    }

    filtered = filtered.map(x => { delete x['_id']; return x; });
    await clean.insertMany(filtered);
    console.log(`deleted ${deleted}`);
    console.log(`log before:${filtered.length} after: ${result.length}`)
    //console.log(result);
   

    client.close();
}


function adddistinct(result, element)
{
    let keys = Object.keys(element);
    keys.splice(keys.indexOf('_id'), 1);
    keys.splice(keys.indexOf('Номер строки'), 1);

    let objs = result.filter((x) => {
        if(x['_id'] === element['_id']) return false;
        for(let key of keys)
        {
            if(element[key] !== x[key])
                return false;
        }
        return true;
    });

    if(!objs.length)
    {
        result.push(element);
    }
    else
    {
        ++deleted;
    }
}

main();
