/**
 * Created by yinshiru on 2017/9/20.
 */
$(function(){
    var hostBrandList;
    var data ={};
    data['userId'] = jsonUserInfo['userid'];
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"displayMyBrand",
        success:function (res) {
            var html = "";
            $.each(res.data,function (k,v) {
                html += '<li class="col-sm-3 col-xs-3 col-md-3 col-lg-3" >';
                html +=  '<div class="hostHead">';
                html +=      '<span class="hostImg">';
                html +=          '<img class="avatar" src='+ v.avatar +' alt="">';
                html +=      '</span>';
                html +=      '<span class="edit" data-index="'+v.brandid+'">';
                html +=          '<img  src="/Public/Home/images/editA.png"  alt="">';
                html +=      '</span>';
                html +=  '</div>';
                html +=  '<p class="hostName" title="">品牌名称：'+v.brandname+'</p>';
                html += '</li>'
            });
            $(".hostBrandList").append(html);
            // 编辑hover事件
            $(".hostHead").hover(function () {
                $(this).children(".hostImg").children("img").css({
                    "opacity":"0.5"
                });
                $(this).children(" .edit").css({
                    "display":"block"
                })
            },function () {
                $(this).children(".hostImg").children("img").css({
                    "opacity":"1"
                });
                $(this).children(".edit").css({
                    "display":"none"
                })
            });
            hostBrandList = res.data;
            $(".edit").click(function () {
                var id =  $(this).attr("data-index");
                location.href = "/Home/Cooper/hostBrand/id="+id;
            });
        }
    });
});