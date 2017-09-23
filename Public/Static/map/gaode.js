/**
 * Created by yinshiru on 2017/7/15.
 */
$(function () {
    $('#city').blur(function () {
        var city = $('#city').val();
        Mapplace(city);
    })
    var inital = '北京';

    function Mapplace(city) {
        var windowsArr = [];
        var marker = [];
        var map = new AMap.Map("mapContainer", {
            resizeEnable: true,
            center: [116.397428, 39.90923],//地图中心点
            zoom: 13,//地图显示的缩放级别
            keyboardEnable: false
        });
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
            var autoOptions = {
                city: city, //城市，默认全国
                input: "keyword"//使用联想输入的input的id
            };
            autocomplete = new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({
                city: '北京',
                map: map
            })
            AMap.event.addListener(autocomplete, "select", function (e) {
                //TODO 针对选中的poi实现自己的功能
                placeSearch.search(e.poi.name)
            });
        });
    }

    Mapplace(inital);
})