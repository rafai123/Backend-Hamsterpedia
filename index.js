// import express from "express"
// import multer from "multer"
// import cors from "cors"

const express = require("express")
const multer = require("multer")
const cors = require("cors")
// const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3")
const AWS = require("aws-sdk")
const dotenv = require("dotenv")

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app = express()
const port = 3003

// middleware
app.use(cors())
dotenv.config()

const storage = multer.memoryStorage()
const upload = multer({storage})

const Prisma = new PrismaClient()


app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    const { author, description } = req.body
    console.log({author, description})

    // console.log(req.file)
    const publicBucketUrl = "https://pub-83c13c4b6141426b8e4d3d54567ecbb9.r2.dev/"
    let randomKey = Math.round(Math.random()*9999999999)
    let stringRandomKey = randomKey.toString() + "-HamsterPedia.com"
    // const fileName = req.file.originalname
    const fileUrl = publicBucketUrl + stringRandomKey

    const S3 = new  AWS.S3({
        region: "auto",
        endpoint: process.env.ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        }
    })

    try {
        await S3.upload({
            Body: req.file.buffer,
            Bucket: "fullstack-team",
            Key: stringRandomKey,
            ContentType: req.file.mimetype
        }).promise()
        // console.log(`the url : ${fileUrl}`)
        // const presigned = await S3.sign()
        // console.log(fileUrl)

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
        console.log(e)
        res.status(400).json({message: e})
    }

})

app.get("/allposts", async (req, res) => {
    try {
        const allPosts = await prisma.posts.findMany()
        res.status(200).json(allPosts)
    } catch (error) {
        res.status(400).json({message: error})
    }
})

app.listen(port, () => {
    console.log(`Server is lisening on port ${port}`)
})


// export default app
module.exports = app