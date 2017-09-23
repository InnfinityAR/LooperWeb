<?php

namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller {

    public function newIndex(){
        $this->display();
    }
    public function index() {
        $p = I("p", 1);
        // 根据用户id获取用户loop
        $user_id = session("user_id");
        $loopApi = new LoopApiController();
        if (IS_AJAX) {    // ajax分页
            $loops = $loopApi->getMyLoop($user_id, $p, 12);
            //$loops = $loopApi->getLoop($p, 12);
            if ($loops['data']) {
                $data['datas'] = $loops["data"];
                $data['status'] = true;
                $data['p'] = $p;
            } else {
                $data['status'] = false;
                $data['p'] = $p;
            }
            $this->ajaxReturn($data);
        } else {    // 普通get请求
            $loops = $loopApi->getMyLoop($user_id, $p, 11);
            //$loops = $loopApi->getLoop($p, 12);
            $this->loops = $loops['data'];
            $this->p = $p;
            $this->display();
        }
    }
    public function venueSign() {
        $this->display();
    }
    public function reVenueSign() {
        $this->display();
    }

    // 新增loop
    public function create() {
        $user_id = session("user_id");
        $loopApi = new LoopApiController();

        if (IS_POST) {
            $small_img = I("small_img");
            $big_img = I("big_img");
            
            $name = I("name");
            $tag_string = I("tags");
            $photo1 = substr(base64EncodeImage($small_img),strpos(base64EncodeImage($small_img), ",")+1);
            $photo2 = substr(base64EncodeImage($big_img),strpos(base64EncodeImage($big_img), ",")+1);
            $tags = explode("@", $tag_string);
            
            $result = $loopApi->createLoop($name, $user_id, $photo1, $photo2, $tags);
            // 创建成功则删除原来的图片
            if($result['status']==0){
                unlink(".".$small_img);
                unlink(".".$big_img);
            }
            $this->ajaxReturn($result);
        } else {
            // 获取tag
            $tag_result = $loopApi->getTag($user_id);
            // 官方tag
            foreach ($tag_result['data'] as $key=>$tag){
                if($tag['offical_flag']==1){
                    $tag_data[] = $tag;
                }
            }
            // 分组
            foreach ($tag_data as $value){
                $pid = $value["pid"];
                unset($value['pid']);
                
                if(!isset($tags[$pid])){
                    $tags[$pid] = array('pid'=>$pid,'tags'=>array());
                }
                $tags[$pid]['tags'][] = $value;
            }
            sort($tags);
            $this->tags = $tags;
            
            $this->display();
        }
    }
    
    // loop详情
    public function show() {
        $user_id = session("user_id");
        $loopApi = new LoopApiController();
        $id = I("id","","intval");
        
        // loop详情
        $loop = $loopApi->getLoopById($user_id, $id);
        $this->loop = $loop['Loop'];
        $this->tags = explode(',', $loop['Loop']['news_tag']);
        $this->musicNum = $loop['MusicNr'];
        $this->musics = $loop['Music'];
        
        // 我的最爱歌单
        $collects = $loopApi->getMyFavorite($user_id, $id);
        $this->collects = $collects['data'];
        
        // 获取全部歌手
        $artist_data = $loopApi->getArtist();
        $artists = $artist_data['data'];
        
        foreach($artists as $key=>$artist){
            if($artist['artist']){
                $charter = getStrOne($artist['artist']);
                $arr[$charter][] = $artist;
            }
        }
        $this->artists = $arr;
        $this->id = $id;
        
        $this->display();
    }
    
    // 根据艺人获取音乐
    public function getMusicByArtistName() {
        $artist = I("artist");
        $loopId = I('loopId');
        $loopApi = new LoopApiController();
        
        $result = $loopApi->getMusicByArtistName($artist,$loopId);
        $data = $result['data'];
        foreach ($data as $key=>$value){
            $album = $value['albumtitle'];
            unset($value['album']);
            
            if(!isset($musics[$album])){
                $musics[$album] = array('album'=>$album,'cover'=>$value['music_cover'], 'time'=>$value['year'],'musics'=>array());
            }
            $musics[$album]['musics'][] = $value;
        }
        $this->ajaxReturn($musics);
        
    }
    
    public function searchLoop() {
        $name = I("name");
        $loopId = I("loopId");
        $loopApi = new LoopApiController();
        
        $result = $loopApi->searchLoop($name, $loopId);
        
        foreach ($result['data']['Albumn'] as $key=>$value){
            $album = $value['albumtitle'];
            unset($value['albumtitle']);
            
            if(!isset($albums[$album])){
                $albums[$album] = array('album'=>$album,'cover'=>$value['music_cover'], 'time'=>$value['uptime'],'musics'=>array());
            }
            $albums[$album]['musics'][] = $value;
        }
        $data["albums"] = $albums;
        $data["musics"] = $result['data']["Music"];
        $this->ajaxReturn($data);
    }
    
    // 上传本地音乐
    public function localUpload() {
        $user_id = session("user_id");
        $loopid = I("loopid","","intval");
        $loopApi = new LoopApiController();
        $config = array(
            'rootPath' => './Public/Uploads/music/',
            'exts' => array('mp3'),
            'subName' => '',
        );
        $upload = new \Think\Upload($config); // 实例化上传类
        $info = $upload->upload();
        foreach ($info as $key=>$value){
            // 保存mp3地址用于之后删除
            $flie_path[] = "./Public/Uploads/music/".$value['savename'];
            // 逐个上传
            $result = $loopApi->uploadMusic($user_id, $loopId, "./Public/Uploads/music/".$value['savename']);
            dump($result);
        }
        
        
        $this->ajaxReturn($_FILES['localMusic'],'EVAL');
    }

    // 修改loop
    public function modify() {
        $id = I("id");
        $user_id = session("user_id");
        $loopApi = new LoopApiController();
        if (IS_POST) {
            $small_img = I("small_img");
            $big_img = I("big_img");
            $loopid = I("loopid");
            $name = I("name");
            $tag_string = I("tags");
            if($small_img){
                $photo1 = substr(base64EncodeImage($small_img),strpos(base64EncodeImage($small_img), ",")+1);
            }
            if($big_img){
                $photo2 = substr(base64EncodeImage($big_img),strpos(base64EncodeImage($big_img), ",")+1);
            }
            $tags = explode("@", $tag_string);
            $result = $loopApi->updateLoop($name, $loopid, $photo1, $photo2, $tags);
            // 创建成功则删除原来的图片
            if($result['status']==0){
                unlink(".".$small_img);
                unlink(".".$big_img);
            }
            $this->ajaxReturn($result);
        } else {
            $loop = $loopApi->getLoopById($user_id, $id);
            $this->loop = $loop['Loop'];
            $this->own_tags = json_encode(explode(',', $loop['Loop']['news_tag']));
            
            // 获取tag
            $tag_result = $loopApi->getTag($user_id);
            // 官方tag
            foreach ($tag_result['data'] as $key=>$tag){
                if($tag['offical_flag']==1){
                    $tag_data[] = $tag;
                }
            }
            // 分组
            foreach ($tag_data as $value){
                $pid = $value["pid"];
                unset($value['pid']);
                
                if(!isset($tags[$pid])){
                    $tags[$pid] = array('pid'=>$pid,'tags'=>array());
                }
                $tags[$pid]['tags'][] = $value;
            }
            sort($tags);
            $this->tags = $tags;
//            dump($loop);
            $this->display();
        }
    }

    // 创建tag
    public function createTag() {
        $user_id = session("user_id");
        $tag = I("tag");     
        $loopApi = new LoopApiController();
        $result = $loopApi->createTag($user_id, $tag);
    }
}
