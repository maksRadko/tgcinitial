const Converter = require("csvtojson").Converter,
    Promise = require("bluebird"),
    readFile = Promise.promisify(require("fs").readFile),
    readDir = Promise.promisify(require("fs").readdir),
    stat = Promise.promisify(require("fs").stat),
    path = require("path"),
    multer = require('multer'),
    s3 = require('multer-s3'),
    writeFile = Promise.promisify(require("fs").writeFile);

var upload = multer({
    dest: 'uploads/'
});
//s3
///var upload = multer({
//    storage: s3({
//        dirname: 'uploads/photos',
//        bucket: 'some-bucket',
//        secretAccessKey: 'some secret',
//        accessKeyId: 'some key',
//        region: 'us-east-1',
//        filename: function (req, file, cb) {
//            cb(null, Date.now())
//        }
//    })
//})

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
        console.log(req.file);
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