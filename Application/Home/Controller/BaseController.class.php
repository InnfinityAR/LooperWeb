<?php

namespace Home\Controller;

use Think\Controller;


class BaseController extends Controller {

    public function _initialize()
    {
        if (!session('user_id')) {
            redirect("/");
        }
    }
}
