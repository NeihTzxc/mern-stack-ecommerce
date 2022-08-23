const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require('./config/database')
//config
dotenv.config({path: "backend/config/config.env"});
connectDatabase();
app.listen(process.env.PORT, () => {
    console.log("SERVER IS WORKING ON http://localhost:", process.env.PORT);
})