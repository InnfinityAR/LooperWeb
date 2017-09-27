/**
 * Created by yinshiru on 2017/8/29.
 */
$(function () {
   //获取主办方list
   var hostList;
   var data ={};
   data['userId'] = jsonUserInfo['userid'];
   data['type'] = 4;
   $.ajax({
       type:"post",
       data:data,
       url:web_url+"getThirdPartyInfo",
       success:function (res) {
           var html = "";
           $.each(res.data,function (k,v) {
               html += '<li class="col-sm-3 col-xs-3 col-md-3 col-lg-3" >';
               html +=  '<div class="hostHead">';
               html +=      '<span class="hostImg">';
               html +=          '<img src='+ v.avatar[0] +' alt="">';
               html +=      '</span>';
               html +=      '<span class="edit" data-index="'+v.hostid+'">';
               html +=          '<img src="/Public/Home/images/editA.png"  alt="">';
               html +=      '</span>';
               html +=  '</div>';
               html +=  '<p class="hostName" title="">主办方名称：'+v.hostname+'</p>';
               html += '</li>'
           });
           $(".hostList").append(html);
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
           hostList = res.data;
           $(".edit").click(function () {
               var id = $(this).attr("data-index");
               location.href = "/Home/Cooper/editHost/id="+id;
           });
       }
   });
   //搜索主办方
    $(".searchBtn").click(function () {
        $(".list").css("display","none");
        $(".searchlist,.lookAll").css("display","block");
        $(".lookAll").click(function () {
            $(".list").css("display","block");
            $(".searchlist,.lookAll").css("display","none");
            $(".search input").val("");
        });
        var data = {};
        data['searchText'] = $(".search input").val();
        data['type'] = 2;
        data['userId'] = jsonUserInfo['userid'];
        $.ajax({
            type:"post",
            data:data,
            url:web_url+"searchThirdParty",
            success:function (res) {
                if (res.status == 0) {
                    if(res.data != ""){
                        $(".rehostList").html("");
                        var html = "";
                        $.each(res.data,function (k,v) {
                            html += '<li class="col-sm-3 col-xs-3 col-md-3 col-lg-3" >';
                            html +=  '<div class="hostHead">';
                            html +=      '<span class="hostImg">';
                            html +=          '<img src='+ v.avatar[0] +' alt="">';
                            html +=      '</span>';
                            html +=      '<span class="edit" data-index="'+v.hostid+'">';
                            html +=          '<img src="/Public/Home/images/editA.png"  alt="">';
                            html +=      '</span>';
                            html +=  '</div>';
                            html +=  '<p class="hostName" title="">主办方名称：'+v.hostname+'</p>';
                            html += '</li>'
                        });
                        $(".rehostList").append(html);
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
                        hostList = res.data;
                        $(".hostList  .edit").click(function () {
                            var id =  $(this).attr("data-index");
                            location.href = "/Home/Cooper/editHost/id="+id;
                        });
                    }else{
                        $(".rehostList").append("<li>暂无搜索结果</li>");
                    }
                }
            }
        })
    });
//    获取主办方品牌列表
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
            $("hostBrandList .edit").click(function () {
                var id =  $(this).attr("data-index");
                location.href = "/Home/Cooper/hostBrand/id="+id;
            });
        }
    });
});