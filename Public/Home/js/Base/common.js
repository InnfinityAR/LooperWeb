/**
 * Created by yinshiru on 2017/8/30.
 */
$(function(){

//                返回主页
    $(".backOperate").click(function () {
        location.href = "/Home/Cooper/index"
    });
    $(".logo").click(function () {
        location.href = "/Home/Cooper/index"
    });
    $(".information").hover(function () {
        $(".information").find(".operaBtn").css({
            "display":"block"
        })
    },function () {
        $(".information").find(".operaBtn").css({
            "display":"none"
        })
    });
    // 显示二维码
    $(".block").hover(function(){
        $(this).find(".qrcode").show();
    },function(){
        $(this).find(".qrcode").hide();
    });
    // 跳转至合作用户信息页面
    $(".touxiang").click(function () {
        location.href = '/Home/Cooper/cooperInfo'
    });

    // 获取合作用户信息
    if($.cookie("user")!=null){
        var data = {};
        data['userId'] = jsonUserInfo['userid'];
        $.ajax({
            type : 'post',
            data:data,
            url:web_url+"getThirdPartyInfo",
            success:function (res) {
                if(res!=''){
                    $(".touxiang").append("<img src="+res.user.headimageurl+"  />")
                }
            }
        })
    }

});