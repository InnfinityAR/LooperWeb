/**
 * Created by yinshiru on 2017/7/12.
 */
$(function(){
    /*init webuploader*/
    var $list=$("#thelist");
    var $btn =$("#ctlBtn");   //开始上传
    var thumbnailWidth = 100;   //缩略图高度和宽度 （单位是像素），当宽高度是0~1的时候，是按照百分比计算，具体可以看api文档
    var thumbnailHeight = 100;

    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        // swf: '${ctxStatic }/webupload/Uploader.swf',

        // 文件接收服务端。
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        server:'http://localhost:8081/webUploader/fileUpload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.UploadV',

        // 只允许选择图片文件。
        accept: {
            // title: 'Images',
            extensions: 'mp4,flv,avi,png,jpg,jpeg',
            // mimeTypes: 'image/*'
        },
        method:'POST',
    });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {  // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail videoDiv">' +
                '<div class="videoIcon" >'+
                '<img src="/Public/Static/Cropper/images/video.png">' +
                '<span>'+ '1'+'</span>'+
                '</div>' +
                '<div class="infoDiv">' +
                '<div class="info">' + file.name + '</div>' +
                '</div>' +
                '<img class="trash" src="/Public/Static/Cropper/images/trash.png" />' +
                '</div>'
            ),


            $img = $li.find('img');

        $infoDiv = $li.find('.infoDiv');

        $numV = $li.find('.videoIcon span');

        //为视频添加序号
        // $videoDiv =$('.uploader-list')
        $spanLen = $('.uploader-list > div').length;
        // console.log($('.uploader-list'> 'div').length);
        $('.uploader-list > div').each(function(index, el) {
            // console.log($spanLen);
            $numV.text($('.uploader-list > div').length+1);
        });


        // $list为容器jQuery实例
        $list.append( $li );


        // $("#filePicker").css({
        //     display: 'none',
        // });
        // $("#moreUpload").css({
        //     display: 'block',
        // });

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        // uploader.makeThumb( file, function( error, src ) {   //webuploader方法
        //     if ( error ) {
        //         $img.replaceWith('<span>不能预览</span>');
        //         return;
        //     }

        //     $img.attr( 'src', src );
        // }, thumbnailWidth, thumbnailHeight );
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );




    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).addClass('upload-state-done');
    });

    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo(   $infoDiv  );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
    // $btn.on( 'click', function() {
    //     console.log("上传...");
    //     uploader.upload();
    //     console.log("上传成功");
    // });
})