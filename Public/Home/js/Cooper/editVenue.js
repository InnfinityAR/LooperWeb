var jw;
var jw1;
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
        // var resultStr = "";
        // //地理编码结果数组
        var geocode = data.geocodes;
        for (var i = 0; i < geocode.length; i++) {
            //拼接输出html
            // resultStr += "<span style=\"font-size: 12px;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\">" + "<b>地址</b>：" + geocode[i].formattedAddress + "" + "&nbsp;&nbsp;<b>的地理编码结果是:</b><b>&nbsp;&nbsp;&nbsp;&nbsp;坐标</b>：" + geocode[i].location.getLng() + ", " + geocode[i].location.getLat() + "" +"</span>";
            // addMarker(i, geocode[i]);
            jw = geocode[i].location.getLng() + ", " + geocode[i].location.getLat();

        }
    }
    // 获取地址栏id
    var url = window.location.href;
    function getQueryString1(url, ref)
    {
        var str = url.substr(url.indexOf('?') + 1);
        if (str.indexOf('&') != -1) {
            var arr = str.split('&');
            for (i in arr) {
                if (arr[i].split('=')[0] == ref)
                    return arr[i].split('=')[1];
            }
        }
        else {
            return url.substr(url.indexOf('=') + 1)
        }
    }
    //调用方法
    id =getQueryString1(url,"id");
    //获取主办方数据
    var data = {};
    data['userId'] =jsonUserInfo['userid'];
    data['id'] = id;
    data['type'] = 2;
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"getDjById",
        success:function (res) {
            $("#userName").val(res.data.clubname);
            addr = res.data.clubaddress;
            var addrArr = addr.split(",");
            if(addrArr.length ==3){
                $("#province10").val(addrArr[0]);
                $("#province10").trigger("change");
                $("#city10").val(addrArr[1]);
                $("#city10").trigger("change");
                $("#district10").val(addrArr[2]);
            }
            if(addrArr.length == 4){
                $("#province10").val(addrArr[0]);
                $("#province10").trigger("change");
                $("#city10").val(addrArr[1]);
                $("#city10").trigger("change");
                $("#district10").val(addrArr[2]);
                $("#detailedAddr").val(addrArr[3]);
            }
            var time = res.data.clubother;
            var timeArr = time.split("-");
            $("#startTime").val(timeArr[0]);
            $("#endTime").val(timeArr[1]);
            $("#intro").val(res.data.clubdes);
            $("#headImg").prop("src",res.data.avatar[0]);
            $(".passAlbum").html("");
            jw1 = res.data.clublocation;
            var images = res.data.images;
            if(images!=""){
                images =  images.split(';');
                $(".passAlbum").html("");
                var html ="";
                for(var i=0;i<images.length;i++){
                    if(images[i] != "") {
                        html += "<li><a ><img src=" + images[i] + "  /></a><div class='del'><img data-src=" + images[i] + " src='/Public/Home/images/delete.png'/></div></li>"
                    }
                }
                $(".passAlbum").append(html);
                $(".passAlbum li").hover(function () {
                        $(this).find(".del").addClass("hover");
                        $(this).find(".del img").css({"display":"inherit"});
                    },function () {
                        $(".passAlbum li .del").removeClass("hover");
                        $(".passAlbum li .del img").css({"display":"none"});
                    }
                );
                $(".del img").click(function () {
                    var delUrl = $(this).attr("data-src");
                    var delImgParent =  $(this).parent().parent();
                    console.log(delImgParent);
                    layer.confirm("确定删除该图片吗?",{btn:["确定","取消"]},function(){
                        layer.closeAll('dialog');
                        var data={};
                        data['url'] = delUrl;
                        data['type'] = 3;
                        data['id'] = id;
                        $.ajax({
                            type:'post',
                            data:data,
                            url:web_url+'deleteImage',
                            success:function (res) {
                                if(res.status==0){
                                    delImgParent.remove();
                                }
                            }
                        })
                    });
                })
            }
        }
    });
    // 更新场馆数据
    $(".submit").click(function () {
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
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
                data['id'] = id;
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
                if( data['clubAddress'] == addr){
                    data['clubLocation'] = jw1;
                }else {
                data['clubLocation'] = jw;
                }
                $.ajax({
                    type: "post",
                    data: data,
                    url: web_url+"completeUserData",
                    success: function (res) {
                        if (res.status == 0) {
                            layer.msg("修改成功！", {
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
                        } if (res.status == 1) {
                            layer.msg("场馆名称已存在");
                        }
                    }
                })
            }
        }
    });
});