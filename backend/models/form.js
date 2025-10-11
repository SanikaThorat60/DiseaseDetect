const mongoose = require("mongoose")

const FormSchema = new mongoose.Schema({
    name: String,
    email: String,
    password : String
})

const FormModel = mongoose.model("details", FormSchema)
module.exports = FormModel