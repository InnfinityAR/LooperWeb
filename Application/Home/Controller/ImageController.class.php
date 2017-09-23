<?php

namespace Home\Controller;

use Think\Controller;

class ImageController extends Controller {

    //上传多张图片
    public function upPicMore() {
        // Make sure file is not cached (as it happens for example on iOS devices)
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");

        // Support CORS
        // header("Access-Control-Allow-Origin: *");
        // other CORS headers if any...
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit; // finish preflight CORS requests here
        }
        if (!empty($_REQUEST['debug'])) {
            $random = rand(0, intval($_REQUEST['debug']));
            if ($random === 0) {
                header("HTTP/1.0 500 Internal Server Error");
                exit;
            }
        }

        // header("HTTP/1.0 500 Internal Server Error");
        // exit;
        // 5 minutes execution time
        @set_time_limit(5 * 60);

        // Uncomment this one to fake upload time
        usleep(5000);

        // Settings
        // $targetDir = ini_get("upload_tmp_dir") . DIRECTORY_SEPARATOR . "plupload";
        if (isset($_REQUEST["foldername"])) {
            $targetDir .= 'Public/Uploads/' . $_REQUEST["foldername"] . '_tmp';
            $uploadDir .= 'Public/Uploads/' . $_REQUEST["foldername"];
        } else {
            $targetDir .= 'Public/Uploads/Images_tmp';
            $uploadDir .= 'Public/Uploads/Images';
        }

        $cleanupTargetDir = true; // Remove old files
        $maxFileAge = 5 * 3600; // Temp file age in seconds
        // Create target dir
        if (!file_exists($targetDir)) {
            @mkdir($targetDir);
        }

        // Create target dir
        if (!file_exists($uploadDir)) {
            @mkdir($uploadDir);
        }

        // Get a file name
        if (isset($_REQUEST["name"])) {
            $types = explode('.', $_REQUEST["name"]);
            $fileName = md5(time() . rand(5, 25)) . '.' . $types[1];
        } elseif (!empty($_FILES)) {
            $types = explode('.', $_FILES["file"]["name"]);
            $fileName = md5(time() . rand(5, 25)) . '.' . $types[1];
        } else {
            $fileName = md5(time() . rand(5, 25)) . uniqid("file_");
        }

