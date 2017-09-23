/**
 * Created by yinshiru on 2017/8/30.
 */
$(function () {
   // 获取合作用户信息
   var data = {};
   data['userId'] = jsonUserInfo['userid'];
   $.ajax({
       type : 'post',
       data:data,
       url:web_url+"getThirdPartyInfo",
       success:function (res) {
           $("#loginName").val(res.user.accountname);
           $("#userName").val(res.user.nickname);
           $("#will").val(res.user.reason);
           $("#phone").val(res.user.mobile);
           $("#telephone").val(res.user.phone);
           $("#email").val(res.user.email);
           $("#headImg").prop("src",res.user.headimageurl);
       }
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
                url: web_url+"sendVerificationCode",
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
    //验证短信验证码
    $("input[name='pcode']").blur(function(){
        if( $("input[name='pcode']").val()!=""){
            var data = {};
            data['mobile'] = $("input[name='phone']").val();
            data['vCode'] = $("input[name='pcode']").val();
            $.ajax({
                type: "post",
                data: data,
                url:web_url+"checkVerificationCodeLive",
                success: function (res) {
                    if(res.status == 1){
                        layer.tips("验证码输入有误",$("input[name='pcode']"));
                        $("input[name='pcode']").addClass("no");
                    }else {
                        $("input[name='pcode']").removeClass("no");
                    }
                }
            })
        }
    });
    // 修改密码
    $(".editBtn").click(function () {
       $(".passwordDiv").removeClass("disNone");
       $(".passwordtwoDiv").removeClass("disNone");
       $(".editBtn").parent().parent().addClass("disNone");
    });
    // 更新合作用户信息
    $("#subBtn").click(function(){
        var bootstrapValidator = $("#formInfo").data('bootstrapValidator');
        var flag  =  bootstrapValidator.validate().isValid();
        if(flag){
            var data ={};
            data['userId'] = jsonUserInfo['userid'];
            data['userType'] = jsonUserInfo['usertype'];
            data['loginType'] = jsonUserInfo['logintype'];
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
            }else if( $("input[name='pcode']").hasClass("no") ){
                layer.msg("验证码有误");
            }else{
                $.ajax({
                    type:"post",
                    data:data,
                    url:web_url+"updateBasicUserInfo",
                    success:function(res){
                        if(res.status==0){
                            layer.msg("修改成功");
                        }else {
                            layer.msg("修改失败");
                        }
                    }
                })
            }
        }

    });
    var countTime = 60;
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