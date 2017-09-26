/**
 * Created by yinshiru on 2017/8/25.
 */
$(function () {
   $("#formInfo").bootstrapValidator({
       message: 'This value is not valid',
       // excluded : [':disabled'],
       feedbackIcons: {
       //     valid: 'glyphicon glyphicon-ok',
           invalid: 'glyphicon glyphicon-remove',
           validating: 'glyphicon glyphicon-refresh'
       },
       fields:{
           loginName:{
               validators:{
                   notEmpty: {
                       message: '登录账号不能为空'
                   }
               }
           },
           password: {
               validators: {
                   notEmpty: {
                       message: '密码不能为空'
                  },
                   stringLength: {
                       min: 6,
                       max: 20,
                       message: '密码6-20位'
                   },
                   regexp: {
                       regexp: /^(\w){6,20}$/,
                       message: '密码6-20位，由数字、26个英文字母或下划线组成'
                   }
               }
           },
           confirmPassword: {
               validators: {
                   notEmpty: {
                       message: '请确认密码'
                   },
                   identical: {
                       field: 'password',
                       message: '两次密码不一致'
                   }
               }
           },
           userName:{
               validators: {
                   notEmpty: {
                       message: '名称不能为空'
                   }
               }
           },
           will:{
               validators: {
                   notEmpty: {
                       message: '请选择合作意向'
                   }
               }
           },
           phone:{
               group: '.col-sm-5',
               validators: {
                   notEmpty: {
                       message: '手机号不能为空'
                   },
                   regexp: {
                       regexp: /^1(3|4|5|7|8)\d{9}$/,
                       message: '手机号格式不正确'
                   }
               }
           },
           telephone:{
               validators: {
                   regexp: {
                       regexp: /^(\d{2,4}-?)?\d{7,8}$/,
                       message: '座机格式不正确'
                   }
               }
           },
           email:{
               validators: {
                   emailAddress: {
                       message: '邮箱格式不正确'
                   }
               }
           },
           actName:{
               validators: {
                   notEmpty: {
                       message: '活动名称不能为空'
                   }
               }
           },
           cityP:{
               validators: {
                   notEmpty: {
                       message: '城市不能为空'
                   }
               }
           },
           hostS:{
               validators: {
                   notEmpty: {
                       message: '请选择主办方'
                   }
               }
           },
           venueS:{
               validators: {
                   notEmpty: {
                       message: '请选择场馆'
                   }
               }
           },
           tag:{
               validators: {
                   notEmpty: {
                       message: '请选择标签'
                   }
               }
           },
           money1:{
               group:".col-sm-2",
               validators: {
                   // notEmpty: {
                   //     message: '请输入价格'
                   // },
                   regexp: {
                       regexp:  /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/,
                       message: '价格不合法'
                   }
               }
           },
           money2:{
               group:".col-sm-2",
               validators: {
                   regexp: {
                       regexp:  /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/,
                       message: '价格不合法'
                   }
               }
           },
           intro:{
               validators: {
                   notEmpty: {
                       message: '请输入简介'
                   }
               }
           },
           province10:{
               group:".col-sm-4",
               validators: {
                   notEmpty: {
                       message: '请选择省'
                   }
               }
           },
           city10:{
               group:".col-sm-4",
               validators: {
                   notEmpty: {
                       message: '请选择市'
                   }
               }
           },
           district10:{
               group:".col-sm-4",
               validators: {
                   notEmpty: {
                       message: '请选择区'
                   }
               }
           },
           detailedAddr:{
               group:".col-sm-5",
               validators: {
                   notEmpty: {
                       message: '请输入详细地址'
                   }
               }
           },
           ticket:{
               validators: {
                   regexp: {
                       regexp: /^(https|http|ftp|rtsp|mms)?:\/\//,
                       message: '请输入正确的网址 https://'
                   }
               }
           },
           h5:{
               validators: {
                   regexp: {
                       regexp:/^(https|http|ftp|rtsp|mms)?:\/\//,
                       message: '请输入正确的网址 https://'
                   }
               }
           },
           pcode1:{
               group:".col-sm-3",
               validators: {
                   notEmpty: {
                       message: '请输入验证码'
                   }
               }
           }

       }
   });
});
