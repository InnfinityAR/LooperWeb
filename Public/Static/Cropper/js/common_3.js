/**
 * Created by yinshiru on 2017/7/17.
 * 上传活动 只传长图海报
 */
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

    // 获取上传类型
    var upLoadtype = $(".upLoadType").val();
    // console.log(upLoadtype);
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
    // console.log(123);
    if (type == 'big') {
        $.ajaxFileUpload({
            url: up_pic_url_one,
            secureuri: false,
            fileElementId: 'inputImage',
            type: 'POST',
            data: {imgfile: imgfile, },
            dataType: 'eval',
            success: function (data) {
                if (data !== "false") {

                    $("#imgurl").val(data);
                    old_url = data;
                    //_the_btn.attr('src',data);
                    // dialogOpen();
                }
            }
        });
        $(".aspectLabel").eq(1).click();
        setImageCropper("one", 640, 1136, "loop");
        // setTimeout(function () {
        //     dialogOpen();
        //
        // }, 800)
    }

}
$(function () {
    // 上传头像
    $(document).on("click", ".uploadBtn", function () {
        if ($(".upload_input").val()) {
            layer.confirm("确定上传新图片吗?此操作会删除原图片", {btn: ["确定", "取消"]}, function () {
                layer.closeAll();
                if ($(".upload_input ").val()) {
                    deleteImage($(".upload_input ").val());
                    $(".upload_input ").val("");
                }
                // if ($(".bigDiv input").val()) {
                //     deleteImage($(".bigDiv input").val());
                // }
                $("#inputImage").click();
            });
        } else {

            $("#inputImage").click();
        }
    });
    $("#inputImage").change(function () {
        // 第一次上传图片;
        setImageCropper("one", 640, 1136, "loop");
        $(".aspectLabel").eq(1).click();
        var imgfile = $("input[name='imgfile']").val();//图片保存文件夹
        $(".cropType").val("one"); //设置裁剪图片的类型
        $.ajaxFileUpload({
            url: up_pic_url_one,
            secureuri: false,
            fileElementId: 'inputImage',
            type: 'POST',
            data: {imgfile: imgfile, },
            dataType: 'eval',
            success: function (data) {
                if (data !== "false") {
                    picurl = data;
                    old_url = data;
                    $("#imgurl").val(data);
                    //_the_btn.attr('src',data);
                    $(".image-dialog-open").click();
                }
            }
        });
    })

    //图片转base64
    function getBase64() {
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;
        }
        var image = new Image();
        image.crossOrigin = '';
        image.src = $("#imgBill").prop("src");
        // console.log(image.src);
        image.onload = function(){
            var base64 = getBase64Image(image);
            image.src = $("#imgBill").prop("src",base64);
            // console.log(image.src);
            // console.log(base64);
        }

    }
    //截图保存
    $(document).on("click", "#btn_save_crop", function () {
        var x = $("#dataX").val();
        var y = $("#dataY").val();
        var w = $("#dataWidth").val();
        var h = $("#dataHeight").val();
        var targw = $("#dataSizeW").val();
        var targh = $("#dataSizeH").val();
        var src = $("#imgurl").val();
        var cropType = $(".cropType").val();
        var cropPicId = $(".manyPicId").val();
        $.ajax({
            url: imgcrop_url,
            type: 'POST',
            data: {x: x, y: y, w: w, h: h, src: src, targw: targw, targh: targh},
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
                            $(".upload_input").val(data);
                            $(".bill img").attr("src", data);
                            // type = "big";
                            getBase64();
                        }
                        if(old_url){
                            deleteImage(old_url);
                        }

                    }

                }
                closePopupCallBack(type);
            }
        });
    });

    //上传取消
    $("#btn_cancel").click(function () {
        type = "small";
        picurl = "";
        if ($(".upload_input ").val()) {
            $(".upload_input ").val("");
            deleteImage($(".upload_input ").val());
        }
        $(".deHead img").attr("src","/Public/Home/images/defaultHead.png");
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

