/**
 * Created by yinshiru on 2017/9/21.
 */
$(function () {
    //初始化主办方控件
    $('#hostS').select2({
        placeholder: "请选择主办方",
        allowClear: true
    });

    //请求主办方
    $.ajax({
        type:"post",
        url:web_url+"getHost",
        async:false,
        success:function (res) {
            // $("#hostS").html("");
            var html = "";
            $.each(res.host,function (k,v) {
                html += "<option value="+ v.hostid +">" + v.hostname + "</option>";
            });
            $("#hostS").append(html);
        }
    });

    var url = window.location.href;
    //判断url中是否有id
    var idflag;
    if(url.indexOf("id=")>-1){
        idflag = true;
    }else{
        idflag = false;
    }
    //调用方法
    id =getQueryString1(url,"id");
     if(idflag==true){
         //渲染页面数据
         var data = {};
         data['brandid'] = parseInt(id);
         $.ajax({
             type:"post",
             data:data,
             url:web_url+"getBrandById",
             success:function (res) {
                 if(res.status==0){
                     $("#userName").val(res.data.brandname);
                     $(".showBrand img").attr("src",res.data.avatar);
                     //主办方
                     var host = res.data.hostid;
                     for(var i=0;i<$("#hostS option").length;i++)
                     {
                         if($("#hostS option").eq(i).val() == host){
                             $("#hostS").val($("#hostS option").eq(i).val()).trigger('change');
                         }
                     }
                 }
             }
         });
        // 更新品牌
         $(".submit").click(function () {
             var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
             var flag = bootstrapValidator.validate().isValid();
             if (flag) {
                 var hostlogo = $(".uploadImgDiv img").attr("src");
                 var data = {};
                 data['brandId'] = parseInt(id);
                 data['name'] = $("#userName").val();
                 var hostlogo = $("#picImg").attr("src");
                 if($(".uploadImgDiv img").length==0){
                     data['avatar'] = hostlogo;
                 }else{
                     data['avatar'] = $(".uploadImgDiv img").attr("src").split(",")[1];
                 }
                 data['hostId'] = $("#hostS").val();
                 $.ajax({
                     type:"post",
                     data:data,
                     url: web_url+"updateBrand",
                     success:function(res){
                         if(res.status == 0){
                             layer.msg("更新成功！", {
                                 time : 5000,
                                 shade: 0.6,
                                 success: function(layero,index){
                                     var msg = layero.text();
                                     var i = 3;
                                     var timer = null;
                                     var fn = function() {
                                         layero.find(".layui-layer-content").text(msg+i+'秒后跳转至主办方品牌列表页');
                                         if(!i) {
                                             layer.close(index);
                                             clearInterval(timer);
                                             location.href = "/Home/Cooper/hostBrandList"
                                         }
                                         i--;
                                     };
                                     timer = setInterval(fn, 1000);
                                     fn();
                                 }
                             });
                         }else{
                             layer.msg("更新失败")
                         }
                     }
                 })
             }
         })
     }
     else{
         //创建主办方
         $(".submit").click(function () {
             var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
             var flag = bootstrapValidator.validate().isValid();
             if (flag) {
                 if($(".fileinput-exists img").length == 0 ){
                     layer.msg("请上传主办方头像");
                 }else{
                     var hostlogo = $(".uploadImgDiv img").attr("src");
                     var data = {};
                     data['userId'] = jsonUserInfo['userid'];
                     data['name'] = $("#userName").val();
                     data['avatar'] = hostlogo.split(",")[1];
                     data['hostId'] = $("#hostS").val();
                     $.ajax({
                         type:"post",
                         data:data,
                         url: web_url+"createBrand",
                         success:function(res){
                             if(res.status == 0){
                                 layer.msg("创建成功！", {
                                     time : 5000,
                                     shade: 0.6,
                                     success: function(layero,index){
                                         var msg = layero.text();
                                         var i = 3;
                                         var timer = null;
                                         var fn = function() {
                                             layero.find(".layui-layer-content").text(msg+i+'秒后跳转至主办方品牌列表页');
                                             if(!i) {
                                                 layer.close(index);
                                                 clearInterval(timer);
                                                 location.href = "/Home/Cooper/hostBrandList"
                                             }
                                             i--;
                                         };
                                         timer = setInterval(fn, 1000);
                                         fn();
                                     }
                                 });
                             }else{
                                 layer.msg("创建失败")
                             }
                         }
                     })
                 }
             }
         })
     }

     //函数

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
    // 获取地址栏id
    function getQueryString1(url, ref){
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
});