function setImageCropper(type, w, h, file) {
    if (type) {
        $(".upLoadType").val(type);
    }
    if (w) {
        $("#dataSizeW").val(w);
    }
    if (h) {
        $("#dataSizeH").val(h);
    }
    if (file) {
        $("input[name='imgfile']").val(file);
        changeFileName(file);
    }

    //获取上传类型
    var upLoadtype = $(".upLoadType").val();
    if (upLoadtype == 'one') {
        $(".uoload_one").show();
    }
    if (upLoadtype == 'many') {
        $(".uoload_many").show();
    }
    if (upLoadtype == 'all') {
        $(".uoload_one").show();
        $(".uoload_many").show();
    }

}
var type = "small";
var picurl;
function closePopupCallBack(type) {
    var imgfile = $("input[name='imgfile']").val();//图片保存文件夹
    $(".cropType").val("one"); //设置裁剪图片的类型
    if (type == 'big') {
        $.ajaxFileUpload({
            url: up_pic_url_one,
            secureuri: false,
            fileElementId: 'inputImage',
            type: 'POST',
            data: {imgfile: imgfile},
            dataType: 'eval',
            async: false,
            success: function (data) {
                if (data !== "false") {
                    $("#imgurl").val(data);
                    old_url = data;
                    //_the_btn.attr('src',data);
                    // dialogOpen();
                }
            }
        });
        setTimeout(function () {
            dialogOpen();
        }, 800);
        setImageCropper("all", 250, 250, "loop");
        //第二次弹出裁切控件提示文字
        $("#btn_save_crop").text("完成");
        $("#myModalLabel").html("活动海报（方）裁切</span>");
        $("label.smallLabel").css("display","block");
        $("label.bigLabel").css("display","none");
        $(".smallLabel").click();
        // setImageCropper("all", 640, 1136, "loop");
    }

}
$(function () {

    // 点击按钮上传图片
    $(document).on("click", ".uploadBtn", function () {
        if ($(".smallDiv input").val()|| $(".bigDiv input").val()) {
            layer.confirm("确定上传新图片吗?此操作会删除原图片", {btn: ["确定", "取消"]}, function () {
                layer.closeAll();
                if ($(".smallDiv input").val()) {
                    deleteImage($(".smallDiv input").val());
                    $(".smallDiv input").val("");
                }
                if ($(".bigDiv input").val()) {
                    deleteImage($(".bigDiv input").val());
                    $(".bigDiv input").val("");
                }
                $("#inputImage").click();
            });
        } else {
            $("#inputImage").click();
        }
    });

    $("#inputImage").change(function () {
        // 第一次上传图片;
            setImageCropper("all", 640, 1136, "loop");
            $(".bigLabel").click();
            // setImageCropper("all", 400, 400, "loop");
            // $(".smallLabel").click();
            var imgfile = $("input[name='imgfile']").val();//图片保存文件夹
            $(".cropType").val("one"); //设置裁剪图片的类型
            $.ajaxFileUpload({
                url: up_pic_url_one,
                secureuri: false,
                fileElementId: 'inputImage',
                type: 'POST',
                data: {imgfile: imgfile },
                dataType: 'eval',
                success: function (data) {
                    if (data !== "false") {
                        picurl = data;
                        old_url = data;
                        $("#imgurl").val(data);
                        //_the_btn.attr('src',data);
                        // dialogOpen();
                        $(".image-dialog-open").click();
                        //第一次弹出裁切控件提示文字
                        $("#btn_save_crop").text("下一步");
                        $("label.smallLabel").css("display","none");
                        $("label.bigLabel").css("display","block");
                        $("#myModalLabel").html("活动海报（长）裁切&nbsp;&nbsp; &nbsp; &nbsp;<span style='color: #d9534f'>注：点击下一步后将进行第二次裁切</span>")
                    }
                }
            });
    });
    //截图保存
    $("#btn_save_crop").click(function () {
        var imgData ={};
        imgData['x'] = $("#dataX").val();
        imgData['y'] = $("#dataY").val();
        imgData['w'] = $("#dataWidth").val();
        imgData['h'] = $("#dataHeight").val();
        imgData['targw'] = $("#dataSizeW").val();
        imgData['targh'] = $("#dataSizeH").val();
        imgData['src'] = $("#imgurl").val();
        var cropType = $(".cropType").val();
        var cropPicId = $(".manyPicId").val();
        $.ajax({
            url: imgcrop_url,
            type: 'POST',
            data:imgData,
             dataType: 'json',
            success: function (data) {
                if (data !== "false") {
                    dialogClose();
                    if (cropType == 'one') {
//                        if ( (oldUrl != "/Public/Home/images/music.jpeg")) { //删除原图
//                            deleteImage(oldUrl);
////                            $("#oldImgUrl").val(data);
//                        }
                        if (type == 'small') {
                            $(".smallDiv input").val(data);
                            $(".smallDiv img").attr("src", data);
                            type = "big";

                        } else if (type == "big") {
                            $(".bigDiv input").val(data);
                            $(".bigDiv img").attr("src", data);
                            type = 'small';
                            picurl = "";
                        }
                        if(old_url){
                            deleteImage(old_url);
                        }
                    }

                }
                closePopupCallBack(type);
            }
            // error:function (data) {
            //     console.log(data);
            // }
        });
    });
    //截图保存
    // $(document).on("click", "#btn_save_crop", function () {
    // })
    
    //上传取消
    $("#btn_cancel").click(function () {
        type = "small";
        picurl = "";
        if ($(".smallDiv input").val()) {
            $(".smallDiv input").val("");
            deleteImage($(".smallDiv input").val());
        }
        if ($(".bigDiv input").val()) {
            $(".bigDiv input").val("");
            deleteImage($(".bigDiv input").val());
        }
        $(".smallDiv img").attr("src","/Public/Home/images/defaultImg.png");
        $(".bigDiv img").attr("src","/Public/Home/images/defaultImgH.png");
        dialogClose();
    });
});

//打开截图窗口
function dialogOpen() {
    if ($("#image-crop").css('display') == "none") {
        $(".image-dialog-open").click();
    }
}
//关闭截图窗口
function dialogClose() {
    if ($("#image-crop").css('display') == "block") {
        $(".image-dialog-open").click();
    }
}

//删除图片
function deleteImage(imgurl) {
    $.ajax({
        url: imgdel_url,
        type: 'POST',
        data: {imgurl: imgurl},
        dataType: 'json',
        success: function (data) {

        }});
}

