<?php

namespace Home\Controller;

class LoopApiController {

    private $Server = "http://api2.innfinityar.com/web/";
    private $timestamp;  //时间戳
    private $BodyType = "json"; //包体格式，可填值：json 、xml
    private $Version = 1; //版本

    public function __construct() {
        
    }

    /**
     * 发送手机验证码
     * @param type $mobile 手机号
     */
    public function sendCode($mobile) {
        $url = $this->Server . "sendVerificationCode";

        $data["mobile"] = $mobile;

        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }

    /**
     * 判断验证码是否正确
     * @param type $mobile 手机号
     * @param type $vCode 验证码
     * @return type
     */
    public function checkCode($mobile, $vCode) {
        $url = $this->Server . "checkVerificationCode";

        $data['mobile'] = $mobile;
        $data['vCode'] = $vCode;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }

    public function createUser($openId, $loginType, $headImageUrl, $userName, $userSex) {
        $url = $this->Server . "createUser";
        
        $data['openId'] = $openId;
        $data['loginType'] = $loginType;
        $data['headImageUrl'] = $headImageUrl;
        $data['userName'] = $userName;
        $data['userSex'] = $userSex;
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }

    public function userLogin($name,$password) {
        $url = $this->Server . "userLogin";
        $data = [
            'password'    => $password,
            'accountName' => $name,
        ];
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }
        return $datas;
    }


    /**
     * 获取loop
     * @param type $userId 用户id
     * @param type $page 页数
     * @param type $pageSize 单页显示数量
     */
    public function getMyLoop($userId, $page = 1, $pageSize = 10) {
        $url = $this->Server . "getMyLoop";

        $data['userId'] = $userId;
        $data['page'] = $page;
        $data['pageSize'] = $pageSize;

        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }

    /**
     * 
     * @param type $page    页数
     * @param type $pageSize    每页显示条数
     * @param type $type    1按tag搜索,2最新,3推荐
     * @param type $tag    标签
     * @return type
     */
    public function getLoop($page = 1, $pageSize = 10, $type = 2, $tag = '') {
        $url = $this->Server . "getLoop";

        $data['page'] = $page;
        $data['pageSize'] = $pageSize;
        $data['type'] = $type;
        $data['tag'] = $tag;

        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 获取tag
     * @param type $userId 用户id
     */
    public function getTag($userId) {
        $url = $this->Server . "getTag";
        
        $data["userId"] = $userId;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 获取loop详情
     * @param type $userId 用户id
     * @param type $loopId loopid
     */
    public function getLoopById($userId, $loopId) {
        $url = $this->Server . "getLoopById";
        
        $data["userId"] = $userId;
        $data["loopId"] = $loopId;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 新建自定义标签
     * @param type $userId 用户id
     * @param type $tagName 标签名称
     * @return type
     */
    public function createTag($userId, $tagName) {
        $url = $this->Server . "createTag";
        
        $data['userId'] = $userId;
        $data['tagName'] = $tagName;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 
     * @param type $name    loop名称
     * @param type $userId  用户id
     * @param type $photo1  封面1
     * @param type $photo2  封面2
     * @param type $tags    
     * @param type $description
     * @return type
     */
    public function createLoop($name, $userId, $photo1, $photo2, $tags, $description='') {
        $url = $this->Server . "createLoop";
        
        $data['name'] = $name;
        $data['userId'] = $userId;
        $data['photo1'] = $photo1;
        $data['photo2'] = $photo2;
        $data['tags'] = $tags;
        $data['description'] = $description;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 修改loop
     * @param type $name    loop名称
     * @param type $loopId  loopid
     * @param type $photo1  封面1
     * @param type $photo2  封面2
     * @param type $tags    标签
     * @param type $description
     * @return type
     */
    public function updateLoop($name, $loopId, $photo1, $photo2, $tags, $description='') {
        $url = $this->Server . "updateLoop";
        
        $data['name'] = $name;
        $data['loopId'] = $loopId;
        $data['photo1'] = $photo1;
        $data['photo2'] = $photo2;
        $data['tags'] = $tags;
        $data['description'] = $description;
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 获取全部歌手
     * @return type
     */
    public function getArtist() {
        $url = $this->Server . "getArtist";
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 根据歌手名获取音乐
     * @param type $artist 歌手
     * @return type
     */
    public function getMusicByArtistName($artist,$loopId) {
        $url = $this->Server . "getMusicByArtistName";
        
        $data['artist'] = $artist;
        $data['loopId'] = $loopId;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 获取我的最爱歌单
     * @param type $userId  用户id
     * @param type $loopId  loopid
     * @return type
     */
    public function getMyFavorite($userId, $loopId) {
        $url = $this->Server . "getMyFavorite";
        
        $data['userId'] = $userId;
        $data['loopId'] = $loopId;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    
    /**
     * 全局搜索
     * @param type $name    搜索信息
     * @param type $loopId  loopid
     */
    public function searchLoop($name, $loopId) {
        $url = $this->Server . "searchLoop";
        
        $data['name'] = $name;
        $data['loopId'] = $loopId;
        
        // 发送请求
        $result = $this->curl_post($url, $data);
        if ($this->BodyType == "json") {//JSON格式
            $datas = json_decode($result, true);
        } else { //xml格式
            $datas = simplexml_load_string(trim($result, " \t\n\r"));
        }

        return $datas;
    }
    

    /**
     * curl请求
     * @param type $url  请求地址
     * @param type $postFields  请求参数
     * @return string
     */
    public function curl_post($url, $postFields) {
        //初始化curl
        $ch = curl_init();
        //$postFields = arr2xml($postFields);
        //参数设置  
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, 0);
        curl_setopt($ch, CURLOPT_POST, true);
        
        curl_setopt($ch, CURLOPT_ENCODING, "");
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
        

        $result = curl_exec($ch);
        //连接失败
        if ($result == FALSE) {
            if ($this->BodyType == 'json') {
                $result = "{\"statusCode\":\"172001\",\"statusMsg\":\"网络错误\"}";
            } else {
                $result = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Response><statusCode>172001</statusCode><statusMsg>网络错误</statusMsg></Response>";
            }
        }

        curl_close($ch);
        return $result;
    }

}
