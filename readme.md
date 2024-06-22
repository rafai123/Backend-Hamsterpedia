# HamsterPedia Backend

Backend API for the HamsterPedia application built using Express.js, Prisma, Multer, and AWS S3.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Endpoints](#endpoints)
  - [GET /](#get-)
  - [POST /post/addpost](#post-postaddpost)
  - [GET /post/allposts](#get-postallposts)
  - [POST /comment/addcomment:id](#post-commentaddcommentid)
- [Project Structure](#project-structure)
- [License](#license)

## Requirements

- Node.js
- NPM or Yarn
- Prisma CLI
- AWS Account (for S3)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/username/hamsterpedia-backend.git
    cd hamsterpedia-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up Prisma:

    ```bash
    npx prisma migrate dev --name init
    ```

## Configuration

Create a `.env` file in the root directory of the project and add the following configuration:

```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
S3_BUCKET_NAME="your_s3_bucket_name"
```

## Running the Server

Start the server with the following command:

```bash
npm start
```

The server will run on port `3003`. You can access it at `http://localhost:3003`.

## Endpoints

### GET /

Returns a message indicating that the HamsterPedia backend is running.

**Request:**

```http
GET /
```

**Response:**

```json
{
  "message": "Backend for HamsterPedia is running!"
}
```

### POST /post/addpost

Adds a new post.

**Request:**

```http
POST /post/addpost
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: Image file to be uploaded
- `author`: Name of the author
- `description`: Description of the post
- `category`: Category of the post

**Response:**

```json
{
  "message": "https://your_s3_bucket_url/your_random_key",
  "author": "Author Name",
  "description": "Description",
  "category": "Category"
}
```

### GET /post/allposts

Fetches all posts.

**Request:**

```http
GET /post/allposts
```

**Response:**

```json
[
  {
    "id": 1,
    "author": "Author Name",
    "description": "Description",
    "image": "https://your_s3_bucket_url/your_image_url",
    "category": "Category",
    "comments": [
      {
        "id": 1,
        "author": "Comment Author",
        "comment": "Comment Text"
      }
    ]
  }
]
```

### POST /comment/addcomment:id

Adds a comment to a post.

**Request:**

```http
POST /comment/addcomment:id
Content-Type: application/json
```

**Body:**

```json
{
  "author": "Comment Author",
  "comment": "Comment Text"
}
```

**Response:**

```json
{
  "message": "Comment added",
  "newComment": {
    "id": 1,
    "author": "Comment Author",
    "comment": "Comment Text",
    "postId": 1
  }
}
```

## Project Structure

```
hamsterpedia-backend/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── post.js
│   └── comment.js
├── utils/
│   ├── S3.js
│   └── prisma.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## License
HamsterPedia Copyright (c) 2024.