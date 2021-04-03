const { MongoClient, ObjectID } = require("mongodb");  
const url = "mongodb://localhost:27017/";

let _order;
let _client; 
let _location;
let _product;

let DATAMAPPERS;

async function init()
{
    const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
    const client = await mongoClient.connect();

    const db = client.db("cursach");
    
    _order    = db.collection("order");
    _client   = db.collection("client");
    _location = db.collection("location");
    _product  = db.collection("product");

    DATAMAPPERS = {
        order : _order,
        client : _client,
        location : _location,
        product : _product    
    };

}

function getfromorder(querry, offset, limit)
{
    return _order.find(querry).skip(offset).limit(limit).toArray();
}
function getfrom(base, querry, offset, limit)
{
    let mapper = DATAMAPPERS[base];
    return mapper.find(querry).skip(offset).limit(limit).toArray();
}
function getcount(base,querry)
{
    let mapper = DATAMAPPERS[base];
    return mapper.countDocuments(querry);
}

module.exports = { init, getfrom, getcount };