        $md5File = @file('md5list.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $md5File = $md5File ? $md5File : array();

        if (isset($_REQUEST["md5"]) && array_search($_REQUEST["md5"], $md5File) !== FALSE) {
            die('{"jsonrpc" : "2.0", "result" : null, "id" : "id", "exist": 1,"picurl": ,}');
        }
        $filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;
        $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;


        // Chunking might be enabled
        $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
        $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 1;


        // Remove old temp files
        if ($cleanupTargetDir) {
            if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}, "id" : "id"}');
            }

            while (($file = readdir($dir)) !== false) {
                $tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;

                // If temp file is current file proceed to the next
                if ($tmpfilePath == "{$filePath}_{$chunk}.part" || $tmpfilePath == "{$filePath}_{$chunk}.parttmp") {
                    continue;
                }

                // Remove temp file if it is older than the max age and is not the current file
                if (preg_match('/\.(part|parttmp)$/', $file) && (@filemtime($tmpfilePath) < time() - $maxFileAge)) {
                    @unlink($tmpfilePath);
                }
            }
            closedir($dir);
        }


        // Open temp file
        if (!$out = @fopen("{$filePath}_{$chunk}.parttmp", "wb")) {
            die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
        }

        if (!empty($_FILES)) {
            if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
            }

            // Read binary input stream and append it to temp file
            if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        } else {
            if (!$in = @fopen("php://input", "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        }

        while ($buff = fread($in, 4096)) {
            fwrite($out, $buff);
        }

        @fclose($out);
        @fclose($in);

        rename("{$filePath}_{$chunk}.parttmp", "{$filePath}_{$chunk}.part");

        $index = 0;
        $done = true;
        for ($index = 0; $index < $chunks; $index++) {
            if (!file_exists("{$filePath}_{$index}.part")) {
                $done = false;
                break;
            }
        }
        if ($done) {
            if (!$out = @fopen($uploadPath, "wb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
            }

            if (flock($out, LOCK_EX)) {
                for ($index = 0; $index < $chunks; $index++) {
                    if (!$in = @fopen("{$filePath}_{$index}.part", "rb")) {
                        break;
                    }

                    while ($buff = fread($in, 4096)) {
                        fwrite($out, $buff);
                    }

                    @fclose($in);
                    @unlink("{$filePath}_{$index}.part");
                }

                flock($out, LOCK_UN);
            }
            @fclose($out);
        }

        // Return Success JSON-RPC response
        $imgdata = array('jsonrpc' => 2.0, 'result' => null, 'id' => $chunks, 'picurl' => '/' . $uploadPath,);
        $this->ajaxReturn($imgdata);
        //die('{"jsonrpc" : "2.0", "result" : null, "id" : "id","picurl":$uploadPath}');
        // Define a destination
    }

    //图片上传裁剪示例
//    public function index() {
//        $this->display();
//    }
    //图片上传
    public function upPicOne() {
        $file = $_POST['imgfile'];
        if ($file) { //图片保存文件夹
            $file = $file . "/";
        }
        $config = array(
            'maxSize' => 3145728,
            'rootPath' => './Public/Uploads/' . $file,
            'exts' => array('jpg', 'gif', 'png', 'jpeg'),
            'subName' => '',
        );
        $upload = new \Think\Upload($config); // 实例化上传类
        
        // 上传文件 

        $info = $upload->uploadOne($_FILES['file']);
        $url = "/Public/Uploads/" . $file . $info['savepath'] . $info['savename'];
        
        if (!$info) {
            $this->ajaxReturn("false", "EVAL");
        } else {
            $this->ajaxReturn($url, "EVAL");
        }
    }

    //删除图片
    public function delimg() {
        $imgurl = $_POST["imgurl"]; //之前长传的图片
        unlink("." . $imgurl); //删除之前的图片
        $this->ajaxReturn(true);
    }

    //图片裁剪保存
    public function imgcrop() {
        if ($_POST) {
            //获取原图路径
            $src = $_POST['src'];
            //取得原图像的信息
            $source_path = substr($src, 1); //截取“/Public”后面的字母
            //取得原图像的信息
            $source_info = getimagesize($source_path);
            $source_w = $source_info[0];
            $source_h = $source_info[1];
            $source_mime = $source_info['mime'];

            //取得页面截取参数
            $postx = $_POST['x'];
            $posty = $_POST['y'];
            $postw = $_POST['w'];
            $posth = $_POST['h'];

            //确定实际图像的x、y、w、h
            $true_x = $postx;
            $true_y = $posty;
            $true_w = $postw;
            $true_h = $posth;
            //目标存储规格
            $targ_w = $_POST['targw'];
            $targ_h = $_POST['targh'];
            $jpeg_quality = 100;
            //根据图片类型创建
            switch ($source_mime) {
                case 'image/gif':
                    $source_image = imagecreatefromgif($source_path);
                    break;

                case 'image/jpeg':
                    $source_image = imagecreatefromjpeg($source_path);
                    break;

                case 'image/png':
                    $source_image = imagecreatefrompng($source_path);
                    break;

                default:
                    $newSrc = $_POST['src'];
                    $this->ajaxReturn($newSrc);

                    return false;
                    break;
            }
            $dst_r = ImageCreateTrueColor($targ_w, $targ_h);
            imagecopyresampled($dst_r, $source_image, 0, 0, $true_x, $true_y, $targ_w, $targ_h, $true_w, $true_h);
            //获取文件的路径
            $fileurls = explode(".", $src);
            $rand = rand(10, 99);
            //根据图片类型存储图片
            switch ($source_mime) {
                case 'image/gif':
                    imagegif($dst_r, $source_path);
                    rename("." . $src, "." . $fileurls[0] . $rand . ".gif");
                    $newSrc = $fileurls[0] . $rand . ".gif";
                    break;

                case 'image/jpeg':
                    imagejpeg($dst_r, $source_path, $jpeg_quality);
                    rename("." . $src, "." . $fileurls[0] . $rand . ".jpg");
                    $newSrc = $fileurls[0] . $rand . ".jpg";
                    break;

                case 'image/png':
                    imagepng($dst_r, $source_path);
                    rename("." . $src, "." . $fileurls[0] . $rand . ".png");
                    $newSrc = $fileurls[0] . $rand . ".png";
                    break;

                default:

                    $newSrc = "11111.png";
                    $this->ajaxReturn($newSrc);
                   // return false;
                    break;
            }
            imagedestroy($dst_r);
            $this->ajaxReturn($newSrc);
        }
    }

}
