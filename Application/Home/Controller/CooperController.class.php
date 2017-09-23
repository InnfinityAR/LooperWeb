<?php
namespace Home\Controller;

use Think\Controller;

class CooperController extends BaseController
{
    public function _initialize()
    {
        parent::_initialize();
    }
    public function index()
    {
        $this->display();
    }

    public function createHost()
    {
        $user = session('user_id');
        $userType = session('user_type');
        $this->assign('user_id',$user);
        $this->assign('user_type',$userType);
        $this->display();
    }

}