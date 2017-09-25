/**
 * Created by yinshiru on 2017/7/9.
 */
$(function () {
    //初始化日期
    $("#SDate,#EDate").datetimepicker({
        forceParse: true,
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: false,
        startView: 2,
        minView: 2,
        maxView: 'decade',
        // pickDate: false,
        bootcssVer:3
    });
    //选择日期约束
    $("#SDate").datetimepicker().on("click", function (ev) {
           $("#SDate").datetimepicker("setEndDate", $("#EDate").val());
      });
       $("#EDate").datetimepicker().on("click", function (ev) {
           $("#EDate").datetimepicker("setStartDate", $("#SDate").val());
    });
    //初始化时间控件
    $("#sTime,#eTime").datetimepicker({
        format: 'hh:ii',
        language: 'zh-CN',
        autoclose: true,
        forceParse: true,
        startView: 1,
        minView: 0,
        maxView: "hour",
        showMeridian:0
    });
//    结束日期为空结束时间不能选择
    $("#eTime").focus(function () {
       if($("#EDate").val()==""){
           $("#eTime").attr("disabled",true);
           $("#eTime").val("");
       }
    });
    $("#EDate").change(function () {
        if($("#EDate").val() != ""){
            $("#eTime").attr("disabled",false);
        }
    });

//    清除所选时间
    function clearTime(name) {
        if ($(name).val() != "") {
            $(name).val("");
        }
    }
    $(".startD span").on("click",function(){
        clearTime("#SDate")
    });
    $(".endD span").click(function () {
        clearTime("#EDate")
    });
    $(".startT span").on("click",function(){
        clearTime("#sTime")
    });
    $(".endT span").on("click",function(){
        clearTime("#eTime")
    });
    //标签list
    var dataList = [
        { id: 'FESTIVAL', text: 'FESTIVAL' },
        { id: 'EDM', text: 'EDM' },
        { id: 'HOUSE', text: 'HOUSE' },
        { id: 'DISCO', text: 'DISCO' },
        { id: 'TRANCE', text: 'TRANCE' },
        { id: 'TECHNO', text: 'TECHNO' },
        { id: 'HARDCORE', text: 'HARDCORE' },
        { id: 'INDUSTRIRL', text: 'INDUSTRIRL' },
        { id: 'DOWNTEMPO', text: 'DOWNTEMPO' },
        { id: 'HIP-HOP', text: 'HIP-HOP' },
        { id: 'GARAGE', text: 'GARAGE' },
        { id: 'BREAKS', text: 'BREAKS' }
    ];
    $("#tag").select2({
        data: dataList,
        placeholder: "请选择标签",
        allowClear: true
    });
    //请求主办方
    $.ajax({
        type:"post",
        url:web_url+"getHost",
        success:function (res) {
            // $("#hostS").html("");
            var html = "";
            $.each(res.host,function (k,v) {
                html += "<option value="+ v.hostid +">" + v.hostname + "</option>";
            });
            $("#hostS").append(html);
        }
    });
    //请求场馆
    var data ={};
    data['userId'] = jsonUserInfo['userid'];
    $.ajax({
        type:"post",
        url:web_url+"getClub",
        data: data,
        success:function (res) {
            // $("#venueS").html("");
            var html = "";
            $.each(res.club,function (k,v) {
                html += "<option value="+ v.clubid +">" + v.clubname + "</option>";
            });
            $("#venueS").append(html);
        }
    });
    //请求dj
    $.ajax({
        type:"post",
        url:web_url+"getDjs",
        data: data,
        success:function (res) {
            // $("#djS").html("");
            var html = "";
            $.each(res.dj,function (k,v) {
                html += "<option value="+ v.djid +">" + v.djname + "</option>";
            });
            $("#djS").append(html);
        }
    });
//    请求家族
    $.ajax({
        type:"post",
        url:web_url+"getRaver",
        data: data,
        success:function (res) {
            // $("#familyS").html("");
            var html = "";
            $.each(res.raver,function (k,v) {
                html += "<option value="+ v.raverid +">" + v.ravername + "</option>";
            });
            $("#familyS").append(html);
        }
    });
    //上传视频按钮更换
    // $("#moreUpload").css({
    //     "position": "absolute",
    //     "opacity": " 0",
    //     "filter": "Alpha(opacity=0)"
    // });
    // $("#filePicker").click(function () {
    //     $("#moreUpload").css({
    //         "position": "relative",
    //         "opacity": " 1",
    //         "filter": "Alpha(opacity=0)"
    //     });
    //     $("#filePicker").css({
    //         "position": "absolute",
    //         "opacity": " 0",
    //         "filter": "Alpha(opacity=0)"
    //     });
    // });
    //删除视频
    // $(document).on("click", ".trash", function () {
    //     $(this).parent().remove();
    // });

    // 根据主办方id选择厂牌
    $(".host").off().on("change",function () {
        var chooseHost = $("#hostS").val();
        if(chooseHost!=""&&chooseHost!=null){
            $(".cBrandCon").css("display","block");
            $(".chooseBrand").html("");
            var data = {};
            data['hostid'] = chooseHost;
            $.ajax({
                type:"post",
                data:data,
                url:web_url+"getBrandByHostId",
                async:false,
                success:function (res) {
                    for(var i=0;i<res.data.length;i++){
                        var html = "";
                        html += '<li class="col-sm-6 ">';
                        // html +=     '<div>';
                        html +=         '<img src="'+ res.data[i]+'" alt="">';
                        // html +=     '</div>';
                        html +=     '<span class="checkState" >';
                        html +=         '<img src="/Public/Home/images/checked.png" alt="">';
                        html +=     '</span>';
                        html += '</li>';
                        $(".chooseBrand").append(html)
                    }
                }
            });
            //选择厂牌效果
            $(".chooseBrand > li").attr("data-isCheck","false");
            $(".chooseBrand > li").click(function () {
                $(this).siblings().children(".checkState").removeClass("defaultCheck");
                $(this).siblings().attr("data-isCheck","false");
                $(this).siblings().children("img").removeClass("checkImg");
                if($(this).attr("data-isCheck")=="false"){
                    $(this).children(".checkState").addClass("defaultCheck");
                    $(this).attr("data-isCheck","true");
                    $(this).children("img").addClass("checkImg")
                }else {
                    $(this).children(".checkState").removeClass("defaultCheck");
                    $(this).attr("data-isCheck","false");
                }
            });
        }else {
            $(".cBrandCon").css("display","none");
        }
    });

    $(".finish").click(function () {
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            if($("#SDate").val()==""){
                layer.msg("请选择活动开始日期");
            }else if($("#EDate").val()=="" && $("#eTime").val() != ""){
                layer.msg("请选择结束日期");
            }else if($(".imgBill").prop("src").indexOf('/Public/Home/images/defaultImgH.png')>-1){
                layer.msg("请上传海报");
            }else if(parseInt($(".money1").val())> parseInt($(".money2").val())){
                layer.msg("请输入正确的价格范围");
            }else if($(".upload_append_list").length>10){
                layer.msg("一次上传不能超过10张");
            }else {
                //海报转base64并存为数组
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
                //小图转base64
                var img = $(".smallDiv img").prop("src");
                var image = new Image();
                image.src = img;
                var small_base64 = getBase64Image(image);
                //大图转base64
                var img1 = $(".bigDiv img").prop("src");
                var image1 = new Image();
                image1.src = img1;
                var big_base64 = getBase64Image(image1);
                // 添加海报两张图存为数组
                var newcoverImages = [];
                newcoverImages.push(small_base64.split(",")[1], big_base64.split(",")[1]);
                // newcoverImages.reverse();
                // 相册存为base64数组
                var Images = [];
                var imgList1 = $(".upload_append_list");
                for (var i = 0; i < imgList1.length; i++) {
                    Images.push($('.upload_append_list:eq(' + i + ') .upload_image').prop("src").split(",")[1])
                }
                //标签数组
                var tag = [];
                tag.push($("#tag").val());
                //主办方数组
                var host = $("#hostS").val();
                // var hostARR = [];
                // hostARR.push(host);
                //参与艺人数组
                var dj = $("#djS").val();
                //家族数组
                var rf = $("#familyS").val();
                // 时间处理
                var sdate,edate;  //sdate开始时间  edate结束时间
                sdate = $("#SDate").val() + " " +$("#sTime").val();
                //时间转为时间戳
                sdate = new Date(Date.parse(sdate.replace(/-/g, "/")));
                sdate = sdate.getTime();
                //结束时间不选择默认加一天
                if($("#EDate").val()==""){
                    edate = sdate + 86400000;
                }
                if($("#EDate").val()!=""){
                    edate = $("#EDate").val() +  " " + $("#eTime").val();
                    edate = new Date(Date.parse(edate.replace(/-/g, "/")));
                    edate = edate.getTime();
                }
                var club = $("#venueS").val();
                // 城市
                var city =  $("#city").val();
                var cname = city.split("·")[0];
                var data1 = {};
                data1['userId'] = jsonUserInfo['userid'];
                data1['name'] = $("#userName").val();
                data1['starttime'] = sdate;
                data1['endtime'] = edate;
                data1['city'] = city;
                data1['cname'] = cname;
                data1['tag'] = tag;
                var money;
                if($('.money2').val()!="" && $('.money2').val()!=$('.money1').val()){
                    money = $("#coin").val()+$('.money1').val()+ '-'+$('.money2').val();
                }else{
                    money = $("#coin").val()+$('.money1').val()
                }
                if(money == $("#coin").val()+'0'){
                    money = "免费"
                }
                data1['price'] = money;
                data1['shareIcon'] = big_base64.split(",")[1];
                data1['coverImages'] = newcoverImages;
                data1['images'] = Images;
                data1['DJ'] = dj;
                data1['rf'] = rf;
                data1['host'] = host;
                data1['club'] = club;
                data1['htmlURL'] = $(".h5").val();
                data1['ticketURL'] = $(".ticket").val();
                data1['brandLogo'] = $(".checkImg").attr("src");
                $.ajax({
                    type: "post",
                    data: data1,
                    url: web_url+"createOfflineInformation",
                    success:function (res) {
                        if (res.status == 0) {
                            layer.msg("创建成功！", {
                                time : 5000,
                                shade: 0.6,
                                success: function(layero,index){
                                    var msg = layero.text();
                                    var i = 3;
                                    var timer = null;
                                    var fn = function() {
                                        layero.find(".layui-layer-content").text(msg+i+'秒后跳转至活动列表页');
                                        if(!i) {
                                            layer.close(index);
                                            clearInterval(timer);
                                            location.href = "/Home/Cooper/actList"
                                        }
                                        i--;
                                    };
                                    timer = setInterval(fn, 1000);
                                    fn();
                                }
                            });
                        }
                        if (res.status == 1) {
                            layer.msg("保存失败");
                        }
                    }
                })
            }
        }
    });
});