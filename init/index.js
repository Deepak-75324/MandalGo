const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

// connect to mongo db
main()
.then((res) => {
    console.log("connect to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was saved!");
    await mongoose.disconnect();
    process.exit(0);
}

initDB().catch((err) => {
    console.error(err);
    mongoose.disconnect().finally(() => process.exit(1));
});
