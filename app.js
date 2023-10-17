//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const  mongoose  = require("mongoose");

const homeStartingContent = "Welcome to our cozy corner of the internet, where home is truly where the heart is. Our blog is dedicated to all things home-related, offering a delightful blend of inspiration, practical tips, and creative ideas to transform your living spaces into havens of comfort and style. Whether you're a seasoned interior design enthusiast or a first-time homeowner seeking guidance, we've got you covered. From interior décor trends and organizing hacks to DIY projects and budget-friendly makeovers, we aim to empower you to create a home that reflects your unique personality and nurtures your well-being. Join us on this exciting journey of transforming houses into homes.";
const aboutContent = "Welcome to our blog! We are passionate individuals who have come together to create a platform where ideas, knowledge, and creativity flourish. Our diverse team of writers shares a common goal: to inspire and engage our readers through insightful and thought-provoking content.With expertise in various fields, we strive to provide you with a wide range of topics that cater to your interests and curiosity. From lifestyle and travel to technology and health, our articles are meticulously crafted to deliver valuable information and captivating stories.We believe in the power of words and the impact they can have on individuals and communities. Join us on this exciting journey as we embark on a quest to inform, entertain, and inspire. Together, let's explore the wonders of the world through the pages of our blog.";

const contactContent = "We value your feedback and are eager to connect with you! If you have any questions, suggestions, or simply want to share your thoughts, our contact page is the perfect place to do so. We believe in open communication and strive to provide the best possible experience for our readers. Whether you're seeking assistance, seeking collaboration opportunities, or just want to say hello, we'd love to hear from you. Feel free to reach out to us through the provided contact form, and we'll respond promptly. Your input is crucial in helping us improve and create content that resonates with you.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogsDB", {
    useNewUrlParser: true
});

// Post Schema
const postsSchema = new mongoose.Schema({
  title: String,
  content: String
}); 

// Post Model
const Post = mongoose.model("Post", postsSchema);

//Root page
app.get("/", function (req, res) {
  Post.find().then((foundPost) => {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: foundPost
  });
  });
})

//Home page
app.get("/home", function (req, res) {
  res.redirect("/");
})

//abaout page
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
})

//Contact page
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
})

//Compose page
app.get("/compose", function (req, res) {
  res.render("compose");
})

//Post Compose page
app.post("/compose", function (req, res) {

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

//Posts page
app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId; // No need to convert to lowercase, as the postId is case sensitive in MongoDB.

  Post.findOne({
    _id: requestedPostId
  })
  .then((foundPost) => { // Changed from 'foundId' to 'foundPost'
    res.render("post", { title: foundPost.title, content: foundPost.content }); // Changed 'post' to 'foundPost'
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  });
});

//Port
app.listen(3000, function () {
  console.log("Server started on port 3000");
});