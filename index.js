// import express from "express"
// import multer from "multer"
// import cors from "cors"

const express = require("express")
const multer = require("multer")
const cors = require("cors")
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const AWS = require("aws-sdk")
const dotenv = require("dotenv")

const app = express()
const port = 3000

// middleware
app.use(cors())
dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({
    storage,
})


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    // console.log(req.file)
    const publicBucketUrl = "https://pub-83c13c4b6141426b8e4d3d54567ecbb9.r2.dev/"
    let randomKey = Math.round(Math.random()*999999999)
    let stringRandomKey = randomKey.toString() + randomKey.toString() + randomKey.toString() + randomKey.toString() + randomKey.toString()
    const fileName = req.file.originalname
    const fileUrl = publicBucketUrl + stringRandomKey
    // res.send("File Upload")
    // const S3 = new S3Client({
    //     region: "auto",
    //     endpoint: process.env.ENDPOINT,
    //     credentials: {
    //         accessKeyId: process.env.R2_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    //     }
    // })

    const S3 = new  AWS.S3({
        region: "auto",
        endpoint: process.env.ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        }
    })

    // await S3.send(
    //     new PutObjectCommand({
    //         Body: req.file.buffer,
    //         Bucket: "fullstack-team",
    //         Key: req.file.originalname,
    //         ContentType: req.file.mimetype
    //     })
    // )

    try {
        await S3.upload({
            Body: req.file.buffer,
            Bucket: "fullstack-team",
            Key: stringRandomKey,
            ContentType: req.file.mimetype
        }).promise()
        console.log(`the url : ${fileUrl}`)
        // const presigned = await S3.sign()
        console.log()
        res.status(200).json({message: `<a href="${fileUrl}">Link file = ${fileUrl}</a>`})
    } catch (e) {
        res.status(400).json({message: e})
    }

})

app.listen(port, () => {
    console.log(`Server is lisening on port ${port}`)
})


// export default app
module.exports = app