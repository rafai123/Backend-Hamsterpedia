function addComment (comment, author, idPost) {
    fetch(`http://localhost:3003/addcomment/${idPost}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment: comment,
            author: author,
        })
}).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
}

addComment("This is a comment", "rafai", 1) // Comment added