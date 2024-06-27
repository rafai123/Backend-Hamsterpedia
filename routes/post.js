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
    let fileUrl = `${publicBucketUrl}${stringRandomKey}`;

    try {
        if (req.file) {
            await S3.upload({
                Body: req.file.buffer,
                Bucket: "fullstack-team",
                Key: stringRandomKey,
                ContentType: req.file.mimetype
            }).promise()
        } else {
            fileUrl = " "
        }

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
    let category = req.query.category
    try {
        const allPosts = await prisma.posts.findMany({
            where: {
                category: category
            },
            orderBy: {
                createdAt: "desc"
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

router.get("/delete/allposts", async (req, res) => {
    try {
        // await prisma.posts.deleteMany()
        const deleteComments = prisma.comments.deleteMany()
        const deletePosts = prisma.posts.deleteMany()

        await prisma.$transaction([deleteComments, deletePosts])
        res.status(200).json({message: "All posts deleted"})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

router.get("/delete/:idPost", async (req, res) => {
    try {
        const idPost = parseInt(req.params.idPost)
        await prisma.comments.deleteMany({
            where: {
                postId: idPost
            }
        })
        await prisma.posts.delete({
            where: {
                id: idPost
            }
        })
        res.status(200).json({message: "Post deleted"})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})


module.exports = router;