const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require('./config/database')

// Handling Uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

//config
dotenv.config();
connectDatabase();
const server = app.listen(process.env.PORT, () => {
    console.log("SERVER IS WORKING ON http://localhost:", process.env.PORT);
})

//Unhandled Promise Rejection
process.on("unhandleRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandle Promise Rejection`);
    server.close(() => {
        process.exit(1);
    })
})