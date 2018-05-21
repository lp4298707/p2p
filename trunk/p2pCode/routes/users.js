var express = require('express');
var router = express.Router();
//引入mongoose模块
var mongoose=require('mongoose');
//引入cookie
var cookie=require('cookie');

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

router.post('/checkLogin',function (req,res) {
    //接收数据
    var usn=req.body.username;
    var pwd=req.body.password;
    //写入数据
//得到用户实例并赋值
//     var userInstance=new userModel({
//         username: usn,
//         pwd: pwd,
//     });
    //调用save方法保存
    // userInstance.save(function (err) {
    //     //3. 根据是否写入成功返回结果到前端
    //     if(err){
    //         console.log(err.message); //服务器端打印到控制台
    //         res.json({"isSuccess":false,"message":"用户注册失败！原因："+err.message});
    //     }
    //     else{
    //         res.json({"isSuccess":true,"message":"用户注册成功！"});
    //     }
    // });
    userModel.find({'username':usn, 'pwd':pwd},function (err,checkUser) {
        console.log(checkUser);
        if (!err){
            if (checkUser.length>0){
                res.cookie('userid',checkUser[0]._id);
                res.cookie('username',checkUser[0].username);

                res.json({'isSuccess':true,'message':'登陆成功!'});
            }else {
                res.send({'isSuccess':false,'message':'登陆失败,密码错误.'});
            }
        }else {
            throw err;
        }
    })


});

router.get('/checkUser',function (req,res) {
    var userId=req.cookies.userid;
    var username=req.cookies.username;
    console.log(userId,username);
    if (userId && username){
        res.send('');
    }else {
        res.send('alert("登陆已失效,请重新登陆!");location.href="login.html"');
    }

});

router.get('/getUserName',function (req,res) {
    var username=req.cookies.username;
        res.send("$('.userName').text("+"'"+username+"'"+");$('.userName').val("+"'"+username+"'"+")")
        // res.send({'isSuccess':true,'username':username})
});

router.get('/delUser',function (req,res) {
    res.clearCookie('userid');
    res.clearCookie('username');
    res.redirect('/login.html')
});

module.exports = router;
