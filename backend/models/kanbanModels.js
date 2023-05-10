const mongoose = require("mongoose");
const subtaskSchema = mongoose.Schema({
  title: String,
  isCompleted: Boolean,
},{versionKey:false});

const tasksSchema = mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["Todo", "Doing", "Done"], default: "Todo" },
  subtask: [{ type: mongoose.Schema.Types.ObjectId, ref: "subtask" }],
},{versionKey:false});

const boardSchema = mongoose.Schema({
  userId:{type:String,required:true},
  name: {
    type: String,
},
tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
},{versionKey:false});

const BoardModel = mongoose.model("board",boardSchema)
const TaskModel = mongoose.model("task",tasksSchema)
const SubTaskModel = mongoose.model("subtask",subtaskSchema)

module.exports  = {BoardModel,TaskModel,SubTaskModel}


