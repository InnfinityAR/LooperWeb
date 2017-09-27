/**
 * Created by yinshiru on 2017/8/24.
 */
$(function () {
    //隐藏裁切头像1:2
    $(".bigLabel ").css("display","none");

    //        头像hover事件
    $(".deHead").hover(function () {
        $(".deHead img").css('opacity', '0.5');
        $(".deHead span").css('display', 'block');
    }, function () {
        $(".deHead img").css('opacity', '1');
        $(".deHead span").css('display', 'none');
    });
});
var jw; //经纬度
var address;
$(function () {
    $("#detailedAddr").blur(function () {
        address = $("#province10").val()+$("#city10").val()+$("#district10").val()+$("#detailedAddr").val();
        geocoder(address);
    });
    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    function geocoder(value) {
        var geocoder = new AMap.Geocoder({
            city: "全国", //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(value, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
    }
    function addMarker(i, d) {
        var marker = new AMap.Marker({
            map: map,
            position: [d.location.getLng(), d.location.getLat()]
        });
        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        marker.on("mouseover", function (e) {
            infoWindow.open(map, marker.getPosition());
        });
    }
    //地理编码返回结果展示
    function geocoder_CallBack(data) {
        // //地理编码结果数组
        var geocode = data.geocodes;
        for (var i = 0; i < geocode.length; i++) {
            //拼接输出html
            jw = geocode[i].location.getLng() + ", " + geocode[i].location.getLat();

        }
    }
    //提交事件
    $(".submit").click(function () {
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            $(".finish").attr("disabled",true);
            var historyImages = [];
            for(var i = 0; i<$(".passAlbum li").length;i++){
                historyImages.push($(".passAlbum li:eq("+i+") a img").prop("src"));
            }
            // 相册存为base64数组
            var coverImages = [];
            var imgList = $(".upload_append_list");
            for(var i = 0; i < imgList.length;i++){
                coverImages.push($('.upload_append_list:eq('+i+') .upload_image').prop("src").split(",")[1]);
            }
            var photos = historyImages.concat(coverImages);
            if($(".upload_append_list").length>10){
                layer.msg("一次上传不能超过10张");
            }else{
                var data = {};
                data['userId'] = jsonUserInfo['userid'];
                data['name'] = $("#userName").val();
                data['userType'] = 3;
                if($("#headImg").prop("src").indexOf('data:')>-1){
                    data['avatar'] = $("#headImg").prop("src").split(",")[1];
                }else {
                    data['avatar'] = $("#headImg").prop("src");
                }
                data['tel'] = $("#contact").val();
                data['des'] = $("#intro").val();
                data['email'] = $("#email").val();
                data['coverImages'] = photos;
                data['address'] = $("#province10").val()+ ","+ $("#city10").val()+ "," +$("#district10").val()+","+$("#detailedAddr").val();
                data['clubOther'] = $("#startTime").val()+"-"+$("#endTime").val();
                data['clubLocation'] = jw;
                $.ajax({
                    type: "post",
                    data: data,
                    url: web_url+"completeUserData",
                    success: function (res) {
                        if (res.status == 0) {
                            layer.msg("创建成功！", {
                                time : 5000,
                                shade: 0.6,
                                success: function(layero,index){
                                    var msg = layero.text();
                                    var i = 3;
                                    var timer = null;
                                    var fn = function() {
                                        layero.find(".layui-layer-content").text(msg+i+'秒后跳转至场馆列表页');
                                        if(!i) {
                                            layer.close(index);
                                            clearInterval(timer);
                                            location.href = "/Home/Cooper/venueList"
                                        }
                                        i--;
                                    };
                                    timer = setInterval(fn, 1000);
                                    fn();
                                }
                            });
                        }
                        if (res.status == 1) {
                            layer.msg("场馆名称已存在");
                        }
                        $(".finish").removeAttr("disabled");
                    }
                })
            }
        }
    });
});

