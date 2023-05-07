const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tifto@123!!',
    database: 'Test1'
});

app.get("/", function (req, res) {
    res.send("<h1>Welcome, Godsfavour Ngo Kio</h1><h3>Let's have a blast</h3>");
});

app.post("/api/User", async function (req, res) {
    console.log(req.body);

    const userMap = {
        "topic": `${req.body.topic}`,
        "subtitle": `${req.body.subtitle}`,
        "content": `${req.body.content}`
    }

    const response = await appRepo.createNews(JSON.stringify(userMap));
    console.log(`news: ${(JSON.stringify(response))}`);
    res.json(response);

});

app.get("/api/users", function (req, res) {
    console.log(typeof (req.params.id));

    connection.query(
        `select * from users`,
        function (err, results, fields) {
            console.log(JSON.stringify(results));
            // console.log(err.message);
            if (JSON.stringify(results) === "[]") {
                res.send(`User not found, make sure ID is correct`);
                console.log(`Not found: ${typeof (results)}`);
            }
            else {
                res.send(`Found Users: ${JSON.stringify(results)}`);
                console.log(`Found: ${typeof (results)}`);
                //results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
            }
        }
    );

});

app.get("/api/user/:id", function (req, res) {
    console.log(typeof (req.params.id));

    connection.query(
        `select * from users where UserID = "${req.params.id}"`,
        function (err, results, fields) {
            console.log(JSON.stringify(results));
            // console.log(err.message);
            if (JSON.stringify(results) === "[]") {
                res.send(`User not found, make sure ID is correct`);
                console.log(`Not found: ${typeof (results)}`);
            }
            else {
                res.send(results[0]);
                console.log(`Found: ${typeof (results)}`);
                //results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
            }
        }
    );

});

app.post("/api/login", function (req, res) {

    connection.query(
        `select * from users where UserID = "${req.body.id}"`,
        function (err, results, fields) {
            console.log(JSON.stringify(results));
            // console.log(err.message);
            if (JSON.stringify(results) === "[]") {
                const finalResponse = {
                    "code": `01`,
                    "message": `User not found. Make sure ID is correct`,
                    "data": {}
                }
                res.json(finalResponse);
                console.log(`Not found: ${typeof (results)}`);
            }
            else {
                //The user exists
                if (results[0]['password'] === req.body.password) {
                    const finalResponse = {
                        "code": `00`,
                        "message": `Login successful`,
                        "data": results[0]
                    }
                    res.json(finalResponse);
                }
                else {
                    const finalResponse = {
                        "code": `01`,
                        "message": `Password incorrect`,
                        "data": {}
                    }
                    res.json(finalResponse);
                }
                console.log(`Found: ${typeof (results)}`);
                //results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
            }
        }
    );

});

app.post("/api/user/create", function (req, res) {
    // console.log(req.body.id);

    connection.query(
        `insert into users values ("${req.body.id}", "${req.body.lastName}", "${req.body.firstName}", ${req.body.number})`,
        function (err, results, fields) {
            if (results === undefined) {
                res.send(`Could not create new user`);
                console.log(err.message);
            }
            else {
                res.send(`Created new User`);
                console.log(`New User: ${results}`);
            }
        }
    );
});

app.put("/api/user/update", function (req, res) {
    // console.log(req.body.id);

    connection.query(
        `UPDATE users SET lastName = "${req.body.lastName}", FirstName = "${req.body.firstName}", number = ${req.body.number} WHERE UserID = "${req.body.id}"`,
        function (err, results, fields) {
            if (results === undefined) {
                res.send(`Could not update user`);
                console.log(err.message);
            }
            else {
                res.send(`Updated User`);
                console.log(`Updated User: ${results}`);
            }
        }
    );
});

app.delete("/api/user/:id", function (req, res) {

    connection.query(
        `DELETE FROM users where UserID = "${req.params.id}"`,
        function (err, results, fields) {
            console.log(JSON.stringify(results));
            // console.log(err.message);
            if (JSON.stringify(results) === "[]") {
                res.send(`Could not delete user`);
                console.log(`Not found: ${typeof (results)}`);
            }
            else {
                res.send(`Deleted User: ${JSON.stringify(results)}`);
                console.log(`Deleted: ${typeof (results)}`);
                //results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
            }
        }
    );

});

app.listen(process.env.PORT || 3001, function () {
    console.log("Server running on port 3001");
})

//login
//first check if the record exists with ID, 
//then check password, simple