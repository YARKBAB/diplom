
const { MongoClient, ObjectID } = require("mongodb");  
const url = "mongodb://localhost:27017/";

async function separate()
{
    const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
    const client = await mongoClient.connect();

    const db = client.db("cursach");

    const clean = db.collection("clean");
    
    const _order    = db.collection("order");
    const _client   = db.collection("client");
    const _location = db.collection("location");
    const _product  = db.collection("product");

    await _order.insertOne({});
    await _client.insertOne({});
    await _location.insertOne({});
    await _product.insertOne({});

    await _order.drop();
    await _client.drop();
    await _location.drop();
    await _product.drop();

    let data = await clean.find({}).toArray();

    let orders = [];
    let clients = [];
    let locations = [];
    let products = [];

    let ii = 0;
    for(let obj of data)
    {
        let order = {
            "Номер заказа" : obj["Номер заказа"],
            "Дата заказа" : obj["Дата заказа"],
            "Дата доставки" : obj["Дата доставки"],
            "Способ доставки" : obj["Способ доставки"],
            "Продажи" : obj["Продажи"],
            "Количество" : obj["Количество"],
            "Скидка" : obj["Скидка"],
            "Прибыль" : obj["Прибыль"],
            "Стоимость доставки" : obj["Скорость доставки"],
            "Приоритет заказа" : obj["Приоритет заказа"]
        };

        order["ClientID"] = adddistinct(clients,{
            "Номер клиента" : obj["Номер клиента"],
            "Имя клиента" : obj["Имя клиента"],
            "Сегмент" : obj["Сегмент"]
        });

        order["LocationID"] = adddistinct(locations,{
           "Город" : obj["Город"],
           "Область" : obj["Область"],
           "Cтрана" : obj["Страна"],
           "Мировой рынок" : obj["Мировой рынок"],
           "Рынок" : obj["Рынок"],
           "ClientID" : order["ClientID"]
         });

        order["ProductsID"] = adddistinct(products,{
            "Номер продукта" : obj["Номер продукта"],
            "Категория" : obj["Категория"],
            "Подкатегория" : obj["Подкотегория"],
            "Наименование продукта" : obj["Наименование продукта"],
        });

        orders.push(order);

        if(ii % 1000 === 0) console.log(ii);
        ++ii;
    }

    await _order.insertMany(orders);
    await _client.insertMany(clients);
    await _location.insertMany(locations);
    await _product.insertMany(products);

    console.log(`Orders: ${orders.length}\nClients: ${clients.length}\nLocation : ${locations.length} \nProduct : ${products.length} `);

    client.close();
}

function adddistinct(result, element)
{
    let keys = Object.keys(element);

    let objs = result.filter((x) => {
        for(let key of keys)
        {
            if(element[key] !== x[key])
                return false;
        }
        return true;
    });

    if(!objs.length)
    {
        element._id = new ObjectID();
        result.push(element);
        return  element._id;
    }
    else
    {
        return objs[0]._id;
    }
}

separate();
