const { MongoClient } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://miiluis:ld5vxr60@cluster0.hk6bbrf.mongodb.net/todoDB?retryWrites=true&w=majority&appName=Cluster0'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}