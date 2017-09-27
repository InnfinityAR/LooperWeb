/**
 * Created by yinshiru on 2017/8/31.
 */
$(function(){
    //获取所有活动
    var data ={};
    data['userId'] = jsonUserInfo['userid'];
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"getMyOfflineActivty",
        success:function (res) {
            if (res.status == 0) {
                var timestamp = Date.parse(new Date());
                console.log(res.data);
                var noEnd = [],
                    endAct = [];
                $.each(res.data, function (k, v){
                    var endtime = v.endtime;
                    endtime = new Date(Date.parse(endtime.replace(/-/g, "/")));
                    endtime = endtime.getTime();
                    if ((timestamp / 1000) > (endtime / 1000)) {
                        endAct.push(v);
                    }else {
                        noEnd.push(v)
                    }
                });
                function insertAct(name,genre) {
                    var html="";

                    for(var i=0;i<genre.length;i++){

                        html += '<li >';
                        html += '<div class="actHead">';
                        html += '<span class="actImg">';
                        html += '<img src=' + genre[i].photo + ' alt="">';
                        html += '</span>';
                        html += '<span class="place" title="' + genre[i].cname + ' ">' + genre[i].cname + '</span>';
                        if(genre==endAct){
                            html += '<span class="overAct">已结束</span>';
                        }
                        html += '<div>';
                        html += '<span class="edit" data-index="' + genre[i].activityid + '">';
                        html += '<img src="/Public/Home/images/editA.png"  alt="">';
                        html += '<span>编辑</span>';
                        html += '</span>';
                        html += '<span class="delAct" data-index="' + genre[i].activityid  + '">';
                        html += '<img src="/Public/Home/images/deleteA.png"  alt="">';
                        html += '<span>删除</span>';
                        html += '</span>';
                        html += '</div>';
                        html += '</div>';
                        html += '<p class="actName" title="' + genre[i].activityname + '">活动名称：' + genre[i].activityname + '</p>';
                        html += '<p class="acttime">' + '时间：' + genre[i].starttime.substring(0, 10) + '</p>';
                        html += '</li>'
                    }
                    $(name).append(html);
                }
                insertAct("#actListTab .actList",noEnd);
                insertAct("#historyListTab .actHistoryList",endAct);
                // 编辑hover事件
                $(".actHead").hover(function () {
                    $(this).children(".actImg").children("img").css({
                        "opacity": "0.5"
                    });
                    $(this).children(".actHead div").css({
                        "display": "block"
                    })
                }, function () {
                    $(this).children(".actImg").children("img").css({
                        "opacity": "1"
                    });
                    $(this).children(".actHead div").css({
                        "display": "none"
                    })
                });
                hostList = res.data;
                $(".edit").click(function () {
                    var id = $(this).attr("data-index");
                    location.href = "/Home/Cooper/editAct/id=" + id;
                });
                $(".delAct").click(function () {
                    var id = $(this).attr("data-index");
                    layer.confirm("确定删除该活动吗?", {btn: ["确定", "取消"]}, function () {
                        var data = {};
                        data['activityId'] = id;
                        $.ajax({
                            type: 'post',
                            data: data,
                            url: web_url + 'deleteOfflineInformation',
                            success: function () {
                                layer.msg("删除成功");
                                location.reload();
                            }
                        })
                    });
                });
            }
        }
    });
    //搜索活动
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
        data['type'] = 1;
        data['userId'] = jsonUserInfo['userid'];
        $.ajax({
            type:"post",
            data:data,
            url:web_url+"searchThirdParty",
            success:function (res) {
                if (res.status == 0) {
                    if(res.data != ""){
                        $(".reActList").html("");
                        var html = "";
                        var timestamp = Date.parse(new Date());
                        $.each(res.data, function (k, v) {
                            html += '<li >';
                            html += '<div class="actHead">';
                            html += '<span class="actImg">';
                            html += '<img src=' + v.photo + ' alt="">';
                            html += '</span>';
                            html += '<span class="place" title="' + v.cname + ' ">' + v.cname + '</span>';
                            var endtime = v.endtime;
                            endtime = new Date(Date.parse(endtime.replace(/-/g, "/")));
                            endtime = endtime.getTime();
                            if ((timestamp / 1000) > (endtime / 1000)) {
                                html += '<span class="overAct">已结束</span>';
                            }
                            html += '<div>';
                            html += '<span class="edit" data-index="' + v.activityid + '">';
                            html += '<img src="/Public/Home/images/editA.png"  alt="">';
                            html += '<span>编辑</span>';
                            html += '</span>';
                            html += '<span class="delAct" data-index="' + v.activityid + '">';
                            html += '<img src="/Public/Home/images/deleteA.png"  alt="">';
                            html += '<span>删除</span>';
                            html += '</span>';
                            html += '</div>';
                            html += '</div>';
                            html += '<p class="actName" title="' + v.activityname + '">活动名称：' + v.activityname + '</p>';
                            html += '<p class="acttime">' + '时间：' + v.starttime.substring(0, 10) + '</p>';
                            html += '</li>'
                        });
                        $(".reActList").append(html);
                        // 编辑hover事件
                        $(".actHead").hover(function () {
                            $(this).children(".actImg").children("img").css({
                                "opacity": "0.5"
                            });
                            $(this).children(".actHead div").css({
                                "display": "block"
                            })
                        }, function () {
                            $(this).children(".actImg").children("img").css({
                                "opacity": "1"
                            });
                            $(this).children(".actHead div").css({
                                "display": "none"
                            })
                        });
                        hostList = res.data;
                        $(".edit").click(function () {
                            var id = $(this).attr("data-index");
                            location.href = "/Home/Cooper/editAct/id=" + id;
                        });
                        $(".delAct").click(function () {
                            var id = $(this).attr("data-index");
                            layer.confirm("确定删除该活动吗?", {btn: ["确定", "取消"]}, function () {
                                var data = {};
                                data['activityId'] = id;
                                $.ajax({
                                    type: 'post',
                                    data: data,
                                    url: web_url + 'deleteOfflineInformation',
                                    success: function () {
                                        layer.msg("删除成功");
                                        location.reload();
                                    }
                                })
                            });
                        });
                    }else{
                        $(".reActList").append("<li>暂无搜索结果，<span>查看全部活动</span></li>");
                    }
                }
            }
        })
    })
});