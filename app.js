
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))


mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = mongoose.Schema({ name: String });

const ItemModel = mongoose.model("Item", itemsSchema);
const workItemModel = mongoose.model("WorkItem", itemsSchema);

const item1 = new ItemModel({ name: "Sabah" });
const item2 = new ItemModel({ name: "Öğle" });
const item3 = new ItemModel({ name: "Akşam" });

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {

    ItemModel.find().then(docs => {
        if (docs.length === 0) {

            ItemModel.insertMany(defaultItems).then(function () {
                console.log("Success");
            }).catch(err => {
                console.log(err);
            });
            res.redirect("/");
        } else {
            const day = date.getDate();
            res.render("list", { listTitle: day, newListItems: docs });
        }
    }).catch(err => {
        console.log(err);
    });

});


app.post("/", function (req, res) {

    if (req.body.list === "Work List") {
        const workItem = new workItemModel({
            name: req.body.newItem
        });
        workItem.save();
        res.redirect("/work");
    } else {
        const item4 = new ItemModel({ name: req.body.newItem });
        item4.save();
        res.redirect("/");
    }
});


app.get("/work", function (req, res) {

    workItemModel.find().then(workDocs => {
        res.render("list", { listTitle: "Work List", newListItems: workDocs });
    }).catch(err => {
        console.log(err);
    });
});


app.post("/delete", function (req, res) {

   const itemId = req.body.checkbox ; 
    ItemModel.findByIdAndRemove(itemId).then(function () {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
    });
});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000 || process.env.POST, function () {
    console.log("sunucu başlatıldı 3000 portunda.")
});