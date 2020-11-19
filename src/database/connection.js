const mongoClient = require('mongodb').MongoClient;


mongoClient.connect('mongodb://localhost:27017',

    { useUnifiedTopology: true },

    (error, connection) => {
        if (error) return console.log(error);
        global.connection = connection.db('fast-chat');
        console.log('You are connected to MongoDB');
    }
);

function createMessage(message, callback) {
    return global.connection.collection('messages').insert(message, callback);
}

function listAllMessages() {
    return global.connection.collection('messages').find({}).toArray();
}


module.exports = {
    createMessage,
    listAllMessages
}