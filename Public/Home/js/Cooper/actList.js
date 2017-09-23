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
                    html += '<span class="edit" data-index="' + k + '">';
                    html += '<img src="/Public/Home/images/editA.png"  alt="">';
                    html += '<span>编辑</span>';
                    html += '</span>';
                    html += '<span class="delAct" data-index="' + k + '">';
                    html += '<img src="/Public/Home/images/deleteA.png"  alt="">';
                    html += '<span>删除</span>';
                    html += '</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '<p class="actName" title="' + v.activityname + '">活动名称：' + v.activityname + '</p>';
                    html += '<p class="acttime">' + '时间：' + v.starttime.substring(0, 10) + '</p>';
                    html += '</li>'
                });
                $(".actList").append(html);
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
                    var index = $(this).attr("data-index");
                    var id = hostList[index].activityid;
                    location.href = "/Home/Cooper/editAct/id=" + id;
                });
                $(".delAct").click(function () {
                    var index = $(this).attr("data-index");
                    var id = hostList[index].activityid;
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


});