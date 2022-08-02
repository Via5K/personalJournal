const express = require("express");
const parser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const dotEnv = require("dotenv").config();
const mongoose = require("mongoose");

// const posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(parser.urlencoded({
    extended: true
}));

const url = process.env.ADMIN + process.env.PASSWORD + process.env.DB;
mongoose.connect(url, {
    useNewUrlParser: true
});
const postSchema = {
    title: String,
    content: String
};
const Post = mongoose.model("Post", postSchema);
// const homeStartingContent = {
//     postTitle: "Home Page Test Content",
//     postContent: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
// };
// const aboutContent = {
//     postTitle: "About Page Test Content",
//     postContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
// };
// const contactContent = {
//     postTitle: "Contact Page Test Content",
//     postContent: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
// };
// const defaultPosts[homeStartingContent, aboutContent, contactContent];
const homeStartingContent = "DAILY JOURNAL - Jot down all your thoughts here. Free to use and Everything available at one place without hassle of sign-ing up or spamming your email address. Welcome Aboard!";
const aboutContent = "This is a Daily Journal where everyone can write their stuff. Please Do not write personal stuff as it is free to use and open to everyone. Note that, there is a feature of removing your post.";
const contactContent = "Connect with Us By filling the below form.";

app.use(express.static("public"));

app.get("/", function(req, res) {
    Post.find({}, function(err, retrievedPosts) {
        res.render("home", {
                startingContent: homeStartingContent,
                posts: retrievedPosts
            })
            // console.log(retrievedPosts);
    });
});

app.get("/remove", function(req, res) {
    Post.find({}, function(err, retrievedPosts) {
        res.render("remove", {
            posts: retrievedPosts
        });
    });
});

app.post("/remove", function(req, res) {
    let toDltPost = req.body.dltButton;
    Post.findByIdAndRemove(toDltPost, function(err, result) {
        if (!err) {
            // console.log("Deleted Successfully");
            Post.find({}, function(err, p) {
                if (p.length > 0) res.redirect("remove");
                else res.redirect("/");
            });
        } else {
            // console.log("err");
            res.redirect("/");
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about", {
        aboutPageContent: aboutContent
    });
});
app.get("/contact", function(req, res) {
    res.render("contact", {
        contactPageDetails: contactContent
    });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.content
    });
    post.save(function(err) {
        if (!err) res.redirect("/")
    });
});

app.get("/post/:postId", function(req, res) {
    const requestedPostId = req.params.postId;
    Post.findOne({
        _id: requestedPostId
    }, function(err, retrievedPost) {
        res.render("post", {
            postTitle: retrievedPost.title,
            postContent: retrievedPost.content
        });
    });
});



app.listen(process.env.PORT || 3000, function() {
    console.log("Server started...");
});