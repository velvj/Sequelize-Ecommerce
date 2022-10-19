// const multer = require("multer");

// const csvFilter = (req, file, cb) => {
//   if (file.mimetype.includes("csv")) {
//     cb(null, true);
//   } else {
//     cb("Please upload only csv file.", false);
//   }
// };

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "./uploadData");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
//   },
// });

// var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
// module.exports = uploadFile


const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'./uploadData')
    },
    filename:function(req,file,cb){
        console.log(file);
        const ext =path.extname(file.originalname)
  cb(null,file.fieldname+'-'+Date.now()+ext)
    }
})

const upload = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if (file.mimetype == "image/png" || file.mimetype == "text/csv" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ||
        file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        cb(null,true)}
        else {
            callback(new Error("File format is not supported"))
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
})



module.exports = upload
