const { MongoClient, ObjectID } = require('mongodb')


function circulationRepo() {
    const url = 'mongodb://localhost:27017'
    const dbName = 'weteithie'

    function loadData(data) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {

                await client.connect()
                const db = client.db(dbName)

                results = await db.collection('newzz').insertMany(data)
                resolve(results)


            } catch (error) {
                reject(error)
            }
        })


    }

    function get(query, limit) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                let items = db.collection('newzz').find(query)
                if (limit > 0) {
                    items = items.limit(limit)
                }
                resolve(await items.toArray())


            } catch (error) {
                reject(error)
            }
        })

    }

    function getById(id) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                const item = db.collection('newzz').findOne({ _id: ObjectID(id) })
                resolve(item)

            } catch (error) {
                reject(error)
            }
        })
    }

    function add(item) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                const addedItem = await db.collection('newzz').insertOne(item)
                resolve(addedItem)

            } catch (error) {
                reject(error)

            }
        })
    }

    function update(id, newItem) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                let updatedItem = await db.collection('newzz').findOneAndReplace({ _id: ObjectID(id) }, newItem, { returnOriginal: false })
                resolve(updatedItem.value)
            } catch (error) {
                reject(error)
            }
        })
    }

    function remove(id) {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url)
            try {
                await client.connect()
                const db = client.db(dbName)
                const removedItem = await db.collection('newzz').deleteOne({ _id: ObjectID(id) })
                resolve(removedItem.deletedCount == 1)
            } catch (error) {
                reject(error)
            }
        })
    }
    return {
        loadData,
        get,
        getById,
        add,
        update,
        remove
    }
}
module.exports = circulationRepo()