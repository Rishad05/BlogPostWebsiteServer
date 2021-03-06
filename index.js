const express = require('express')
const bodyParser = require ('body-parser');
const cors =require ('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()




const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
const PORT = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j70me.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("blogPostDb").collection("blogs");
  
  app.post('/addBlog',(req, res) => {
    const file = req.files.file;
    const blogTitle = req.body.blogTitle;
    const blogContent = req.body.blogContent;
    console.log(file, blogTitle, blogContent);
    const newImg = file.data;
          const encImg = newImg.toString('base64');
  
          var image = {
              contentType: file.mimetype,
              size: file.size,
              img: Buffer.from(encImg, 'base64')
          };
  
          blogCollection.insertOne({ blogTitle, blogContent, image })
              .then(result => {
                  res.send(result.insertedCount > 0);
              })
      });
      app.get('/blogs', (req, res) => {
        blogCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })

      app.delete('/deleteBlogs/:id', (req, res) => {
            const id = ObjectID(req.params.id)
            blogCollection.deleteOne({ _id: id })
             .then(result => {
              res.send(result.deletedCount > 0)
                  })
              })
            });
            app.get('/blogs/:id',(req, res) =>{
                const id = ObjectID(req.params.id)
                blogCollection.find({_id : id})
                .toArray((err,blogs) => {
                res.send(blogs[0]);
                })
            })

 console.log('success')
});
app.get('/', (req, res) =>{
    res.send("hello from db it's working")
  })
  
  app.listen(PORT);