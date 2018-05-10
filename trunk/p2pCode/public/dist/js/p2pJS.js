$(function () {
    $(function () {
        $('#weixinTips').tooltip()
    });
    $("#switchBtn").on('click',function () {
        $('#memberBox').toggleClass('active')
        if ($('#memberBox').hasClass('active')){
            $(this).text('收起')
        }else {
            $(this).text('展开')
        }
    });

    var x1=x2=0;
    // $(document,window).on('touchstart',function (e) {
    //     console.log(e)
    //     console.log(e.originalEvent.changedTouches[0].clientX);
    //     // x1 = e.changedTouches[0].clientX;
    // })

    document.ontouchstart=function (ev) {
        x1 = ev.changedTouches[0].clientX;

    };


    document.ontouchend=function (ev) {
        x2 = ev.changedTouches[0].clientX;
        var disdance=Math.abs(x2-x1);
        if (disdance>100){
            $("#switchBtn").trigger('click');
        }
    }

});
