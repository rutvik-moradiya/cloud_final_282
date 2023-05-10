const {
  BoardModel,
  TaskModel,
  SubTaskModel,
} = require("../models/kanbanModels");


const createBoard = async (req, res) => {
  try {
    let newBoard = new BoardModel({ ...req.body, userId: req.headers.userId });
    await newBoard.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(301).
      json({ message: "something went wrong", error: err.message });
  }
};

const updateBoard = async (req, res) => {
  try {
    await BoardModel.findByIdAndUpdate(req.params.Id, req.body);
    res.status(200).json({ message: "board has been updated." });
  } catch (err) {
    res.status(301).
      json({ message: "something went wrong", error: err.message });
  }
};


const deleteBoard = async (req, res) => {
  try {
    let board = await BoardModel.findById(req.params.Id)
    let taskArray = board.tasks.map(async (ele) => {
      return await TaskModel.findById(ele)
    })
    let resolvedTaskArray = await Promise.all(taskArray)
    resolvedTaskArray.map(async (ele) => {
      ele.subtask.map(async (childEle) => {
        await SubTaskModel.findByIdAndRemove(childEle)
      })
      await TaskModel.findByIdAndRemove(ele);
    })
    await BoardModel.findByIdAndRemove(req.params.Id)
    res.status(200).json({ message: "board has been deleted." });
  } catch (err) {
    res.status(301).
      json({ message: "something went wrong", error: err.message });
  }
};



const createTask = async (req, res) => {
  let subTaskId = []
  try {
    if (req.body.subtask?.length) {
      let temp = req.body.subtask.map(async (ele) => {
        let newSubTask = new SubTaskModel(ele);
        return await newSubTask.save()
      })
      let resolveData = await Promise.all(temp)
      resolveData.map((ele) => {
        subTaskId.push(ele._id)
      })
      req.body.subtask = subTaskId
    }
    let task = new TaskModel(req.body);
    let board = await BoardModel.findOne({ _id: req.params.Id });
    board.tasks.push(task._id);
    await task.save();
    await board.save();
    res.status(200).json({ message: "new task has been created" });
  } catch (err) {
    res.status(301).
      json({ message: "something went wrong", error: err.message });
  }
};

const createSubTask = async (req, res) => {
  try {
    let newSubTask = new SubTaskModel(req.body);
    let task = await TaskModel.findOne({ _id: req.params.Id });
    task.subtask.push(newSubTask._id);
    await newSubTask.save();
    await task.save();
    res.status(200).json({ message: "new subtask has been created" });
  } catch (err) {
    res
      .status(301)
      .json({ message: "something went wrong", error: err.message });
  }
};


const updateSubtast = async (req, res) => {
  try {
    let subtask = await SubTaskModel.findOne({ _id: req.params.Id });
    subtask.isCompleted = !subtask.isCompleted
    await subtask.save();
    res.status(200).json({ message: "subtask has been updated" });
  } catch (err) {
    res.status(301).json({ message: "something went wrong", error: err.message });
  }
}

const updateSubtastTitle = async (req, res) => {
  try {
    let subtask = await SubTaskModel.findByIdAndUpdate(req.params.Id, req.body);
    res.status(200).json({ message: "subtask has been updated" });
  } catch (err) {
    res.status(301).json({ message: "something went wrong", error: err.message });
  }
}


const updateTask = async (req, res) => {
  try {
    await TaskModel.findByIdAndUpdate(req.params.Id, req.body)
    res.status(200).json({ message: "subtask has been updated" });
  } catch (err) {
    res
      .status(301)
      .json({ message: "something went wrong", error: err.message });
  }
}


const deleteTask = async (req, res) => {
  const { boardId } = req.body;
  try {
    let boardData = await BoardModel.findById(boardId)
    let taskData = await TaskModel.findById(req.params.Id);
    let updatedTaskFromBoard = boardData.tasks?.filter((ele) => String(ele) !== req.params.Id)
    taskData.subtask.forEach(async (ele) => {
      await SubTaskModel.findByIdAndRemove(ele)
    })
    boardData.tasks = updatedTaskFromBoard
    await boardData.save()
    res.status(200).json({ message: "task has been deleted" })
  }
  catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong", error: err.message });
  }
}


const deleteSubtask = async (req, res) => {
  try {
    let taskData = await TaskModel.findById(req.body.taskId);
    const updatedSubtask = taskData.subtask?.filter((ele) => String(ele) !== req.params.Id)
    taskData.subtask = updatedSubtask
    await SubTaskModel.findByIdAndRemove(req.params.Id)
    await taskData.save();
    res.status(200).json({ message: "subtask has been deleted" })
  }
  catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong", error: err.message });
  }
}



const getBoard = async (req, res) => {
  try {
    let boardData = await BoardModel.find({ _id: req.params.Id }).populate({
      path: "tasks",
      populate: {
        path: "subtask",
      },
    });
    res.status(200).json({ message: "success", data: boardData });
  } catch (err) {
    res
      .status(301)
      .json({ message: "something went wrong", error: err.message });
  }
};


const getAllUserBoard = async (req, res) => {
  console.log(req.headers.userId)
  try {
    let userBoards = await BoardModel.find({ userId: req.headers.userId })
    res.status(200).json({ message: "success", data: userBoards });
  } catch (err) {
    res
      .status(301)
      .json({ message: "something went wrong", error: err.message });
  }
};



module.exports = { createBoard, createTask, createSubTask, getBoard, updateSubtast,deleteSubtask, updateSubtastTitle, updateTask, deleteTask, getAllUserBoard, updateBoard, deleteBoard };
