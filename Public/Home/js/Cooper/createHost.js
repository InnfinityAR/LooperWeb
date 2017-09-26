/**
 * Created by yinshiru on 2017/8/4.
 */
$(function () {
    //        头像hover事件
    $(".deHead").hover(function () {
        $(".deHead img").css('opacity', '0.5');
        $(".deHead span").css('display', 'block');
    }, function () {
        $(".deHead img").css('opacity', '1');
        $(".deHead span").css('display', 'none');
    });
    //主办方旗下品牌添加
    $(".saveBrand").click(function(){
        $(".saveBrand"). removeAttr("data-dismiss");
        if($("#brandName").val()==""){
            layer.msg("请填写品牌名称");
        }else if($(".uploadBrand img").length==0){
            layer.msg("请上传品牌Logo");
        }else{
            $(".saveBrand").attr("data-dismiss","modal");
            var brandName = $("#brandName").val();
            var brandLogo = $(".uploadBrand img").attr("src");
            $(".addBrandList").append(
                "<li class='addBrandLi'>"+
                    "<div class='brandData'>"+
                        "<span class='hostBrandName'>"+brandName+"</span>"+
                        "<img class='brandImg' src="+brandLogo+" alt=''>"+
                    "</div>"+
                    "<span class='delBrand'>"+
                        "<img src='/Public/Home/images/del.png' alt=''>"+
                    "</span>"+
                "</li>"
            );

        }
        // 关闭model强制清除数据
        $("#addHostBrandModel").on("hidden.bs.modal", function() {
            $("#brandName").val("");
        });
        //删除添加厂牌事件
        $(".delBrand").click(function () {
            var thisDel = $(this).parent('.addBrandLi');
            layer.confirm("确定删除该活动吗?", {btn: ["确定", "取消"]}, function () {
                layer.closeAll('dialog');
                thisDel.remove();
            });
        });
    });

    //提交事件
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
            //合并历史和当前相册
            var photos = historyImages.concat(coverImages);
            var data = {};
            data['userId'] = jsonUserInfo['userid'];
            data['name'] = $("#userName").val();
            data['userType'] = 4;
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
                // hostlogo = $('#picImg').attr('src');
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
            var brandArr = []; //主办方旗下品牌
            for(var i = 0 ; i < $("li.addBrandLi").length;i++){
                var branName1 = $("li.addBrandLi:eq("+i+") span").text();
                var brandLogo1 = $("li.addBrandLi:eq("+i+") img").attr("src").split(",")[1];
                brandArr[i] = [brandLogo1,branName1]
            }
            data['brand'] = brandArr;
            data['coverImages'] = photos;
            // data['clubAddress'] = $(".inp").val();
            var headImgSrc = $("#headImg").prop("src");
            // var hostLogoSrc = $("#picImg").prop("src");
            if(headImgSrc.indexOf('/Public/Home/images/defaultHead.png')>-1){
                layer.msg("请上传头像");
            }else if($(".upload_append_list").length>10){
                layer.msg("一次上传不能超过10张");
            }else{
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
                        } if (res.status == 1) {
                            layer.msg("主办方名称已存在");
                        }
                    }
                })
            }
        }
    });
});