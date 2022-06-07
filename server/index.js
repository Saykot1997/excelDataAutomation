const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const parser = new (require('simple-excel-to-json').XlsParser)();
const json2xls = require('json2xls');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const ChangeAbleField = require('./Models/ChangeAbleField');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('Connected to mongodb') }).catch(err => { console.log(err) });

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'upload')
    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({

    storage: storage, fileFilter: (req, file, cb) => {

        if (file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

            cb(null, true);

        } else {

            cb(null, false);
            return cb(new Error('Only .xlsx files are allowed!'));
        }
    }
})


// get collection list
app.get("/api/getCollectionList", async (req, res) => {

    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.status(200).json(collections);

    } catch (error) {
        res.status(500).json(error)
    }
})

// get collection data
app.get("/api/collection_data/:collectionName", async (req, res) => {

    try {
        const collection = await mongoose.connection.db.collection(req.params.collectionName).find({}).toArray();
        res.status(200).json(collection);

    } catch (error) {

        res.status(500).json(error)
    }
})

// delete collection

app.delete("/api/delete_collection/:collectionName", async (req, res) => {

    try {

        await mongoose.connection.db.collection(req.params.collectionName).drop();
        res.status(200).json("Collection deleted successfully");

    } catch (error) {

        res.status(500).json(error)
    }
})

// update data
app.post("/api/update_data/:collectionName/:dataId", async (req, res) => {

    try {

        const dataId = req.params.dataId;
        const collectionName = req.params.collectionName;
        const updateData = {
            [req.body.key]: req.body.value
        }

        const createObjectId = mongoose.Types.ObjectId(dataId);

        await mongoose.connection.db.collection(collectionName).updateOne({ _id: createObjectId }, { $set: updateData }, { upsert: true });

        res.status(200).json("Data updated successfully");

    } catch (error) {

        res.status(500).json(error)
    }
})


// set changeable field

app.post("/api/set_changeable_field", async (req, res) => {

    if (!req.body.campaingName) {
        res.status(500).json("campaingName is required")
        return;
    }
    if (!req.body.changeableField) {
        res.status(500).json("changeableFields is required")
        return;
    }
    if (!req.body.values) {
        res.status(500).json("values is required")
        return;
    }

    try {

        const isExist = await ChangeAbleField.findOne({ campaingName: req.body.campaingName, changeableField: req.body.changeableField });

        if (!isExist) {

            const data = req.body;
            const changeAbleField = new ChangeAbleField(data);
            const cf = await changeAbleField.save();
            res.status(200).json(cf);

        } else {

            const newChangeAbleField = { ...isExist._doc }

            req.body.values.forEach(value => {
                if (!newChangeAbleField.values.includes(value)) {
                    newChangeAbleField.values.push(value)
                }
            })

            const cf = await ChangeAbleField.findOneAndUpdate({ campaingName: req.body.campaingName, changeableField: req.body.changeableField }, newChangeAbleField, { new: true });
            res.status(200).json(cf);
        }

    } catch (error) {
        res.status(500).json(error)
    }
})


// get changeable field

app.get("/api/get_changeable_fields/:campaingName", async (req, res) => {

    try {
        const changeAbleField = await ChangeAbleField.find({ campaingName: req.params.campaingName });
        res.status(200).json(changeAbleField);

    } catch (error) {
        res.status(500).json(error)
    }
});


// delete changeable field values

app.delete("/api/delete_changeable_field_values/:campaingName/:changeableField/:value", async (req, res) => {

    const campaingName = req.params.campaingName;
    const changeableField = req.params.changeableField;
    const value = req.params.value;

    try {

        const changeAbleField = await ChangeAbleField.findOne({ campaingName: campaingName, changeableField: changeableField });

        if (changeAbleField) {

            const newChangeAbleField = { ...changeAbleField._doc }

            if (newChangeAbleField.values.includes(value) && newChangeAbleField.values.length > 1) {

                newChangeAbleField.values.splice(newChangeAbleField.values.indexOf(value), 1)
                await ChangeAbleField.findOneAndUpdate({ campaingName: campaingName, changeableField: changeableField }, newChangeAbleField);
                res.status(200).json("Changeable field value deleted successfully");
                return;

            } else if (newChangeAbleField.values.includes(value) && newChangeAbleField.values.length == 1) {

                await ChangeAbleField.deleteOne({ campaingName: campaingName, changeableField: changeableField });
                res.status(200).json("Changeable field value deleted successfully");
                return;
            }

        } else {

            res.status(500).json("Changeable field not found")
        }
    } catch (error) {

        console.log(error)
        res.status(500).json(error)
    }
})


// excel file upload
app.post("/api/upload_excel_file", upload.single('file'), async (req, res) => {

    try {

        if (!req.body.campaingName) {
            return res.status(400).json("campaing name in require")
        }

        if (!req.body.changeableFieldName) {
            return res.status(400).json("changeable field name in require")
        }

        const collectionName = req.body.campaingName;
        const changeAbleFieldName = req.body.changeableFieldName;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const doc = parser.parseXls2Json(req.file.path);

        const newData = []

        function clean(obj) {

            for (let propName in obj) {

                const propertyAfterTrim = obj[propName].toString().trim();

                if (propertyAfterTrim === "" && propName !== changeAbleFieldName) {
                    delete obj[propName];
                }
            }
            return obj
        }

        doc[0].forEach((data, index) => {
            newData.push(clean(data))
        })

        const isExist = collections.find(collection => collection.name === collectionName);

        if (isExist) {

            await mongoose.connection.db.collection(collectionName).deleteMany({});
            await mongoose.connection.db.collection(collectionName).insertMany(newData);

            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + req.file.path);
            })

            const collections = await mongoose.connection.db.listCollections().toArray();
            return res.status(200).json(collections);

        } else {

            await mongoose.connection.db.createCollection(collectionName);
            await mongoose.connection.db.collection(collectionName).insertMany(newData);

            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + req.file.path);
            })

            const collections = await mongoose.connection.db.listCollections().toArray();
            return res.status(200).json(collections);
        }

    } catch (error) {

        console.log(error);
        return res.status(500).send(error);
    }
});


// download excel file

app.get("/api/download_excel_file/:collectionName", async (req, res) => {

    try {

        const collection = await mongoose.connection.db.collection(req.params.collectionName).find({}).toArray();
        var xls = json2xls(collection);
        fs.writeFileSync('data.xlsx', xls, 'binary');
        res.download('data.xlsx');

    } catch (error) {

        console.log(error);
        res.status(500).send(error);
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})


app.listen(PORT, () => { console.log('listening on port : ' + PORT); })