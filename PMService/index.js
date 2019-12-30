/***** NODE TO CREATE SERVICE ********** */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cors = require('cors');

// Body Parser Middleware
//app.use(require('connect').bodyParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    // res.header('Access-Control-Allow-Credentials', true);
    next();
});

//Setting up server
// Start server and listen on http://localhost:8081/
var server = app.listen(8090, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});

//Function to connect to database and execute query
var executeQuery = function (res, query) {

    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pass@word1",
        database: "PROJECTMANAGER"
    });

    con.connect(function (err) {
        if (err) {
            res.send(err);
            con.end();
            throw err;
        }
        else{
            //var sql = "SELECT * FROM Products";
            con.query(query, function (err, result) {
                if (err) {
                    throw err;
                    con.end();
                }
                //console.log(result);
                con.end();
                res.send(result);
            });
        }
        console.log("Connected!");
    });
}

//GET API
app.get("/api/projects", function(req , res){
    var query = "SELECT P.PROJECT_ID,P.PROJECT_NAME,P.START_DATE"
    + " , P.END_DATE, P.PRIORITY, COUNT(T.TASK_ID) TASK_COUNT"
    + " , CASE WHEN ISNULL(T.STATUS) THEN 'OPEN' ELSE T.STATUS END TASK_STATUS"
    + " FROM PROJECTMANAGER.PROJECT P "
    + " LEFT JOIN PROJECTMANAGER.TASK T  "
    + " ON T.PROJECT_ID = P.PROJECT_ID "
    + " GROUP BY P.PROJECT_ID ";
    executeQuery (res, query);
});

app.get("/api/parenttasks", function(req , res){
    var query = "SELECT * FROM PROJECTMANAGER.PARENT_TASK";
    executeQuery (res, query);
});

app.get("/api/user", function(req , res){
    var query = "SELECT * FROM PROJECTMANAGER.USER";
    executeQuery (res, query);
});

app.get("/api/gettask", function(req , res){
    var query = "SELECT * FROM PROJECTMANAGER.TASK";
    executeQuery (res, query);
});

app.get("/api/task", function(req , res){
    var query = "SELECT T.TASK_ID, T.TASK_NAME, PT.PARENT_TASK_NAME" 
    + ", T.PRIORITY,T.START_DATE,T.END_DATE, T.STATUS "
     + " FROM PROJECTMANAGER.TASK T " 
    + "INNER JOIN PROJECTMANAGER.PARENT_TASK PT "
    + "ON PT.PARENT_TASK_ID = T.PARENT_TASK_ID";
    executeQuery (res, query);
});

app.get("/api/getuser", function(req , res){
    var query = "SELECT U.USER_ID, U.FIRST_NAME, U.LAST_NAME"
     + ",T.TASK_NAME, P.PROJECT_NAME FROM PROJECTMANAGER.USER U "
     + " INNER JOIN PROJECTMANAGER.PROJECT P ON P.PROJECT_ID = U.PROJECT_ID "
     + " INNER JOIN PROJECTMANAGER.TASK T ON T.TASK_ID = U.TASK_ID ";
    executeQuery (res, query);
});

// app.get("/api/project/:id", function(req , res){
//     var query = "SELECT * FROM PROJECTMANAGER.PROJECT WHERE PROJECT_ID=" + req.params.id;
//     executeQuery (res, query);
// });

app.post("/api/saveproject", function(req , res){
    console.log("Request revcieved");
    console.log(req.body.projectName);
    console.log(req.body.startDate);
    console.log(req.body.endDate);
    console.log(req.body.priority);
    var query = "INSERT INTO PROJECTMANAGER.PROJECT"
    + " (PROJECT_NAME, START_DATE, END_DATE, PRIORITY) VALUES("
    + req.body.projectName +"," + req.body.startDate + ","
    + req.body.endDate +","+ req.body.priority + ");";
    executeQuery (res, query);
});

app.post("/api/savetask", function(req , res){
    console.log("Request revcieved");
    console.log(req.query);
    var query = "INSERT INTO PROJECTMANAGER.TASK(PARENT_TASK_ID,PROJECT_ID,TASK_NAME, START_DATE, END_DATE, PRIORITY, STATUS) VALUES("+ req.query.parentTaskId + "," + req.query.projectId + ",'" + req.query.taskName  + "','" + req.query.startDate + "','"+ req.query.endDate +"',"+ req.query.priority + ",'" + req.query.status + "')";
    executeQuery (res, query);
});

app.post("/api/endtask", function(req , res){
    console.log("Request revcieved");
    console.log(req.body);
    var query = "UPDATE PROJECTMANAGER.TASK SET STATUS='CLOSED' WHERE TASK_ID=" + req.body.taskId;
    executeQuery (res, query);
});

app.post("/api/saveuser", function(req , res){
    console.log("Request revcieved");
    console.log(req.query);
    var query = "INSERT INTO PROJECTMANAGER.USER(FIRST_NAME, LAST_NAME, PROJECT_ID, TASK_ID) VALUES('"+ req.query.firstName + "','" + req.query.lastName + "'," + req.query.projectId  + "," + req.query.taskId + ")";
    executeQuery (res, query);
});

app.post("/api/deleteuser", function(req , res){
    console.log("Request revcieved");
    console.log(req.query);
    var query = "DELETE FROM PROJECTMANAGER.USER WHERE USER_ID=" + req.query.userId;
    executeQuery (res, query);
});

app.post("/api/deleteproject", function(req , res){
    console.log("Request revcieved");
    console.log(req.query);
    var query = "DELETE FROM PROJECTMANAGER.PROJECT WHERE PROJECT_ID=" + req.query.projectId;
    executeQuery (res, query);
});

