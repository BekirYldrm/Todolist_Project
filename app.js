
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
const _ = require("lodash"); 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const day = date.getDate();

mongoose.connect('mongodb+srv://bekir_yildirim:25.08.2001Bekir@cluster0.z4l3wpv.mongodb.net/todolistDB');

const itemsSchema = mongoose.Schema({ name: String });

const ItemModel = mongoose.model("Item", itemsSchema);

const item1 = new ItemModel({ name: "Sabah" });
const item2 = new ItemModel({ name: "Öğle" });
const item3 = new ItemModel({ name: "Akşam" });
const defaultItems = [item1, item2, item3];


const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
const ListModel = mongoose.model("List", listSchema);


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

            res.render("list", { listTitle: day, newListItems: docs });
        }
    }).catch(err => {
        console.log(err);
    });

});

app.get("/:parameters", (req, res) => {
    const listName = _.capitalize(req.params.parameters);

    ListModel.findOne({ name: listName }).then(doc => {
        if (doc) {
            res.render("list", { listTitle: listName, newListItems: doc.items });
        } else {
            const listItem = new ListModel({
                name: listName,
                items: defaultItems
            });
            listItem.save();
            res.redirect("/" + listName);

        }
    }).catch(err => {
        console.log(err);
    });
});



app.post("/", function (req, res) {

    const listName = req.body.list;
    const item = new ItemModel({ name: req.body.newItem });

    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        ListModel.findOne({ name: listName }).then(doc => {
            doc.items.push(item);
            doc.save();
            res.redirect("/" + listName);
        }).catch(err => {
            console.log(err);
        })
    }

});

app.post("/delete", function (req, res) {

    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
        ItemModel.findByIdAndRemove(itemId).then(function () {
            res.redirect("/");
        }).catch(err => {
            console.log(err);
        });
    } else {
        ListModel.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemId } } }).then(doc => {
            res.redirect("/" + listName);
        }).catch(err => {
            console.log(err);
        });
    }


});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000 || process.env.POST, function () {
    console.log("sunucu başlatıldı 3000 portunda.")
});