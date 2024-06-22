const express = require('express');
const router = express.Router();

// import from utils
const prisma = require("../utils/prisma")

router.post("/addcomment/:id", async (req, res) => {
    const { author, comment } = req.body
    const { id } = req.params

    try {
        const newComment = await prisma.comments.create({
            data: {
                author,
                comment,
                post: {
                    connect: {
                        id: parseInt(id)
                    }
                }
            }
        })

        console.log("Komentar berhasil ditambahkan : ", newComment)
        res.status(200).json({message: "Comment added", newComment})
    } catch (error) {
        console.log("error", error)
        res.status(400).json({message: error.message})
    }
})

module.exports = router