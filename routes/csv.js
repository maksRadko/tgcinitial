const Converter = require("csvtojson").Converter,
    Promise = require("bluebird"),
    readFile = Promise.promisify(require("fs").readFile),
    readDir = Promise.promisify(require("fs").readdir),
    stat = Promise.promisify(require("fs").stat),
    path = require("path"),
    multer = require('multer'),
    s3 = require('multer-storage-s3'),
    uuid = require('uuid'),
    writeFile = Promise.promisify(require("fs").writeFile),
    moment = require('moment');

let storeToDb = (app, fileInfo) => {
    console.log(fileInfo, 'here')
};

var storage = s3({
    destination : function( req, file, cb ) {

        cb( null, 'uploads/csvfiles' );

    },
    filename    : function( req, file, cb ) {

        cb( null, `${path.basename(file.originalname, '.csv')}-${file.fieldname}-${moment()}`);

    },
    bucket      : 'my-hello-world-bucket'
});

var upload = multer({
    storage: storage
});

module.exports = (app) => {

    app.server.get('/getConvertedFilesList', (req, res, next) => {
        var path = appDir + "/uploads";
        readDir(path)
            .then((data) => {
                res.json(data)
            })
    });

    //app.server.get('/hello', (req, res, next) => {
    //
    //    var additionalfiles = {
    //        'id':'dfsajhg23hkufs',
    //        'uploaddate':'15.04.32'
    //    };
    //
    //    var params = {
    //        TableName:'s3_file_csv',
    //        Item: additionalfiles
    //    };
    //
    //    app.dynamo.dbDocCli.put(params, function(err, data) {
    //        if (err) {
    //            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //        } else {
    //            console.log("Added item:", JSON.stringify(data, null, 2));
    //            res.json(data)
    //        }
    //    });
    //});

    app.server.get('/getConvertedFile/:name', (req, res, next) => {
        var path = appDir + "/uploads/"  + req.params.name + '.json';

        stat(path)
            .then((data) => {
                var file = require(path);

                return file
            })
            .then((file) => {
                res.json(file)
            })
            .catch((err)=>{
                app.logger.error(err);
                next(err);
            });

    });


    app.server.post('/csvConverter', upload.single('filecsv'), (req, res, next) => {
        storeToDb(app, req.file);
        res.send('Successfully uploaded!');
    });

    //local on file system
    //app.server.post('/csvConverter', (req, res, next) => {
    //    var converter = new Converter({constructResult:false});
    //    var resultArr = [];
    //    var fileName = req.files.filecsv.name;
    //
    //    converter.on("record_parsed", (jsonObj) => {
    //        resultArr.push(jsonObj);
    //    });
    //
    //    converter.on("end_parsed", (jsonObj) => {
    //        writeFileInTo(JSON.stringify(resultArr), fileName)
    //        storeFileToS3(JSON.stringify(resultArr), fileName)
    //    });
    //
    //    converter.on("error",function(errMsg,errData){
    //        next({msg:errMsg, errData:errData});
    //    });
    //
    //    readFile(req.files.filecsv.path)
    //        .then((data) => {
    //            var strBuff = data.toString();
    //
    //            converter.fromString(strBuff, (err,result) => {});
    //        })
    //        .catch((err) => {
    //            app.logger.error(err);
    //            next(err)
    //        })
    //});
};