require("dotenv").config();
const { connect } = require("mongoose");
const connection = connect(process.env.PROD_MONGODB);
module.exports = connection;
