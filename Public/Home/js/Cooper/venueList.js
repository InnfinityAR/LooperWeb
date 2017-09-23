/**
 * Created by yinshiru on 2017/8/29.
 */
$(function () {
    var venueList;
    var data ={};
    data['userId'] = jsonUserInfo['userid'];
    data['type'] = 3;
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"getThirdPartyInfo",
        success:function (res) {
            if(res.status==0){
                var html = "";
                $.each(res.data,function (k,v) {
                    html += '<li class="col-sm-3 col-xs-3 col-md-3 col-lg-3">';
                    html +=  '<div class="hostHead">';
                    html +=      '<span class="hostImg">';
                    html +=          '<img src='+ v.avatar[0] +' alt="">';
                    html +=      '</span>';
                    html +=      '<span class="edit" data-index="'+k+'">';
                    html +=          '<img src="/Public/Home/images/editA.png"  alt="">';
                    html +=      '</span>';
                    html +=  '</div>';
                    html +=  '<p class="hostName" title="">'+v.clubname+'</p>';
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
                venueList = res.data;
                $(".edit").click(function () {
                    var index = $(this).attr("data-index");
                    var id = venueList[index].clubid;
                    // alert(id);
                    location.href = "/Home/Cooper/editVenue/id="+id;
                });
            }
        }
    });
    // 搜索场馆
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
        data['type'] = 3;
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
                            html += '<li class="col-sm-3 col-xs-3 col-md-3 col-lg-3">';
                            html +=  '<div class="hostHead">';
                            html +=      '<span class="hostImg">';
                            html +=          '<img src='+ v.avatar[0] +' alt="">';
                            html +=      '</span>';
                            html +=      '<span class="edit" data-index="'+k+'">';
                            html +=          '<img src="/Public/Home/images/editA.png"  alt="">';
                            html +=      '</span>';
                            html +=  '</div>';
                            html +=  '<p class="hostName" title="">'+v.clubname+'</p>';
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
                        venueList = res.data;
                        $(".edit").click(function () {
                            var index = $(this).attr("data-index");
                            var id = venueList[index].clubid;
                            // alert(id);
                            location.href = "/Home/Cooper/editVenue/id="+id;
                        });
                    }else{
                        $(".rehostList").append("<li>暂无搜索结果</li>");
                    }
                }
            }
        })
    })
});