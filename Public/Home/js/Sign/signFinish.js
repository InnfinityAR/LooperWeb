/**
 * Created by yinshiru on 2017/8/25.
 */
$(function () {
    $(".information").css({
        "display":"none"
    });
    $(".logo").click(function () {
        location.href = "/Home/Login/newIndex";
    });
    $(".main").css({
        "marginTop":($(document).height() - $(".main").height()-160)/2
    });
    var textHeight = $(".textContent").height();
    $(".textContent").css({
        "paddingTop": (500 - textHeight)/2
    });
    $(".goIndex").click(function () {
        location.href = "/";
    })
});