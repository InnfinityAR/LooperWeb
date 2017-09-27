/**
 * Created by yinshiru on 2017/9/27.
 */
    // 获取地址栏id
    function getQueryString1(url, ref){
        var str = url.substr(url.indexOf('?') + 1);
        if (str.indexOf('&') != -1) {
            var arr = str.split('&');
            for (i in arr) {
                if (arr[i].split('=')[0] == ref)
                    return arr[i].split('=')[1];
            }
        }
        else {
            return url.substr(url.indexOf('=') + 1)
        }
    }
