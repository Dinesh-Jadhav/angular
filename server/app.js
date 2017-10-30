    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var morgan = require('morgan');
    var formidable = require('formidable');
    var session = require('express-session');
    var MongoClient = require('mongodb').MongoClient;
    var db = require('./config/db');
    var crypto = require('crypto');
    ObjectId = require('mongodb').ObjectID;
    var fs = require('fs');
    //var localStorage = require('node-localstorage').LocalStorage;

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());
    app.use(morgan('dev')); // log every request to the console
    app.use(bodyParser.urlencoded({ extended: true }));


    /** API path that will upload the files */
    MongoClient.connect(db.url, (err, database) => {
        if (err) return console.log(err)
        require('./app/customers')(app, database, crypto);
        var result = {};
        app.post('/userdetails', function(req, res) {
            var id = JSON.parse(req.body.id);

            database.collection("user").find({ "_id": ObjectId(id) }).toArray(function(err, col) {
                if (err) {
                    console.log(err);
                    result.error = err;
                    res.send(JSON.stringify(result));
                    return;
                } else {
                    result.data = col[0];
                    result.success = "user details stored successfully"
                    res.send(JSON.stringify(result));
                }
            })
        })


        app.post('/upload', function(req, res) {
            var Storage = multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, "./images");
                },
                filename: function(req, file, callback) {
                    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
                }
            });

            var upload = multer({
                storage: Storage
                console.log(storage);
            }).single('file'); //Field name and max count

            upload(req, res, function(err) {
                if (err) {
                    console.log("here")
                    return res.send(err);
                }
                console.log("out");
                // res.end("File uploaded sucessfully!.");
                return res.json({ error_code: 0, err_desc: null });
            });
        });


        /*
                app.post('/upload', function(req, res) {
                    var dir_name;
                    var dir = result.data.first_name + '-' + result.data._id;
                    if (!fs.existsSync('../client/uploads/' + dir)) {
                        dir_name = fs.mkdirSync('../client/uploads/' + dir);
                    }
                    var storage = multer.diskStorage({ //multers disk storage settings
                        destination: function(req, file, cb) {
                            cb(null, '../client/uploads/' + dir);
                        },
                        filename: function(req, file, cb) {
                            var datetimestamp = Date.now();
                            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
                        }
                    });

                    var upload = multer({ //multer settings
                        storage: storage
                    }).single('file');

                    upload(req, res, function(err) {
                        if (err) {
                            res.json({ error_code: 1, err_desc: err });
                            return;
                        } else {
                            console.log(req.file);
                            var myobj = { "video_url": req.file.filename, "uploadedAt": req.file.path, "user_id": JSON.parse(req.body.Userdata), "file_type": req.file.mimetype };
                            database.collection("video_data").insertOne(myobj, function(err, row) {
                                if (err) throw err;
                                console.log("1 record inserted");
                                res.json({ error_code: 0, err_desc: null });
                            })

                        }

                    });
                });
            })
        */
    });
    app.listen('3000', function() {
        console.log('running on 3000...');
    });