const auth = require("../helpers/auth");

const uploadFileDemo = async(req,res) =>{
    console.log(req.file);
    res.send();
};

const uploadFile = async(req,res)=>{
    const {path} = req.file;
    req.user.avartar =path;
    const result = await req.user.save();
    res.send(result);
};

module.exports={uploadFileDemo,uploadFile}
