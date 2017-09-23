<?php

namespace Home\Controller;

use Think\Controller;

class LoginController extends Controller {

    public function index() {
        $this->display();
    }

    // 发送手机验证码
    public function sendCode() {
        $mobile = I("mobile");
        if ($mobile) {
            $loopApi = new LoopApiController();
            $result = $loopApi->sendCode($mobile);

            if ($result['status'] == 0) {
                $this->ajaxReturn(true);
            } else {
                $this->ajaxReturn(false);
            }
        }
    }

    public function checkCode() {
        $mobile = I("mobile");
        $code = I("code");

        // 调用接口验证
        $loopApi = new LoopApiController();
        $result = $loopApi->checkCode($mobile,$code);
        if ($result['status']==0) {
            session("user_id",$result['data']['userid']);
            session("username",$result['data']['nickname']);
            $this->ajaxReturn(true);
        } else {
            $this->ajaxReturn(false);
        }
    }
    //用户登录
    public function userLogins() { 
        $name     = I("cphone");
        $password = I("password");
        $loopApi = new LoopApiController();
        $result = $loopApi->userLogin($name,$password);
//        if($result['data']['active']==0)
//        {
//            $this->ajaxReturn(2);
//        }
        if ($result['status']==0) {
            session("user_id",$result['data']['userid']);
            session("username",$result['data']['nickname']);
            $arr = [
                'userid' => $result['data']['userid'],
                'usertype' => $result['data']['usertype'],
                'logintype'=> $result['data']['logintype'],
            ];
            $info = json_encode($arr);
            setcookie('user',$info,null,'/');
            $this->ajaxReturn(3);
        }
        if ($result['status']==1)
        {
            $this->ajaxReturn(1);
        }
    }
    public function logout() {
        session("user_id",null);
        session("username",null);
        cookie("user",null);
        redirect("/");
    }
}
