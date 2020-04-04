// maybe, one day, i'll fix the auth
/*
db.createUser(
    {
        user: "<user for database which shall be created>",
        pwd: "<password of user>",
        roles: [
            {
                role: "readWrite",
                db: "<database to create>"
            }
        ]
    }
);
*/
function getEnvValue(envVar, defVal) {
    var ret = run("sh", "-c", `printenv ${envVar} >/tmp/${envVar}.txt`);
    if (ret != 0) return defVal;
    return cat(`/tmp/${envVar}.txt`)
}

// env vars
var dbName = getEnvValue('DB_NAME', 'scraper')
var colName = getEnvValue('DB_COLLECTION_NAME', 'flightPrices')

// setup custom database
var scraperDb = db.getSiblingDB(dbName)
scraperDb.createCollection(colName)

// setup collection, "schema" and unique indexes
var collection = scraperDb.getCollection(colName)
collection.createIndex({ flightDate: 1, airport: 1, airline: 1 }, { unique: true });

// "Schema"
/*
JSON.parse(
    {
        "flightDate": "2020-03-01",
        "price": {
            // "scrapeDate": "price"
            "2020-03-01T00:00:00Z": 200,
            "2020-03-01T02:00:00Z": 400,
        },
        "airport": "CPH",
        "airline": "norwegian.com",
    }
)
*/