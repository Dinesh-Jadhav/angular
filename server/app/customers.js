module.exports = function(app, db, crypto) {
    app.post('/createAccount', function(req, res) {
        var result = {};
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var email = req.body.email;
        var password = crypto.createHash('md5').update(req.body.password).digest("hex");
        var status = 1;
        db.collection("user").find({
            email: email
        }).toArray(function(err, cols) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                if (cols.length > 0) {
                    result.error = "Email already exist";
                    res.send(JSON.stringify(result));
                    return;
                } else {
                    user = {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: password,
                    };
                    db.collection("user").insertOne(user, function(err, col) {
                        if (err) {
                            console.log(err);
                            result.error = "somthing went wrong"
                            res.send(JSON.stringify(result));
                            return;
                        } else {
                            result.success = "inserted successfully ";
                            res.send(JSON.stringify(result));
                            //console.log("1 record inserted");
                        }
                    });
                }
            }
        })
    });
    app.post('/login', function(req, res) {
        var result = {}
        var email = req.body.email;
        var password = crypto.createHash('md5').update(req.body.password).digest("hex");
        db.collection("user").find({ email: email }).toArray(function(err, cols) {
            if (err) {
                console.log(err);
                result.error = "email not exist";
                res.send(JSON.stringify(result));
                return;
            } else {
                if (cols.length > 0) {
                    db.collection("user").find({ email: email, password: password }).toArray(function(err, col) {
                        if (err) {
                            console.log(err);
                            result.error = "password is wrong";
                            res.send(JSON.stringify(result));
                            return;
                        } else {
                            if (col.length == 0) {
                                result.error = "password is wrong";
                                res.send(JSON.stringify(result));
                                return;
                            } else {
                                result.data = col[0];
                                result.success = "login successfully"
                                res.send(JSON.stringify(result));
                            }
                        }
                    })
                } else {
                    result.error = "Please enter correct Email";
                    res.send(JSON.stringify(result));
                }
            }
        })
    });

    app.post('/viewvideos', function(req, res) {
        var result = {};
        var id = JSON.parse(req.body.id);
        console.log(id);
        db.collection("video_data").find({ "user_id": id }).toArray(function(err, col) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                result.data = col;
                result.success = "user details stored successfully"
                res.send(JSON.stringify(result));
            }
        })
    })

    app.post('/viewvideocontent', function(req, res) {
        var result = {};
        var id = req.body.id;
        console.log(id);
        db.collection("video_data").find({ "_id": ObjectId(id) }).toArray(function(err, col) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                result.data = col[0];
                result.success = "ok"
                res.send(JSON.stringify(result));
            }
        })
    })


    app.post('/processdata', function(req, res) {
        var result = {};
        /*var id = req.body.id;
        console.log(id);
        db.collection("video_data").find({ "_id": ObjectId(id) }).toArray(function(err, col) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                result.data = col[0];
                result.success = "ok"
                res.send(JSON.stringify(result));
            }
        })*/
        result.success = "ok"
        res.send(JSON.stringify(result));
        console.log("here");
    })

    app.post('/framewise_emotions', function(req, res) {
        var result = {};
        var id = req.body.id;
        console.log(id);
        db.collection("framewise_emotions").find({ "_id": id }).toArray(function(err, col) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                result.data = col;
                result.success = "framewise_emotions displyed successfully";
                res.send(JSON.stringify(result));
            }
        })
    })

    app.post('/emotions_summery', function(req, res) {
        var result = {};
        var id = req.body.id;
        console.log(id);
        db.collection("emotions_summery").find({ "_id": id }).toArray(function(err, col) {
            if (err) {
                console.log(err);
                result.error = err;
                res.send(JSON.stringify(result));
                return;
            } else {
                result.data = col;
                result.success = "emotions summery displyed successfully";
                res.send(JSON.stringify(result));
            }
        })
    })
}