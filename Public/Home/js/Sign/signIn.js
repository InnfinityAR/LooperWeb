/**
 * Created by yinshiru on 2017/8/24.
 */
// document.write("<script language=javascript src=/Public/Home/js/webreload.js’></script>");
$(function () {
    var willList = [
        { id: 'venue', text: '创建场馆' },
        { id: 'host', text: '创建主办方' },
        { id: 'act', text: '创建活动' }
    ];
    $("#will").select2({
        data: willList,
        placeholder: "请选择合作意向",
        allowClear: true,
        minimumResultsForSearch: Infinity
    });
    $(".information").css({
       "display":"none"
    });
    $(".logo").click(function () {
        location.href = "/Home/Login/newIndex";
    });
    //        头像hover事件
    $(".deHead").hover(function () {
        $(".deHead img").css('opacity', '0.5');
        $(".deHead span").css('display', 'block');
    }, function () {
        $(".deHead img").css('opacity', '1');
        $(".deHead span").css('display', 'none');
    });
    // 获取短信验证码
    $(".getCode").click(function () {
        if ($(this).hasClass("disabled")) {
            return false;
        }
        var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
        var phone = $("input[name='phone']").val();
        if(phone==""){
            layer.tips("请输入手机号", $("input[name='phone']"));
        }else if (!phoneReg.test(phone)) {
            layer.tips("请输入正确的手机号", $("input[name='phone']"));
        } else {
            var index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            $.ajax({
                type: "post",
                data: "mobile=" + phone,
                url: web_url +"sendVerificationCode",
                success: function (res) {
                    layer.close(index);
                    if (res) {
                        setTime();
                        layer.msg("短信发送成功");
                    } else {
                        layer.msg("短信发送失败");
                    }
                }
            });

        }
    });
    var countTime = 60;
    //验证短信验证码
    $("input[name='pcode1']").blur(function(){
        if( $("input[name='pcode1']").val()!=""){
            var data = {};
            data['mobile'] = $("input[name='phone']").val();
            data['vCode'] = $("input[name='pcode1']").val();
            $.ajax({
                type: "post",
                data: data,
                url: web_url+"checkVerificationCodeLive",
                success: function (res) {
                    if(res.status == 1){
                        layer.tips("验证码输入有误",$("input[name='pcode1']"));
                        $("input[name='pcode1']").addClass("no");
                    }else {
                        $("input[name='pcode1']").removeClass("no");
                    }
                }
            })
        }
    });
    //创建用户
    $("#subBtn").click(function(){
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            var data ={};
            data['userType'] = 2;
            data['loginType'] = 3;
            data['accountName'] = $("#loginName").val();
            data['password'] = $("#passwordConfirm").val();
            data['userName'] = $("#userName").val();
            data['reason'] = $("#will").val();
            data['mobile'] = $("#phone").val();
            data['phone'] = $("#telephone").val();
            data['email'] = $("#email").val();
            if($("#headImg").prop("src").indexOf('data:')>-1){
                data['headImageUrl'] = $("#headImg").prop("src").split(",")[1];
            }else {
                data['headImageUrl'] = $("#headImg").prop("src");
            }
            var headImgSrc = $("#headImg").prop("src");
            if(headImgSrc.indexOf('/Public/Home/images/defaultHead.png')>-1){
                layer.msg("请上传头像");
            }else if( $("input[name='pcode1']").hasClass("no") ){
                layer.msg("验证码有误");
            }else{
                $.ajax({
                    type:"post",
                    data:data,
                    url:web_url+"createUser",
                    success:function(res){
                        if(res.status==0){
                            layer.msg("恭喜您注册成功！", {
                                time : 5000,
                                shade: 0.6,
                                success: function(layero,index){
                                    var msg = layero.text();
                                    var i = 2;
                                    var timer = null;
                                    var fn = function() {
                                        layero.find(".layui-layer-content").text(msg+i+'秒后跳转页面');
                                        if(!i) {
                                            layer.close(index);
                                            clearInterval(timer);
                                            location.href = "/Home/Sign/signFinish"
                                        }
                                        i--;
                                    };
                                    timer = setInterval(fn, 1000);
                                    fn();
                                }
                            });
                        }else {
                            layer.msg("注册失败");
                        }
                    }
                })
            }
        }
    });
    function setTime() {
        if (countTime == 0) {
            countTime = 60;
            $(".getCode").removeClass("disabled");
            $(".getCode").css({
                "backgroundColor":"#07aca5"
            });
            $(".getCode").html("发送验证码");

        } else {
            countTime--;
            $(".getCode").addClass("disabled");
            $(".getCode").css({
                "backgroundColor":"#949494"
            });
            $(".getCode").html("再次发送:" + countTime);
            setTimeout(function () {
                setTime();
            }, 1000)
        }
    }
});

