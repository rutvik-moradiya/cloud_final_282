const mongoose = require("mongoose")
require('dotenv').config()

const kanbanDB = mongoose.connect("mongodb+srv://rutvikmoradiya:FlLU9GNZumqfP6o8@cloudprojectmongocluste.fo7yyic.mongodb.net/");

module.exports = {kanbanDB}