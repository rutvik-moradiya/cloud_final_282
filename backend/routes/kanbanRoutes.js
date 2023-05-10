const express = require('express')
const { createBoard, createTask, getBoard, createSubTask, updateSubtast, updateTask, deleteTask, getAllUserBoard, updateBoard, deleteBoard, updateSubtastTitle, deleteSubtask } = require('../controllers/kanbanControllers')


const kanbanRouter = express.Router()


kanbanRouter.get("/",getAllUserBoard)
kanbanRouter.get("/:Id",getBoard)
kanbanRouter.patch("/updateBoard/:Id",updateBoard)
kanbanRouter.delete("/deleteBoard/:Id",deleteBoard)
kanbanRouter.post("/createBoard",createBoard)
kanbanRouter.post("/createTask/:Id",createTask)
kanbanRouter.post("/createSubtask/:Id",createSubTask)
kanbanRouter.patch("/updateSubtask/:Id",updateSubtast)
kanbanRouter.delete("/deleteSubtask/:Id",deleteSubtask)
kanbanRouter.patch("/updateSubtaskTitle/:Id",updateSubtastTitle)
kanbanRouter.patch("/updateTask/:Id",updateTask)
kanbanRouter.delete("/deleteTask/:Id",deleteTask)




module.exports = {kanbanRouter}