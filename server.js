const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const app = require('./app');

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con =>
    console.log('DB connection successful...')
);

//this line shows the environment in which our project is running by default development
// console.log(app.get('env'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App Runing on port ${port}...`);
});

