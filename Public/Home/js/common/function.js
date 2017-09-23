/**
 * Created by yinshiru on 2017/7/23.
 */
$(function(){
    if($.cookie("user")!=null){
        //            取cookie
        getUserInfo = $.cookie("user");
        jsonUserInfo = JSON.parse(getUserInfo);
        // console.log(jsonUserInfo);
    }
});
