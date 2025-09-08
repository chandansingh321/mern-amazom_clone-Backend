const mongoose = require("mongoose");

const mongoDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Admin321:C3M-vA$2EQ6gJ7G@cluster0.nvxekxh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true });
    try{
        const fetched_data = await mongoose.connection.db.collection("item");
        const data = await fetched_data.find({}).toArray();
        global.food_item = data;
    }catch(err){
        console.log(err);
    }
};

module.exports = mongoDB;
