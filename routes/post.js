const express = require('express');
const router = express.Router();
const multer = require("multer")

const storage = multer.memoryStorage()
const upload = multer({storage})

// import from utils
const S3 = require("../utils/S3")
const prisma = require("../utils/prisma")

router.post("/addpost", upload.single("file"), async (req, res) => {
    const { author, description, category } = req.body

    const publicBucketUrl = "https://pub-83c13c4b6141426b8e4d3d54567ecbb9.r2.dev/";
    let randomKey = Math.round(Math.random() * 9999999999);
    let stringRandomKey = `${randomKey}-HamsterPedia.com`;
    const fileUrl = `${publicBucketUrl}${stringRandomKey}`;

    try {
        await S3.upload({
            Body: req.file.buffer,
            Bucket: "fullstack-team",
            Key: stringRandomKey,
            ContentType: req.file.mimetype
        }).promise()

        await prisma.posts.create({
            data: {
                author,
                description,
                image: fileUrl,
                category,
                title: " "
            }
        })

        console.log({data: {
            author,
            description,
            image: fileUrl,
            category
        }})
        res.status(200).json({
            message: `${fileUrl}`,
            author,
            description,
            category
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({message: e.message})
    }
})

router.get("/allposts", async (req, res) => {
    const category = req.query.category
    (!category ? category = "general" : category = category)
    console.log(category)
    try {
        const allPosts = await prisma.posts.findMany({
            where: {
                category: category
            },
            include: {
                comments: true
            }
        })
        res.status(200).json(allPosts)
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})


module.exports = router;