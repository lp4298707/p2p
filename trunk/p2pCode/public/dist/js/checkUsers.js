// $.get('/users/checkUser',function (isCheck) {
//     if (!isCheck){
//         alert('登陆已失效,请重新登陆');
//         location.href='login.html';
//     }
// });
//同步加载
$.ajax({
    url: '/users/checkUser',
    async:false,
    success: function(data){
        if (!data.isSuccess) {
            alert('登陆已失效,请重新登陆');
            location.href='/login.html';
        }else {
            $('.userName').html(data.username);
        }
    }
});