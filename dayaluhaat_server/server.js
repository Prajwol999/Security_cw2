require("dotenv").config();
const { server } = require("./index");

const PORT = process.env.PORT || 5050;
server.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    }
);