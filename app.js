
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))


mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = mongoose.Schema({ name : String})

const ItemModel = mongoose.model("Item" , itemsSchema);

const item1 = new ItemModel({
    name : "Sabah"
});
const item2 = new ItemModel({
    name : "Öğle"
});
const item3 = new ItemModel({
    name : "Akşam"
});

const defaultItems = [item1 , item2 , item3];

ItemModel.insertMany(defaultItems).then(function(){
    console.log("Success");
}).catch(function(err){
    console.log(err);
});



app.get("/", function (req, res) {

    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems:  items});
});

app.post("/", function (req, res) {

    const item = req.body.newItem;

    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {

    res.render("list", { listTitle: "Work List", newListItems:  });
});

app.post("/work", function (req, res) {

    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function (req, res) {
    res.render("about"); 
});




app.listen(3000 || process.env.POST, function () {

    console.log("sunucu başlatıldı 3000 portunda.")
});