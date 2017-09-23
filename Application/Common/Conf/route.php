<?php

return array(
    'URL_ROUTER_ON' => true,
    
    'URL_ROUTE_RULES' => array(
//        'login$'  =>  'Home/Login/index',
        'base$'  =>  'Home/Base/base',   //登录页
        'login$'  =>  'Home/Login/newIndex',   //登录页
        'create$' =>  'Home/Index/create',     //创建loop
        'wechatLogin$' => 'Home/Oauth/callback',
        'operate/:id\d'  =>  'Home/Index/operate',   //操作：发布活动&上传歌曲
        'coopSign$'  =>  'Home/Index/coopSign',  //合作用户注册
        'venueSign$'  =>  'Home/Index/venueSign',  //合作用户:场馆用户注册
        'musicianSign$'  =>  'Home/Index/musicianSign',  //合作用户：音乐人注册
        'brandSign$'  =>  'Home/Index/brandSign',  //合作用户：厂牌注册
        'familySign$'  =>  'Home/Index/familySign',  //合作用户：家族注册
        'reVenueSign$'  =>  'Home/Index/reVenueSign',  //重新注册场馆用户
        'djSign$'  =>  'Home/Index/djSign',  //重新注册音乐人用户
        'hostSign$'  =>  'Home/Index/hostSign',  //重新注册厂牌用户
        'reFamilySign$'  =>  'Home/Index/reFamilySign',  //重新注册家族用户
        'createLiveShow$'  =>  'Home/Index/createLiveShow',  //创建liveshow
        'djInfo$'  =>  'Home/Index/djInfo',  //艺人信息
        'venueInfo$'  =>  'Home/Index/venueInfo',  //场馆信息
        'familyInfo$'  =>  'Home/Index/familyInfo',  //家族信息
        'hostInfo$'  =>  'Home/Index/hostInfo',  //主办方信息
        'liveshow:id\d'  =>  'Home/Index/liveshow',  //我的Liveshow
        'signFinish:id\d'  =>  'Home/Index/signFinish',  //注册完成
        'modify/:id\d' => 'Home/Index/modify',
        'show/:id\d' => 'Home/Index/show',

        'actList$' => 'Home/Cooper/actList',
        'venueList$' => 'Home/Cooper/venueList',
        'hostList$' => 'Home/Cooper/hostList',
        'familyList$' => 'Home/Cooper/familyList',
        'createAct$' => 'Home/Cooper/createAct',
        'index$' => '/Home/Cooper/index',

    )
);
