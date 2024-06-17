const express = require("express")
const multer = require("multer")
const cors = require("cors")
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const AWS = require("aws-sdk")
const dotenv = require("dotenv")

const app = express()
const port = 3003

// import from utils
const S3 = require("./utils/S3")
const prisma = require("./utils/prisma")

// middleware
app.use(cors())
dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({storage})

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    const { author, description } = req.body

    const publicBucketUrl = "https://pub-83c13c4b6141426b8e4d3d54567ecbb9.r2.dev/"
    let randomKey = Math.round(Math.random()*9999999999)
    let stringRandomKey = randomKey.toString() + "-HamsterPedia.com"
    const fileUrl = publicBucketUrl + stringRandomKey

    try {
        await S3.upload({
            Body: req.file.buffer,
            Bucket: "fullstack-team",
            Key: stringRandomKey,
            ContentType: req.file.mimetype
        }).promise()

        await prisma.posts.create({
            data: {
                author: author,
                description: description,
                image: fileUrl,
                title: " "
            }
        })

        console.log({data: {
            author: author,
            description: description,
            image: fileUrl,
        }})
        
        res.status(200).json({
            message: `${fileUrl}`,
            author,
            description
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message || 'An error occurred' });
    }

})

app.get("/allposts", async (req, res) => {
    try {
        const allPosts = await prisma.posts.findMany({
            include: {
                comments: true
            }
        })
        res.status(200).json(allPosts)
    } catch (error) {
        res.status(400).json({message: error})
    }
})

app.post("/addcomment/:id", async (req, res) => {
    const { id } = req.params
    const { author, comment } = req.body


    try {
        const newComment = await prisma.comments.create({
            data: {
                author: author,
                comment: comment,
                postsId: parseInt(id)
            }
        })
        console.log("Komentar berhasil ditambahkan :", newComment)
        res.status(200).json({message: "Comment added", newComment})
    } catch (error) {
        res.status(400).json({message: error})
    }
})

app.listen(port, () => {
    console.log(`Server is lisening on port ${port}`)
})


// export default app
module.exports = app