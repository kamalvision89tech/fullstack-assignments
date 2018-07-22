const http = require('http');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');

const Router = express.Router;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/csv/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage });
//const upload = multer({ dest: 'tmp/csv/test.csv' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 3000
var cors = {
    origin: ["http://localhost:9000", "http://localhost:3000/upload"]
}

app.all('*', function (req, res, next) {
    let origin = req.headers.origin;
    if (cors.origin.indexOf(origin) >= 0) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/upload', upload.single('file'), function (req, res) {
    const fileRows = [];
    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
    function findDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) != pos;
        });
    }

    function EndBalanceEmptyValidate(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            var result = parseFloat(obj['Start Balance']) + parseFloat(obj['Mutation']);
            result = result.toFixed(2);
            return result != parseFloat(obj['End Balance']);
        });
    }

    if (req.file.originalname.split('.')[1] == 'xml'){

        var xmlArrayItems = [];
        fs.readFile(req.file.path, function (err, data) {
            parser.parseString(data, function (err, result) {
                fs.unlinkSync(req.file.path);
                var xmlArrayItems = [];
                result.records.record.forEach(function (el, inx, arry) {
                    xmlArrayItems.push({
                        'AccountNumber': el.accountNumber[0],
                        'Description': el.description[0],
                        'End Balance': el.endBalance[0],
                        'Mutation': el.mutation[0],
                        'Reference': el.$.reference,
                        'Start Balance': el.startBalance[0]
                    });
                });
                var report = {
                    duplicateReferenceCount: findDuplicates(xmlArrayItems, "Reference").length,
                    duplicateReferenceList: findDuplicates(xmlArrayItems, "Reference"),
                    uniqueReferenceCount: removeDuplicates(xmlArrayItems, "Reference").length,
                    uniqueReferenceList: removeDuplicates(xmlArrayItems, "Reference"),
                    EndBalanceValidateCount: EndBalanceEmptyValidate(xmlArrayItems, "End Balance").length,
                    EndBalanceValidateList: EndBalanceEmptyValidate(xmlArrayItems, "End Balance")
                }
                report = JSON.stringify(report);
                res.send(report);
            });
        });

    } else if (req.file.originalname.split('.')[1] == 'csv'){
        csv.fromPath(req.file.path)
        .on("data", function (data) {
            fileRows.push(data); // push each row
        })
        .on("end", function () {
            const csv = require('csvtojson');
            csv().fromFile(req.file.path)
                .then((jsonObj) => {
                    var report = {
                        duplicateReferenceCount: findDuplicates(jsonObj, "Reference").length,
                        duplicateReferenceList: findDuplicates(jsonObj, "Reference"),
                        uniqueReferenceCount: removeDuplicates(jsonObj, "Reference").length,
                        uniqueReferenceList: removeDuplicates(jsonObj, "Reference"),
                        EndBalanceValidateCount: EndBalanceEmptyValidate(jsonObj, "End Balance").length,
                        EndBalanceValidateList: EndBalanceEmptyValidate(jsonObj, "End Balance")
                    }
                    fs.unlinkSync(req.file.path);
                    report = JSON.stringify(report);
                    res.send(report);
                })
        });
    }
});

app.use('/upload-csv', router);

// Start server
function startServer() {
  server.listen(port, function () {
    console.log('Express server listening on ', port);
  });
}

startServer();