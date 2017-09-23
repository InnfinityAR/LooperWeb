/**
 * Created by yinshiru on 2017/8/25.
 */
$(function () {
    setTimeout(function(){
        $(".main").css({
            "marginTop":(($(document).height() - $(".main").height() - 160)/2)
        });
    },0);
   $(".act").click(function () {
      location.href = "/Home/Cooper/actList"
   });
    $(".venue").click(function () {
        location.href = "/Home/Cooper/venueList"
    });
    $(".host").click(function () {
        location.href = "/Home/Cooper/hostList"
    });
    $(".family").click(function () {
        location.href = "/Home/Cooper/familyList"
    });
    $(".information .operaBtn .backOperate").css({
        "display" : "none"
    });
    $(".logo").click(function () {
        location.reload();
    });
    // 获取合作用户信息

});