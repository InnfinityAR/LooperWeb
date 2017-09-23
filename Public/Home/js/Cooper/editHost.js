$(function () {
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
    data['type'] = 4;
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"getDjById",
        success:function (res) {
            $("#userName").val(res.data.hostname);
            $("#intro").val(res.data.hostdes);
            $("#headImg").prop("src",res.data.avatar[0]);
            if(res.data.hostlogo != ""){
                $("#picImg").prop("src",res.data.hostlogo);
            }
            var images = res.data.images;
            if(images!=null){
                images =  images.split(';');
                $(".passAlbum").html("");
                var html ="";
                console.log(images);
                for(var i=0;i<images.length;i++){
                    if(images[i] != ""){
                        html += "<li><a ><img src="+ images[i] + "  /></a><div class='del'><img data-src="+ images[i] +" src='/Public/Home/images/delete.png'/></div></li>";
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
                        data['type'] = 2;
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

    // 更新主办方数据
    $(".submit").click(function () {
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            $(".submit").attr("disabed",true);
            $(".submit").css({"cursor":"not-allowed"});
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
            //合并历史和当前相册
            var photos = historyImages.concat(coverImages);
            var data = {};
            data['userId'] = jsonUserInfo['userid'];
            data['name'] = $("#userName").val();
            data['userType'] = 4;
            data['id'] = id;
            // data['tel'] = $("#contact").val();
            data['des'] = $("#intro").val();
            // data['email'] = $("#email").val();
            //图片转base64
            function getBase64Image(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                var dataURL = canvas.toDataURL("image/" + ext);
                return dataURL;
            }

            var hostlogo = $("#picImg").attr("src");
                if(hostlogo.indexOf('data:')>-1){
                    // base64 图片操作
                    data['hostLogo'] =  hostlogo.split(",")[1];
                }else if(hostlogo.indexOf('http://api')>-1){
                    //path 图片操作
                    data['hostLogo'] =  $("#previewLogo img").prop("src");
                }else {
                hostlogo = $('#picImg').attr('src');
                var image = new Image();
                image.src = hostlogo;
                var hostlogo_base64 = getBase64Image(image);
                data['hostLogo'] = hostlogo_base64.split(",")[1];
            }
            if($("#headImg").prop("src").indexOf('data:')>-1){
                data['avatar'] = $("#headImg").prop("src").split(",")[1];
            }else {
                data['avatar'] = $("#headImg").prop("src");
            }
            data['coverImages'] = photos;
            var headImgSrc = $("#headImg").prop("src");
            if(headImgSrc.indexOf('/Public/Home/images/defaultHead.png')>-1){
                layer.msg("请上传头像");
            }else if($(".upload_append_list").length>10){
                layer.msg("一次上传不能超过10张");
            }else{
                $.ajax({
                    type: "post",
                    data: data,
                    url:web_url+"completeUserData",
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
                                        layero.find(".layui-layer-content").text(msg+i+'秒后跳转至主办方列表页');
                                        if(!i) {
                                            layer.close(index);
                                            clearInterval(timer);
                                            location.href = "/Home/Cooper/hostList"
                                        }
                                        i--;
                                    };
                                    timer = setInterval(fn, 1000);
                                    fn();
                                }
                            });
                            $('#submit').removeAttr("disabled");
                            $("#submit").css({"cursor":"pointer"})
                        } if (res.status == 1) {
                            layer.msg("修改失败");
                        }
                    }
                })
            }
        }
    });

});