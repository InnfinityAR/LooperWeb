/**
 * Created by yinshiru on 2017/7/23.
 */
$(function () {

    // more infos - particleslider.com

    var init = function () {
        var isMobile = navigator.userAgent &&
            navigator.userAgent.toLowerCase().indexOf('mobile') >= 0;
        var isSmall = window.innerWidth < 1000;

        var ps = new ParticleSlider({
            ptlGap: isMobile || isSmall ? 3 : 0,
            ptlSize: isMobile || isSmall ? 3 : 1,
            width: 1e9,
            height: 1e9
        });

        (window.addEventListener
            ? window.addEventListener('click', function () {
                ps.init(true)
            }, false)
            : window.onclick = function () {
                ps.init(true)
            });
    };
    var initParticleSlider = function () {
        var psScript = document.createElement('script');
        (psScript.addEventListener
            ? psScript.addEventListener('load', init, false)
            : psScript.onload = init);
        psScript.src = '/Public/Home/js/particleslider.js';
        psScript.setAttribute('type', 'text/javascript');
        document.body.appendChild(psScript);
    };
    (window.addEventListener
        ? window.addEventListener('load', initParticleSlider, false)
        : window.onload = initParticleSlider);

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    window.onresize = function () {
        var logoWidth = $(".logo").width();
        var logoHeight = $(".logo").height();
        var uploadWidth = $(".upload").width();
        var uploadHeight = $(".upload").height();
        $(".logo").css("margin-left", (windowWidth - logoWidth) / 2);
        $(".logo").css("margin-top", (windowHeight - logoHeight) / 2 - 20);
        $(".upload").css("margin-left", (windowWidth - uploadWidth) / 2);
        $(".upload").css("margin-top", (windowHeight - uploadHeight) / 2 - 30);
        $("#canvas").height(windowHeight);
        $("#canvas").width(windowWidth);
    };
    $("#canvas").html5_3d_animation({
        window_width: windowWidth,
        window_height: windowHeight,
        window_background: "#000",
        star_count: '100',
        star_color: '#019c9a',
        star_depth: '500'
    });
    //用户登录验证
    //个人用户入口点击事件
    $(".userEntry").click(function () {
        $(".dialog").show();
        $(".userEntry").css({
            "background":"url('/Public/Home/images/personalChoose.png') no-repeat",
            "background-size":"16%",
            "background-position":"20%",
            "background-color":"#fff",
            "color": "#000",
        });
        $(".dialog_bg").click(function () {
            $(".dialog").hide();
            $(".userEntry").css({
                "background":"url('/Public/Home/images/personal.png') no-repeat",
                "background-size":"16%",
                "background-position":"20%",
                "color": "#fff",
            })
        });

        // 个人用户选择手机
        $(".phoneEnter").click(function () {
            /* Act on the event */
            $(".phoneLogin").show();
            $(".dialog").hide();
            $(".login").hide();
        });
        // 返回选择登录方式
        $(".close").click(function(){
            $(".phoneLogin").hide();
            $(".login").show();
            $(".userEntry").css({
                "background":"url('/Public/Home/images/personal.png') no-repeat",
                "background-size":"16%",
                "background-position":"20%",
                "color": "#fff",
            })
        });
    });
    //合作用户入口点击事件
    $(".coopEnter").click(function () {
        $(".dialog1").show();
        $(".coopEnter").css({
            "background":"url('/Public/Home/images/cooperationChoose.png') no-repeat",
            "background-size":"16%",
            "background-position":"20%",
            "background-color":"#fff",
            "color": "#000",
        })
        $(".dialog_bg").click(function () {
            $(".dialog1").hide();
            $(".coopEnter").css({
                "background":"url('/Public/Home/images/cooperation.png') no-repeat",
                "background-size":"16%",
                "background-position":"20%",
                "color": "#fff",
            })

        });
        // 合作用户登录
        $(".coopLogin").click(function () {
            /* Act on the event */
            $(".coopLoginDiv").show();
            $(".dialog1").hide();
            $(".login").hide();
        });
        // 返回选择登录方式
        $(".close").click(function(){
            $(".coopLoginDiv").hide();
            $(".login").show();
            $(".coopEnter").css({
                "background":"url('/Public/Home/images/cooperation.png') no-repeat",
                "background-size":"16%",
                "background-position":"20%",
                "color": "#fff"
            })
        });

    });
    // 手机登录
    $(".enter").click(function () {
        var data = {};
        data['mobile'] = $("input[name='phone']").val();
        data['code'] = $("input[name='code']").val();
        var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!phoneReg.test(data['mobile'])) {
            layer.tips("请输入正确的手机号", $("input[name='phone']"));
        } else if (!data['code']) {
            layer.tips("请输入验证码", $("input[name='code']"));
        } else {
            // 验证
            $.ajax({
                type: "post",
                data: data,
                url: "/Home/Login/checkCode",
                success: function (res) {
                    if (res) {
                        var strUserInfo = JSON.stringify(res);
                        $.cookie('userInfo',strUserInfo,{path:'/'});
                        location.href = "/";
//                                 location.href = "{:U('Index/operate')}";
                    } else {
                        layer.msg("注册/登录失败");
                    }
                }
            })
        }
    });
    // 获取验证码
    $(".sendCode").click(function () {
        if ($(this).hasClass("disabled")) {
            return false;
        }
        var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
        var phone = $("input[name='phone']").val();
        if (!phoneReg.test(phone)) {
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
    // 返回选择登录方式
    $(".back").click(function () {
        $(".phoneLogin").hide();
        $(".choose").show();
    });
    // 合作用户登录
    $(function(){
        // 合作用户登录
        $(function(){
            $(".loginEnter").click(function () {
                var data = {};
                data['accountName'] = $("input[name='cphone']").val();
                data['password'] = $("input[name='password']").val();
                // var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
                // if (!phoneReg.test(data['mobile'])) {
                //    layer.tips("请输入正确的手机号", $("input[name='cphone']"));
                // }
                if (!data['accountName']) {
                    layer.tips("请输入用户名", $("input[name='cphone']"));
                } else if (!data['password']) {
                    layer.tips("请输入密码", $("input[name='password']"));
                } else {
                    $.ajax({
                        type: "post",
                        accepts: {
                            mycustomtype: 'application/x-some-custom-type'
                        },
                        data :{'cphone':data['accountName'],'password':data['password']},
                        url: "home/login/userLogins",
                        success: function (res) {
                            console.log(res);
                            if (res == 3) {
                               location.href = "/Home/Cooper/index"
                            }else if(res == 1) {
                                layer.msg("账号密码错误");
                            }else{
                                layer.msg("账号未审核");
                            }
                        }
                    })
                }
            });
        })
    });
    // 显示二维码
    $(".block").hover(function () {
        $(this).find(".qrcode").show();
    }, function () {
        $(this).find(".qrcode").hide();
    });
    var countTime = 60;
    function setTime() {
        if (countTime == 0) {
            countTime = 60;
            $(".sendCode").removeClass("disabled");
            $(".sendCode").html("发送验证码");
        } else {
            countTime--;
//                    console.log(countTime);
            $(".sendCode").addClass("disabled");
            $(".sendCode").html("再次发送:" + countTime);
            setTimeout(function () {
                setTime();
            }, 1000)
        }
    }
});