import { MongoClient } from "mongodb";

let db

async function connectToDb(cb) {
    try {
        const client = await MongoClient.connect(process.env.DB_URI);
        db = client.db();
        cb();
    }catch(err){
        console.error(err);
        cb(err)
    }
    
}

function getDb() {
    return db
}

export { connectToDb, getDb };
