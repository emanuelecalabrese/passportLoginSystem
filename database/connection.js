const mongoose = require('mongoose');
const { mongoURI } = require('../utils/config');

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("CONNECTED TO THE DB");
}).catch((err) => {
    console.log(err);
});