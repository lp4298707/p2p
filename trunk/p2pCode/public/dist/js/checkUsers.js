$.get('/users/checkUser',function (isCheck) {
    if (!isCheck){
        alert('登陆已失效,请重新登陆');
        location.href='login.html';
    }
});