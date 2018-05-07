var express = require('express');
var router = express.Router();
//引入mongoose模块
var mongoose=require('mongoose');
//mongoose链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/p2p',function (err) {
    if (err){
        console.log('数据库链接失败'+err)
    }else {
        console.log('数据库链接成功')
    }
});
//设计用户的骨架
var userSchema=new mongoose.Schema({
    username: String,
    pwd: String,
    email: String,
    mobile: String,
    isActive: Boolean,
    createDate: Date
});
//定义用户的数据模型实例
// 参数1 ： 集合名
// *     参数2 ： 方案
// *     参数3 ： 别名
var userModel=mongoose.model("users",userSchema,"users");



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/join',function (req,res) {
  //接收数据
    var usn=req.body.username;
    var pwd=req.body.password;
    var email=req.body.email;

//获取系统的当前时间
    var createDate=new Date().toLocaleString();
  //写入数据
//得到用户实例并赋值
    var userInstance=new userModel({
        username: usn,
        pwd: pwd,
        email: email,
        mobile: '',
        isActive: true,
        createDate: createDate
    });
    //调用save方法保存
    userInstance.save(function (err) {
        //3. 根据是否写入成功返回结果到前端
        if(err){
            console.log(err.message); //服务器端打印到控制台
            res.json({"isSuccess":false,"message":"用户注册失败！原因："+err.message});
        }
        else{
            res.json({"isSuccess":true,"message":"用户注册成功！"});
        }
    });


});

module.exports = router;
