var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url =  'mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/app-server'
// Database Name
var dbName = 'app-server'

// Use connect method to connect to the server
function connect(callback){
    MongoClient.connect(url,function(err,client){
        if(err){
            console.log('database err',err)
        }else{
            var db= client.db(dbName)
            callback && callback(db)
            client.close()
        }
    })
}

module.exports= {
    connect
}