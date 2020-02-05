
import TileLayer from 'ol/layer/Tile';
import {OSM, Vector as VectorSource, Cluster, XYZ, TileWMS} from 'ol/source.js';
import MousePosition from 'ol/control/MousePosition';

import {defaults as defaultControls, FullScreen, ScaleLine} from 'ol/control';
import Map from 'ol/Map';
import View from 'ol/View';
import { toStringHDMS, createStringXY } from 'ol/coordinate';
import * as ProjectionUtil from 'ol/proj';
import { Overlay, Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { Group as LayerGroup,  Vector as VectorLayer, Image, } from 'ol/layer.js';
import { Modify, Snap} from 'ol/interaction';
import Draw, { createBox } from 'ol/interaction/Draw';
import {LineString, Polygon, Circle} from 'ol/geom';
import {getArea, getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';
import { DrawEvent } from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import { Basic, MapLocationLabel } from '../util/app-config.js';
import { Map2dService } from './map2-d/map2-d.service.js';
import {ZoomSlider} from 'ol/control';
import { reduce } from 'rxjs/operators';
declare let $;


export class OpenlayerTest {
    map: Map;
    view: View;
    overlay: Overlay;
    _mapDivId: string;
    vectorLayer = [];
    clustersLayer: VectorLayer;
    addPoint = false;//是否添加了定位图标
    measureTooltipElement;//测量工具提示信息
    measureTooltip;//显示测量结果
    fullMap = true;//地图全屏按钮
    helpTooltipElement;//帮助工具提示信息
    helpTooltip;
    sketch;// Currently drawn feature.
    container = document.getElementById('popup');//弹出框
    content = document.getElementById('popup-content');//弹出框内容
    closer = document.getElementById('popup-closer');//弹出框关闭按钮
    clickPoint;//点击地图的坐标
    clickIcon = true;//点击地图图标
    draw;//初始化画图
    clickRuler = false;//点击测距攻击按钮
    listener;//测距初始化的值

    basic: Basic = new Basic();//图标信息数据初始化

     /**
     * Get Map DIV component Id
     */
    public get mapDivId(): string {
        return this._mapDivId;
    }

    /**
     * Set Map DIV component Id
     */
    public set mapDivId(value: string) {
        this._mapDivId = value;
    }

    constructor(){}
    public initMap(){
        let fullScreenControl = new FullScreen();//实例化全屏显示控件
        let mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
          });
        /*   var gaodeMapLayer = new TileLayer({
            source: new XYZ({
                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            })
          }) */
         

          var source = new VectorSource();
          var vector = new VectorLayer({
            source: source,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new Stroke({
                color: '#ffcc33',
                width: 2
              }),
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                  color: '#ffcc33'
                })
              })
            })
          });
         this.overlay = new Overlay({
            element: this.container,
            autoPan:true,
            autoPanAnimation:{
              duration:250
            },
            offset: [0, -10 ]
          })

          //地图初始化
          this.map = new Map({
            target: this.mapDivId,
            layers: [
              new TileLayer({
                source: new OSM()/* TileWMS({
                    url: 'http://47.108.139.202:8080/geoserver/gwc/service/wms',
                    params: {'FORMAT': 'image/jpeg', 
                   'VERSION': '1.1.1',
                     tiled: true,
                    "LAYERS": 'cite:chinaosm',
                    "exceptions": 'application/vnd.ogc.se_inimage',
                    tilesOrigin: 73.2467041015625 + "," + 15.149866104126
                        }
                }) */
              }),
              vector
            ],
            overlays: [this.overlay],
            controls: defaultControls().extend([mousePositionControl]),
        
            view: new View({
              center: [11052473, 4057007],
              zoom: 8,
              minZoom: 4
            })
          });
          /* 加载缩放模块 */
          var zoomslider = new ZoomSlider();
          this.map.addControl(zoomslider);
          
        //将全屏显示控件加载到map中
        if(this.fullMap){
            this.map.addControl(fullScreenControl);
        }
        
        //加载比例尺控件  
        var scaleLineControl = new ScaleLine({    
            //设置度量单位为米    
            units: 'metric',    
            target: 'scalebar',    
            className: 'ol-scale-line'    
        });  
        this.map.addControl(scaleLineControl);  


        
    }

}