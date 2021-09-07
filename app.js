const express= require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const mongoose = require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine','ejs');

mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const article = mongoose.model("article",articleSchema);

/////////////////////////////////////Requests all article

app.route("/articles")
.get(function(req,res){  //this will chain the routes which focus the same route but different methods.

  article.find(function(err,foundArticles){   //code to get the data from the collection
    //console.log(foundArticles);
    res.send(foundArticles);
  });
})
.post(function(req,res){

  const newArticle= new article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully Inserted");//to send value to postman
    }
    else{
      res.send("Error in insertion");
    }
  });

})
.delete(function(req,res){

  article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted");
    }
    else{
      res.send(err);
    }

  });

});
////////////////////////////////////////////Requests specific article
app.route("/articles/:articleTitle")
.get(function(req,res){

  article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }
    else{
      res.send("Error in finding the article.Title Mismatch");
    }
  });
})
.put(function(req,res){
  article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},//the info that has to be updated
    {overwrite:true},
    function(err){
      if(!err){
        res.send("No error while updating");
      }
    } );
})
.patch(function(req,res){

  article.update(
    {title:req.params.articleTitle},
    {$set:req.body},//this will take whatever date is given and will update only the specific field
    function(err){
      if(!err){
        res.send("Successfully updated");
      }
      else{
        res.send("Error");
      }
    });
})
.delete(function(req,res){
  article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted Successfully");
      }
      else{
        res.send("Error in deleting");
      }
    });
});
// app.get("/articles",);
//
// app.post("/articles",);
//
// app.delete("/articles",);

app.listen(3000,function(){
  console.log("Server up in port 3000");

});
