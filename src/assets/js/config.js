/*
 全局变量，用于跨域请求，ajax请求URL处最前面拼接上去
 例："http:// + Ip";
*/
var AJAX_URL = "";

/*
 全局变量,用于配置系统版本
*/
var VERSION = "3.0.0";

/*
 全局变量，mqtt客户端链接地址，
 例：ws://+IP+':端口/'
*/
var WS_URL = "ws://" + location.hostname + ":9001/";

/*
 全局函数，封装ajax请求，
 需传入四个参数url,data,type,callback
*/
var HG_AJAX = function(url, data, type, callback) {
    $.ajax({
        type: type,
        url: AJAX_URL + url,
        data: data,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if(data.type != 0) {
                callback(data);
            } else {
                console.error('未登录，即将跳转至登录界面...');
            }
        }
    })
};

/*
 封装弹窗提醒框
*/
var HG_MESSAGE = function(content) {
    layer.open({
        content: content,
        title: ['信息', 'text-align:left;margin:0;background:#32404a;color:#eee'],
        shadeClose: false,
        btn: '确定'
    });
};

/*
 警报配置,true为打开
*/
var ALARM_TOP_CONFIG = {
    enter_cross_area: true, //进入越界
    leave_cross_area: true, //离开越界
    danger_source: true, //危险源
    over_man: true, //聚众
    area_disappear: true, //消失
    area_over_time: true, //超时
    area_static: true, //不动
    escort: true, //陪同
    stray: true, //离群
    dismantle: true, //强拆
    get_help: true, //求救
    custody: true, //监护组
    fall:true,               //跌倒
    station:true,             //基站报警
    no_card:true,            //无卡报警
    heart_error:true         //心率异常
};

// 3d的全局配置
var CONFIG_3D = {
    sky_box:true,    //天空盒子
    little_map:true,  //小地图
    card_type:1,    //1 代表的fbx，2 代表的是json
    open_shadow:true, //是否开启阴影
    cluster_enable:true //是否开启标签卡聚集人数
};

//mqtt用户名密码
var MQTT_INFO = {
    username:"admin123",
    password:"admin123"
};

var BASE_STATION_INFO_TABLE = {
    G02D01:{
        name:"86盒WIFI站",
        type:1
    },
    G02D11:{
        name:"86盒AC站",
        type:1
    },
    G02D02:{
        name:"86盒POE站",
        type:1
    },
    G02D04:{
        name:"吸顶站",
        type:0
    },
    G02D07:{
        name:"室外WIFI站",
        type:2
    },
    G02D09:{
        name:"室外POE站",
        type:3
    },
    X02D09:{
        name:"室外吸顶站",
        type:3
    },
    G02D10:{
        name:"室外POE+DC站",
        type:2
    },
    G02D12:{
        name:"本安站",
        type:0
    }
};
