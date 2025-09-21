const mongoose = require("mongoose");

const mongoDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/Amazone-clone"
  );
    try{
        const fetched_data = await mongoose.connection.db.collection("item");
        const data = await fetched_data.find({}).toArray();
        global.food_item = data;
    }catch(err){
        console.log(err);
    }
};

module.exports = mongoDB;
