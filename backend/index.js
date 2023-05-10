const express = require("express")
const { kanbanDB } = require("./config/db")
const tokenValidator = require("./middlewares/validator")
const { userRouter } = require("./routes/userRoutes")
const { kanbanRouter } = require("./routes/kanbanRoutes")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())
app.use("/users",userRouter)
app.use(tokenValidator)
app.use("/dashboard",kanbanRouter)
app.listen(3000,async()=>{
    try{
        await kanbanDB
        console.log("Your app has been connected with your DB ✅")
    }catch(err){
        console.log(err.message)
    }
})