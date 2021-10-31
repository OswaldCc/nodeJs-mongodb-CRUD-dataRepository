const mongoClient = require('mongodb').MongoClient
const object_id = require('mongodb').ObjectID
const url = 'mongodb://localhost:27017'
const dbName = 'weteithie'
const data = require('./circulation.json')
const circulationRepo = require('./circulationRepo')
const assert = require('assert')
async function main() {
    const client = new mongoClient(url)
    await client.connect()
    try {

        const results = await circulationRepo.loadData(data)
        assert.equal(data.length, results.insertedCount)
        const getData = await circulationRepo.get()
        assert.equal(getData.length, data.length)
        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper })
        assert.deepEqual(filterData[0], getData[4])
        const limitData = await circulationRepo.get({}, 3)
        assert.equal(limitData.length, 3)
        const id = getData[4]._id.toString()
        const byId = await circulationRepo.getById(id)

        assert.deepEqual(byId, getData[4])

        const newItem = {
            "Newspaper": "My paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        }
        const addedItem = await circulationRepo.add(newItem)


        assert(addedItem.insertedId)
        const addedItemQuery = await circulationRepo.getById(addedItem.insertedId)
        assert.deepEqual(addedItemQuery, newItem)
        console.log(addedItem.insertedId)

        const updateItem = await circulationRepo.update(addedItem.insertedId.toString(), {
            "Newspaper": "My new paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0

        })

        const newAddedItemQuery = await circulationRepo.getById(addedItem.insertedId.toString())
        assert.deepEqual(newAddedItemQuery.Newspaper, "My new paper")
        console.log(newAddedItemQuery)
        const removed = await circulationRepo.remove(addedItem.insertedId.toString())
        assert(removed)
        const deletedItem = await circulationRepo.getById(addedItem.insertedId.toString())
        assert.equal(deletedItem, null)

    } catch (error) {
        console.log(error)
    } finally {
        const admin = client.db(dbName).admin()
        await client.db(dbName).dropDatabase()

        console.log(await admin.listDatabases())
        client.close()
    }




}
main()