import express from "express"
import mongoose from "mongoose"
import TodoModel from "./models/todoSchema.js"
import cors from "cors"
const app = express()
const PORT = 8000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const URL = `mongodb+srv://salmanlania:Salman123@cluster0.ycsrpox.mongodb.net/olxClone`;

mongoose.connect(URL)
    .then(res => console.log("MONGODB SUCCESSFULLY CONNECTED!"))
    .catch(err => console.log("MONGODB ERROR", err))

app.post("/addTodo", async (req, res) => {
    try {

        const body = req.body
        const data = await TodoModel.create(body)
        res.json({
            message: "Successfully created!",
            data: data,
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})

app.get("/get-todos", async (req, res) => {
    try {
        const data = await TodoModel.find().sort({ "createAt": -1 })
        res.json({
            message: "Successfully Get!",
            data: data,
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})

app.put("/update-todo/:id", async (req, res) => {
    try {
        const TodoId = req.params.id
        const body = req.body
        const updateData = await TodoModel.findByIdAndUpdate(TodoId, body, { new: true })
        res.json({
            message: "Successfully UPdated!",
            data: updateData,
            status: true
        })
    }
    catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})

app.delete("/delete-todo", async (req, res) => {
    await TodoModel.findByIdAndDelete(req.query.id)
    res.json({
        message: "Successfully deleted!",
        data: null,
        status: true
    })
})

app.post("/delete-all", async (req, res) => {
    try {
        const body = req.body
        const response = await TodoModel.deleteMany({ _id: body.ids })
        res.json({
            message: "ALL DELETED",
            status: true
        })

    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false
        })
    }
})

app.listen(PORT, () => console.log(`server running on localhost:${PORT}`))