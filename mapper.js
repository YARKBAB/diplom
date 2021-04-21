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

function getuser(id) 
{
    let objectid;
    try
    {
        objectid = new ObjectID(id);
    }
    catch(ex)
    {
        return null;
    } 

    return _client.findOne({ _id : objectid });
}

const userorderparams = [
    "Номер заказа",
    "Дата заказа",
    "Дата доставки",
    "Способ доставки",
    "Номер продукта",
    "Наименование продукта"
];

async function getuserorders(user)
{
    let orders = await _order.find({ ClientID : user._id }).toArray();
    let full = []; 
    for(let o of orders)
    {
        let product = await _product.findOne({_id : o.ProductsID });
        let merged = Object.assign({},product,o);
        let result = {};
        for(let key of userorderparams) result[key] = merged[key];
        full.push(result);
    }

    return full;
}

function getuserlocations(user)
{
    return _location.find({ ClientID : user._id }).toArray();
}

async function getfullorder(id)
{
    let objectid;
    try
    {
        objectid = new ObjectID(id);
    }
    catch(ex)
    {
        return null;
    } 

    let order = await _order.findOne({ _id : objectid });

    let user = await _client.findOne({ _id : order.ClientID });
    let location = await _location.findOne({ _id : order.LocationID });
    let product = await _product.findOne({ _id : order.ProductsID });

    return { order, user, location, product };
}

module.exports = { init, getfrom, getcount, getuser, getuserorders, getuserlocations, getfullorder };