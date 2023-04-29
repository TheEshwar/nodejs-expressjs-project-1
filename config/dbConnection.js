const mongoose = require("mongoose")

const connectionDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)

        console.log('\n database connected :- ', connect.connection.host)
    }
    catch(err){
        console.log(err)
        process.exit(1);
    }
}
module.exports = connectionDb