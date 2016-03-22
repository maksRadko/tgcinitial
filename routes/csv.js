const Converter = require("csvtojson").Converter,
    Promise = require("bluebird"),
    readFile = Promise.promisify(require("fs").readFile),
    readDir = Promise.promisify(require("fs").readdir),
    stat = Promise.promisify(require("fs").stat),
    path = require("path"),
    multer = require('multer'),
    s3 = require('multer-s3'),
    uuid = require('uuid'),
    writeFile = Promise.promisify(require("fs").writeFile),
    moment = require('moment');

let storeToDb = (app, fileInfo) => {
    console.log(fileInfo)
    //
    //var additionalfiles = {
    //    id:uuid.v1(),
    //    'filename':'hello.csb',
    //    'uploaduser':'maks',
    //    'uploaddate':'15.04.32',
    //    's3url':'asfdsa',
    //    'state':'asdfasdf',
    //    'stageresults':'asdfasdf',
    //    'insert count':'adsfasdf',
    //    'insert':'adsfaasdsasdf',
    //    'update count':'asdfdsf',
    //    'error count':'adsfsdafs'
    //};
    //
    //var params = {
    //    TableName:'s3_file_csv',
    //    Item: additionalfiles
    //};
    //
    //app.dynamo.dbDocCli.put(params, function(err, data) {
    //    if (err) {
    //        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //    } else {
    //        console.log("Added item:", JSON.stringify(data, null, 2));
    //        res.json(data)
    //    }
    //});
};

var upload = multer({
    storage: s3({
        dirname: 'uploads/csvfiles/',
        bucket: 'my-hello-world-bucket',
        secretAccessKey: '7EGX0pqBmMmoJwJTBMohOfKIEDozxmqhuXQzzMhx',
        accessKeyId: 'AKIAJZ3A4XCDFWKN2SZQ',
        region: 'us-west-2',
        filename: function (req, file, cb) {
            var fileName = path.basename(file.originalname, '.csv');

            cb(null, `${fileName}_${Date.now()}_${file.fieldname}`);
        }
    })
});

const writeFileInTo = (data, name) => {
    var newPath = appDir + "/uploads/"  + path.basename(name, '.csv') + '.json';

    writeFile(newPath, data)
        .then(() => {
            console.log('filw write successful')
        })
};

const storeFileToS3 = (file, name) => {

};
module.exports = (app) => {

    app.server.get('/getConvertedFilesList', (req, res, next) => {
        var path = appDir + "/uploads";
        readDir(path)
            .then((data) => {
                res.json(data)
            })
    });
    
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