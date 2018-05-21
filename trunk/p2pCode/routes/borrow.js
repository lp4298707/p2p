var express = require('express');
var router = express.Router();
//1. 引入mongoose模块
var mongoose=require('mongoose');
//引入cookie
var cookie=require("cookie");

//2. 连接数据库（存在就直接使用，不存在会创建）
mongoose.connect("mongodb://127.0.0.1:27017/p2p",function (err) {
    if(err){
        console.log("数据库连接失败no！");
    }
    else{
        console.log("数据库连接成功yes！");
    }
});

//3. 设计骨架
var borrowSchema=new mongoose.Schema({
    borrowMoney: Number,
    borrowRate: Number,
    borrowTerm: Number,
    repayment: String,
    minMoney: Number,
    maxMoney: Number,
    borrowBonus: Number,
    borrowDays: Number,
    borrowTitle: String,
    borrowDetails: String,
    borrowType: String,
    borrowPerson: String,
    borrowDate: Date,
    isPass: Boolean,
    passDatetime: Date,
    investMoney: Number,
    isComplated: Boolean
});


/*
4. 定义模型
*     参数1 ： 集合名
*     参数2 ： 方案
*     参数3 ： 别名
*/
var borrowModel=mongoose.model("borrows",borrowSchema,"borrows");

/*
 借款金额 borrowMoney   或者  b_money
 借款利息 borrowRate
 借款期限 borrowTerm
 还款方式 repayment
 最小投标 minMoney
 最大投标 maxMoney
 投标奖金 borrowBonus
 招标天数 borrowDays
 借款标题 borrowTitle
 借款描述 borrowDetails

 增加的元素：
 借款类型： 下拉列表   borrowType
 借款日期： 日历可选   borrowDate
 借款人： 登录的用户名，只读readonly      borrowPerson

 是否通过审核 isPass
 通过审核日期 passDatetime
 已投资金额 investMoney
 是否满标 isComplated 默认值是false，满标时改写为true
 */
router.post("/add",function (req,res) {
    //1. 接收数据
    var borrowMoney=req.body.borrowMoney;
    var borrowRate=req.body.borrowRate;
    var borrowTerm=req.body.borrowTerm;
    var repayment=req.body.repayment;
    var minMoney=req.body.minMoney;
    var maxMoney=req.body.maxMoney;
    var borrowBonus=req.body.borrowBonus;
    var borrowDays=req.body.borrowDays;
    var borrowTitle=req.body.borrowTitle;
    var borrowDetails=req.body.borrowDetails;
    var borrowType=req.body.borrowType;
    var borrowPerson=req.body.borrowPerson;
    var borrowDate=req.body.borrowDate;

    //由于审核日期要审核通过才写入，默认写入无效的日期
    var passDatetime=new Date();
    passDatetime.setFullYear(2050);

    //2. 模型实例赋值
    var borrowInstance=new borrowModel({
        borrowMoney: borrowMoney,
        borrowRate: borrowRate,
        borrowTerm: borrowTerm,
        repayment: repayment,
        minMoney: minMoney,
        maxMoney: maxMoney,
        borrowBonus: borrowBonus,
        borrowDays: borrowDays,
        borrowTitle: borrowTitle,
        borrowDetails: borrowDetails,
        borrowType: borrowType,
        borrowPerson: borrowPerson,
        borrowDate: borrowDate,
        isPass: false,
        passDatetime: passDatetime.toLocaleString(),
        investMoney: 0,
        isComplated: false
    });

    //3. 调用save方法进行保存
    borrowInstance.save(function (err) {
        //4. 根据是否写入成功返回结果到前端
        if(err){
            console.log(err.message); //服务器端打印到控制台
            res.json({"isSuccess":false,"message":"借款申请提交失败！原因："+err.message});
        }
        else{
            res.json({"isSuccess":true,"message":"借款申请提交成功！"});
        }
    });
});

//分页显示数据
router.get('/getlist',function (req,res) {
    borrowModel.find({},function (err,allData) {
        if (!err){
           var listJson={
                "total": allData.length,
                "list": []
            };
            var pagesize=parseInt(req.query.pageSize) ;
            var pageindex=parseInt(req.query.pageIndex);
            console.log(pagesize);
            var start=pagesize*pageindex;
            borrowModel.find({},function (err,borrowData) {
                listJson.list=borrowData;
                res.json(listJson);
            }).skip(start).limit(pagesize);

        }else {
            throw err;
            res.send(null);
        }
    });
});


//测试跨域
router.get('/jsonp',function (req,res) {
    var show=req.query.callback;
    borrowModel.find({},function (err,allData) {
        res.send('show("'+allData[0].borrowType+'")');
    });
});

//设置响应头实现跨域
router.get('/jsonp2',function (req,res) {
    var show=req.query.callback;
    borrowModel.find({},function (err,allData) {
        // res.setRequestHeader("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Origin', '*');
        res.send(allData);
    });
});

//echarts路由
router.get('/getEcharts',function (req,res) {
    borrowModel.find({},function (err,allData) {
        // res.send(allData)
        var m1=m2=m3=0;
        if (!err){
            for (var x in allData){
                if ((allData[x].borrowType)=='车易贷'){
                    m1 += allData[x].borrowMoney
                }
                else if ((allData[x].borrowType)=='房易贷'){
                    m2 += allData[x].borrowMoney
                }
                else if ((allData[x].borrowType)=='信用贷'){
                    m3 += allData[x].borrowMoney
                }
            }
            var echartsData=[
                {value:m1, name:'车易贷'},
                {value:m2, name:'房易贷'},
                {value:m3, name:'信用贷'},
            ];
            res.send(echartsData);
        }else {
            throw err;
        }

    });
});


module.exports = router;
