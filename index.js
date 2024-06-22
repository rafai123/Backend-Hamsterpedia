const express = require("express")
const cors = require("cors")
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
// const AWS = require("aws-sdk")
const dotenv = require("dotenv")

const app = express()
const port = 3003

// import routes
const postsRouter = require("./routes/post")
const commentRouter = require("./routes/comment")

// middleware
app.use(cors())
dotenv.config()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Backend for HamsterPedia is running!, \n for get all post : thislink/allposts \n to add comment addcomment/:idPost")
})

// routes
app.use("/post", postsRouter)
app.use("/comment", commentRouter)

app.listen(port, () => {
    console.log(`Server is lisening on port ${port}`)
})

// export default app
module.exports = app