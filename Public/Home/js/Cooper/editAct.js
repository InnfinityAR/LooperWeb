/**
 * Created by yinshiru on 2017/8/31.
 */
$(function () {
    // 获取地址栏id
    var url = window.location.href;
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
    //调用方法
    id =getQueryString1(url,"id");
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
    // 结束日期为空结束时间不能选择
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
    // 清除所选时间
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
    var dataList = [
        { id: 'FESTIVAL', text: 'FESTIVAL' },
        { id: 'EDM', text: 'EDM' },
        { id: 'HOUSE', text: 'HOUSE' },
        { id: 'TRAP', text: 'TRAP' },
        { id: 'TRANCE', text: 'TRANCE' },
        { id: 'TECHNO', text: 'TECHNO' },
        { id: 'HIP-HOP', text: 'HIP-HOP' },
        { id: 'DUBSTEP ', text: 'DUBSTEP ' },
        { id: 'TRIP-HOP ', text: 'TRIP-HOP ' },
        { id: 'TROPICAL ', text: 'TROPICAL' },
        { id: 'HARDSTYLE', text: 'HARDSTYLE' },
        { id: 'BASS', text: 'BASS' },
        { id: 'HARDCORE', text: 'HARDCORE' },
        { id: 'INDUSTRIRL', text: 'INDUSTRIRL' },
        { id: 'DOWNTEMPO', text: 'DOWNTEMPO' },
        { id: 'GARAGE', text: 'GARAGE' },
        { id: 'BREAKS', text: 'BREAKS' },
        { id: 'DISCO', text: 'DISCO' }
    ];
    //标签类型List
    var tagTypeList = [
        { id: '音乐节', text: '音乐节' },
        { id: '仓库派对', text: '仓库派对' },
        { id: '夜店演出', text: '夜店演出' }
    ];
    $("#tagType").select2({
        data: tagTypeList,
        placeholder: "请选择类型",
        allowClear: true
    });
    $("#tag").select2({
        data: dataList,
        placeholder: "请选择标签",
        allowClear: true
    });
    // 请求主办方
    $.ajax({
        type:"post",
        url:web_url+"getHost",
        async:false,
        success:function (res) {
            $("#hostS").html("");
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
        async:false,
        success:function (res) {
            var html = "";
            $.each(res.club,function (k,v) {
                html += "<option value="+ v.clubid +">" + v.clubname + "</option>";
            });
            $("#venueS").append(html);
        }
    });
    // 请求dj
    var data1 = {};
    data1['userId'] = jsonUserInfo['userid'];
    $.ajax({
            type:"post",
            url:web_url+"getDjs",
            data: data1,
            async:false,
            success:function (res) {
                $("#djS").html("");
                var html = "";
                $.each(res.dj,function (k,v) {
                    html += "<option value="+ v.djid +">" + v.djname + "</option>";
                });
                $("#djS").append(html);
            }
        });
    // 请求家族
    $.ajax({
        type:"post",
        url:web_url+"getRaver",
        data: data,
        async:false,
        success:function (res) {
            $("#familyS").html("");
            var html = "";
            $.each(res.raver,function (k,v) {
                html += "<option value="+ v.raverid +">" + v.ravername + "</option>";
            });
            $("#familyS").append(html);
        }
    });
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
                    if(res.data == ""){
                        $(".cBrandCon").css("display","none");
                    }else{
                        for(var i=0;i<res.data.length;i++){
                            var html = "";
                            html += '<li class="col-sm-6 ">';
                            html +=     '<img src="'+ res.data[i]+'" alt="">';
                            html +=     '<span class="checkState" >';
                            html +=         '<img src="/Public/Home/images/checked.png" alt="">';
                            html +=     '</span>';
                            html += '</li>';
                            $(".chooseBrand").append(html)
                        }
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
            $(".chooseBrand").children().remove();
        }
    });
    // 获取活动详情
    var data ={};
    data['activityId'] = parseInt(id);
    data['userId'] = jsonUserInfo['userid'];
    $.ajax({
        type:"post",
        data:data,
        url:web_url+"getOfflineInformationDetial",
        success:function(res){
            $("#userName").val(res.data.activityname);//活动名称
            var starStamp = res.data.starttime;
            var endStamp = res.data.endtime;
            function stampToTime(stmp) {
                var date = new Date(stmp*1000);
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = (date.getDate() <10 ? '0'+ date.getDate() : date.getDate())+ ' ';
                h = (date.getHours()<10 ? '0'+ date.getHours() : date.getHours()) + ':';
                m = (date.getMinutes()<10 ? '0'+ date.getMinutes() : date.getMinutes());
                // s = date.getSeconds();
                 return Y+M+D+h+m;
            }
            var stime = stampToTime(starStamp);
            var sTimeArr = stime.split(" ");
            var etime = stampToTime(endStamp);
            var eTimeArr = etime.split(" ");
            $("#SDate").val(sTimeArr[0]);//开始日期
            $("#sTime").val(sTimeArr[1]);//开始时间
            $("#EDate").val(eTimeArr[0]);//结束日期
            $("#eTime").val(eTimeArr[1]);//结束时间
            $("#city").val(res.data.city);//城市
            //主办方
            var host = res.host;
            var hostId;
            var hostArr = [];
            hostIdArr = [];
            function isArray(o){
                return Object.prototype.toString.call(o)=='[object Array]';
            }
            if(isArray(host)){
                for(var m = 0;m<host.length;m++){
                    hostId = host[m].hostid;
                    hostArr.push(hostId);
                }
                for(var x=0;x<$("#hostS option").length;x++){
                    for(var y=0;y<hostArr.length;y++){
                        if(hostArr[y]==$("#hostS option").eq(x).val()){
                            hostIdArr.push($("#hostS option").eq(x).val());
                        }
                    }
                }
                $("#hostS").val(hostIdArr).trigger('change');
            }else {
                var host = res.host.hostid;
                for(var i=0;i<$("#hostS option").length;i++)
                {
                    if($("#hostS option").eq(i).val() == host){
                        $("#hostS").val($("#hostS option").eq(i).val()).trigger('change');
                    }
                }
            }
            //场馆
            var club;
            if(isArray(res.club)){
                 club = res.club[0].clubid;

            }else{
                club = res.club.clubid;
            }
            for(var i=0;i<$("#venueS option").length;i++)
            {
                if($("#venueS option").eq(i).val() == club){
                    $("#venueS").val($("#venueS option").eq(i).val()).trigger('change');
                }
            }
            //标签
            var tag = res.data.tag;
            for(var i=0;i<$("#tag option").length;i++)
            {
                if($("#tag option").eq(i).val() == tag){
                    $("#tag").val($("#tag option").eq(i).val()).trigger('change');
                }
            }
            //票价
            var price = res.data.price;
            if(price == "暂无"){
                $(".money1").val();
                $(".money2").val();
            }else if(price == '免费'){
                $(".money1").val("0")
            }else if(price.indexOf("-") > 0 ){
                var priceArr = price.split("-");
                $(".money1").val(priceArr[0].substring(1));
                $(".money2").val(priceArr[1]);
                $("#coin").val(priceArr[0].substring(0,1))
            }else {
                $(".money1").val(price.substring(1));
                $("#coin").val(price.substring(0,1))
            }
            $(".smallDiv .imgBill ").attr("src",res.data.photo);//海报长
            $(".bigDiv .imgBill ").attr("src",res.data.photo2);///海报方
            $(".h5").val(res.data.htmlurl);//活动详情
            $(".ticket").val(res.data.ticketurl);//售票链接
            //参与艺人
            var dj = res.dj;
            var djId;
            var djArr = [];
            djIdArr = [];
            for(var m = 0;m<dj.length;m++){
                djId = dj[m].djid;
                djArr.push(djId);
            }
            for(var x=0;x<$("#djS option").length;x++){
                for(var y=0;y<djArr.length;y++){
                    if(djArr[y]==$("#djS option").eq(x).val()){
                        djIdArr.push($("#djS option").eq(x).val());
                    }
                }
            }
            $("#djS").val(djIdArr).trigger('change');
            //家族
            //选择厂牌
            if(res.data.brandlogo !=""&&res.data.brandlogo !=null){
                $(".cBrandCon").css("display","block");
                for(var i=0;i<$(".chooseBrand li").length;i++){
                    if($(".chooseBrand li:eq("+i+") >img").attr("src")==res.data.brandlogo){
                        $(".chooseBrand li:eq("+i+")").attr("data-ischeck","true");
                        $(".chooseBrand li:eq("+i+")>img").addClass("checkImg");
                        $(".chooseBrand li:eq("+i+")>span").addClass("defaultCheck");
                    }
                }
            }
            //相册
            $(".passAlbum").html("");
            if(res.data.images != null){
                $(".passAlbum").html("");
                var html ="";
                console.log(res.data.images);
                $.each(res.data.images,function (k,v) {
                    if(v!=""){
                        html += "<li><a ><img src="+ v + "  /></a><div class='del'><img data-src="+ v +" src='/Public/Home/images/delete.png'/></div></li>";
                    }
                });
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
                        data['type'] = 1;
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
    // 编辑活动详情
    $(".finish").click(function () {
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            if($("#SDate").val()==""){
                layer.msg("请选择活动开始日期");
            }else if($(".imgBill").prop("src").indexOf('/Public/Home/images/defaultImgH.png')>-1){
                layer.msg("请上传海报");
            }else if(parseInt($(".money1").val())> parseInt($(".money2").val())){
                layer.msg("请输入正确的价格范围")
            }else if($(".upload_append_list").length>10){
                layer.msg("一次上传不能超过10张");
            }else {
                $(".finish").attr("disabled",true);
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
                var img = $(".smallDiv img").prop("src");
                var img1 = $(".bigDiv img").prop("src");
                var small_base64;
                var big_base64;
                var small_url;
                var big_url;
                if(img.indexOf('http://api')>-1){
                    small_url = img;
                }else {
                    //小图转base64
                    var image = new Image();
                    image.src = img;
                    small_base64 = getBase64Image(image);
                    small_url = small_base64.split(",")[1];
                }
                if(img1.indexOf('http://api')>-1){
                    big_url = img1;
                }else{
                    //大图转base64
                    var image1 = new Image();
                    image1.src = img1;
                    big_base64 = getBase64Image(image1);
                    big_url = big_base64.split(",")[1];
                }
                var newcoverImages = [];
                // 添加海报两张图存为数组
                newcoverImages.push(small_url,big_url);
                // 相册存为base64数组
                var historyImages = [];
                for(var i = 0; i<$(".passAlbum li").length;i++){
                    historyImages.push($(".passAlbum li:eq("+i+") a img").prop("src"));
                }
                // 相册存为base64数组
                var Images = [];
                var imgList1 = $(".upload_append_list");
                for (var i = 0; i < imgList1.length; i++) {
                    Images.push($('.upload_append_list:eq(' + i + ') .upload_image').prop("src").split(",")[1])
                }
                //合并历史和当前相册
                var photos = historyImages.concat(Images);
                // var photos = Images;
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
                //时间处理
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
                data1['activityId'] = parseInt(id);
                data1['name'] = $("#userName").val();
                data1['starttime'] = sdate;
                data1['endtime'] = edate;
                data1['city'] = city;
                data1['cname'] = cname;
                data1['tag'] = tag;
                var money;
                if($('.money1').val()=="" && $('.money2').val()==""  ){
                    money = "暂无"
                }else if($('.money2').val()!="" && $('.money2').val()!=$('.money1').val()){
                    money = $("#coin").val()+$('.money1').val()+ '-'+$('.money2').val();
                }else{
                    money = $("#coin").val()+$('.money1').val()
                }
                if(money == $("#coin").val()+'0'){
                    money = "免费"
                }
                data1['price'] = money;
                data1['coverImages'] = newcoverImages;
                data1['shareicon'] = big_url;
                data1['images'] = photos;
                data1['DJ'] = dj;
                data1['rf'] = rf;
                data1['host'] = host;
                data1['club'] = club;
                data1['htmlURL'] = $(".h5").val();
                data1['ticketURL'] = $(".ticket").val();
                if(host!=null){
                    data1['brandLogo'] = $(".checkImg").attr("src");
                }else{
                    data1['brandLogo'] = "";
                }

                $.ajax({
                    type: "post",
                    data: data1,
                    url: web_url+"updateOfflineInformation",
                    success:function (res) {
                        if (res.status == 0) {
                            layer.msg("编辑成功！", {
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
                        $(".finish").removeAttr("disabled");
                    }
                })
            }
        }
    });
});