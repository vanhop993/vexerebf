const express = require("express");
const multer= require("multer");
const auth = require("../helpers/auth");

const router = express.Router();
const {uploadFileDemo,uploadFile} = require('../controllers/upload');
const upload = multer({
    // custom lưu file
    storage:multer.diskStorage({
        destination: "images",
        filename(req,file,done){// custom thay đổi tên
            const name = Date.now() + "-" + file.originalname;
            done(null,name)
        }
    })
});

// trong đó single là gửi 1 hình , single("file") file trong single là key của obj chứa file
router.post("/upload/file",upload.single("file") , uploadFileDemo);

router.post("/upload/avatar", auth() , upload.single("file") ,  uploadFile);

module.exports= router;
