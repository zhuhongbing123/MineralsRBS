
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
import { ZoomSlider } from 'ol/control'; 
import { transform } from 'ol/proj';
import { reduce } from 'rxjs/operators';
declare let $;


export class Openlayer {
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

    constructor(private map2dService: Map2dService){}
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
          let osm ;
          if(sessionStorage.getItem('mapIP')!==''){
            osm = new TileWMS({
                url:  sessionStorage.getItem('mapIP'),
                params: {'FORMAT': 'image/jpeg', 
               'VERSION': '1.1.0',
                 tiled: true,
                "LAYERS": 'cite:chinaosm',
                "exceptions": 'application/vnd.ogc.se_inimage',
                tilesOrigin: 73.2467041015625 + "," + 15.149866104126
                    }
            })
          }else{
              osm = new OSM();
          }
          //地图初始化
          this.map = new Map({
            target: this.mapDivId,
            layers: [
              new TileLayer({
                source: osm
              }),
              vector
            ],
            overlays: [this.overlay],
            controls: defaultControls().extend([mousePositionControl]),
        
            view: new View({
              center: [12475533, 4984682],
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

          //地图上的右击事件
         /*  this.map.on('contextmenu',function(event){
        
            
          }) */
          //清除事件
          let that = this;
          //左键点击地图
          this.map.on('click',function(event){
            //this.map.getOverlays().clear();
            let feature = that.map.forEachFeatureAtPixel(event.pixel,
                function(feature) {
                  return feature;
            });
            //点击了直尺按钮，显示提示
            if(that.clickRuler){
                return;
            }
            if(feature && that.clickIcon){
                //显示弹出框
                var coordinate = feature['values_'].geometry.flatCoordinates;
                let aa = ProjectionUtil.toLonLat(coordinate);
                var hdms = toStringHDMS(ProjectionUtil.toLonLat(coordinate));
                that.clickPoint = hdms;
                that.content.innerHTML=
                `<div>坐标: ${hdms}</div>
                <div>
                    <span>名称：${feature['values_'].name?feature['values_'].name:''}</span>
                </div>
                <div style='margin-top:10px'>
                    <span>描述：${feature['values_'].description?feature['values_'].description:''}</span>
                </div>`;
                that.overlay.setPosition(coordinate);
                that.map.addOverlay(that.overlay);

                
            }else{
                that.map.getOverlays().clear();
            }


          })

          /* 关闭弹出框 */
          /* this.closer.onclick = function() {
            that.overlay.setPosition(undefined);
            that.closer.blur;
            return false;
          } */
          //鼠标移动样式
          this.map.on('pointermove',function(e) {
            let feature = that.map.forEachFeatureAtPixel(e.pixel,
                function(feature) {
                  return feature;
            });
            if(!feature){
                that.map.getTargetElement().style.cursor = '';
            }else{
                that.map.getTargetElement().style.cursor = 'pointer';
            }
          })
    
       


        //地图放大缩小
        this.map.on("moveend",function(e){
            var zoom = that.map.getView().getZoom();  //获取当前地图的缩放级别
            that.map.getFeaturesAtPixel
           /*  console.log(zoom);
           // var size = new openLayer.Size(30,30);
            new Icon({
                size: [zoom]
            }) */
            /* if(zoom >= 12){
                tianjinlayer.getSource().clear();   //控制地图图层不可见
            }else{
                addTianjinSource("./areajson/tianjin.geojson",tianjinlayer);   //重新加载地图图层
            } */
        }); 
        
    }

    /* 初始化图标位置 */
    labelPoint(point){
        this.map.getOverlays().clear();
        for(let i in point){
            //var beijing = fromLonLat(point[i].point);
            var label = fromLonLat(point[i].poiCoordinates.split(',').map(Number));
            var iconFeature = new Feature({
                geometry: new Point(label),
                name: point[i].poiName, //名称属性
                description: point[i].description?point[i].description:''
            });
            //设置点要素样式
            iconFeature.setStyle(this.createLabelStyle(iconFeature,point[i]['poiIcon']));
            //矢量标注的数据源
            var vectorSource = new VectorSource();
            //矢量标注图层
            let vectorLayer = new VectorLayer({
                source: vectorSource
            });
            this.vectorLayer.push(vectorLayer)
            vectorSource.addFeature(iconFeature);
            this.map.addLayer(vectorLayer);
        }
        
    }

    /* 地图上标记坐标 */
    signPoint(event,url){
        let coordinate = event.coordinate;
        let point = ProjectionUtil.toLonLat(coordinate);
        var beijing = fromLonLat(point);
        var iconFeature = new Feature({
            geometry: new Point(beijing),
            name: '', //名称属性
        });
        //设置点要素样式
        iconFeature.setStyle(this.createLabelStyle(iconFeature,url));
        //矢量标注的数据源
        var vectorSource = new VectorSource();
        //矢量标注图层
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });
        this.vectorLayer.push(vectorLayer)
        vectorSource.addFeature(iconFeature);
        this.map.addLayer(vectorLayer);
        this.addPoint = true;
       
         this.overlay.setPosition(coordinate);
         //this.map.addOverlay(this.overlay);
         
    }
  
//矢量标注样式设置函数，设置image为图标ol.style.Icon
 createLabelStyle(feature,url){
    return new Style({
        image: new Icon({
            opacity: 0.8,
            src: url,  //图标的URL
            anchor: [0.5,1],
            rotateWithView: true,
            rotation: 0
            

        }),
        text: new Text({
            textAlign: 'center',            //位置
            textBaseline: 'top',         //基准线
            font: 'normal 12px 微软雅黑',    //文字样式
            text: feature.values_.name,      //文本内容
            fill: new Fill({       //文本填充样式（即文字颜色)
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#F00', 
                width: 2
            })
        }),
        
    });

 }

    /* 测距 */
    mapMeasure(){
        let that = this;
        var continuePolygonMsg = 'Click to continue drawing the polygon';
        var continueLineMsg = 'Click to continue drawing the line';
        let output;
        
       let source = new VectorSource();
       var typeSelect = document.getElementById('type');
       var type = typeSelect['value'];
      

       this.draw = new Draw({
            source: source,
            type: type,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
              }),
              image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                })
              })
            })
        });

        this.map.addInteraction(this.draw);

        this.createMeasureTooltip();
        this.createHelpTooltip();
        this.listener;
        this.draw.on('drawstart',
          function(evt) {
            // set sketch
            that.sketch = evt.feature;
      
            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            var tooltipCoord = evt['coordinate'];
      
            that.listener = that.sketch.getGeometry().on('change', function(evt) {
              var geom = evt.target;
               output = that.formatLength(geom);
              if (geom instanceof Polygon) {
                output = that.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof LineString) {
                output = that.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
           
                that.measureTooltipElement.innerHTML = output;
                that.measureTooltip.setPosition(tooltipCoord);
                /* that.helpTooltipElement.innerHTML = '双击鼠标取消测距';
                that.helpTooltip.setPosition(tooltipCoord); */
              
            });
        });
        this.draw.on('drawend',
            function() {
                /* that.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                that.measureTooltip.setOffset([0, -7]); */
                // unset sketch
                that.sketch = null;
                // unset tooltip so that a new one can be created
                //that.measureTooltipElement = null;
                that.createMeasureTooltip();
                unByKey(that.listener);
                
                setTimeout(() => {
                    that.clickRuler = false;
                }, 100);
                $("#clear_measure_location").hide();
                that.map.removeInteraction(that.draw);
        });
    }

    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
    */
    formatArea = function(polygon) {
        var area = getArea(polygon);
        var output;
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
    */
    formatLength = function(line) {
        var length = getLength(line);
        var output;
        if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
        } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
        }
        return output;
    };
    /**
     * Creates a new measure tooltip 创建一个新的测量工具提示
    */
    createMeasureTooltip() {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            autoPan:true,
            autoPanAnimation:{
              duration:250
            }
        })
        this.map.addOverlay(this.measureTooltip);
    }

    /**
     * Creates a new help tooltip
    */
    createHelpTooltip() {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip ol-tooltip-help';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            autoPan:true,
            autoPanAnimation:{
              duration:250
            }
        });
        this.map.addOverlay(this.helpTooltip);
    }


      /* 地图的交互(画圆、多边形) */
    addInteractions(type,clickType) {
        this.clickIcon = false;
        let source = new VectorSource();
        this.map.removeInteraction(this.draw);
        
        if(type=='Box'){
            this.draw = new Draw({
                source: source,
                type: type,
                geometryFunction: createBox()
            });
            this.map.addInteraction(this.draw);
            //this.map.removeInteraction(draw);
            //return;
        }else{
            this.draw = new Draw({
                source: source,
                type: type
            });
            this.map.addInteraction(this.draw);
        }
        
        
        let that = this;
        
        this.draw.on('drawend',function(evt) {
            if(type!=='Circle'){
                that.getPolygonView(evt,that.draw,clickType);
                return;
            }
                
                let points= evt.feature.getGeometry()['flatCoordinates'];
                that.basic.option = points;
                let startPoint = [];
                let endPoint = [];
                
                for(let i=0; i<points.length;i++){
                    if(i<2){
                        startPoint.push(points[i])
                    }else{
                        endPoint.push(points[i])
                    }
                    
                } 
                let dx2 =  Math.pow(startPoint[0] - endPoint[0], 2);
                let dy2 =  Math.pow(startPoint[1] - endPoint[1], 2);
                let distance = Math.sqrt(dx2 + dy2);//半径
                //圆形,中心点和半径
		        let cricle = new Circle([startPoint[0] ,startPoint[1]] , distance) ;
                var iconFeature = new Feature({
                    geometry: cricle,
                    labelPoint: new Point([startPoint[0],startPoint[1]])
                });
                //矢量标注的数据源
                var vectorSource = new VectorSource();
                //矢量标注图层
                let vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: new Style({
                        fill: new Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new Stroke({
                            color: '#007ad9',
                            width: 2
                        }),
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({
                            color: '#ffcc33'
                            })
                        }),
                        text: new Text({
                            font: '16px',
                            text:  '临时区域',
                            fill: new Fill({
                                color: 'red'
                            })
                        })
                    })
                });
                that.vectorLayer.push(vectorLayer)
                vectorSource.addFeature(iconFeature);
                that.map.addLayer(vectorLayer);
                that.map.removeInteraction(that.draw);//清除画图事件
                setTimeout(()=>{
                    that.clickIcon = true;//可以点击地图图标
                },100);
                //回调
                that.map2dService.areaLocation({
                    points:points,
                    type:clickType
                })
                
        });
      
    }

    /* 地图多边形显示 */
    getPolygonView(event,draw,clickType){
        let geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857'
              }
            },
            'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': []
                }
              }]
        }

        let points= event.feature.getGeometry()['flatCoordinates'];
        this.basic.option = points;
        geojsonObject.features[0].geometry.coordinates[0]= this.group(points,2);
        
        var source = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObject)
        });
          
        var layer = new VectorLayer({
            source: source,
            style: new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new Stroke({
                        color: '#007ad9',
                        width: 2
                    }),
                    image: new CircleStyle({
                        radius: 7,
                        fill: new Fill({
                        color: '#ffcc33'
                        })
                    }),
                    text: new Text({
                        font: '16px',
                        text:  '临时区域',
                        fill: new Fill({
                            color: 'red'
                        })
                    })
            })
        });
        this.map.addLayer(layer);
        this.map.removeInteraction(draw);//清除画图事件
        setTimeout(()=>{
            this.clickIcon = true;//可以点击地图图标
        },100);
        this.map2dService.areaLocation({
            points:points,
            type:clickType
        })
        
    }
    //将数组分成多个数组
    group(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while(index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }
      /* 图标聚类 */
      clusterMap(){
        var distance = document.getElementById('distance');
        for(let i in this.vectorLayer){
            this.map.removeLayer(this.vectorLayer[i]);//清除掉之前的坐标图层
        }
       
        var count = 2;
        var features = new Array(count);
        var e = 4500000;
        let point=[{
            point:[116.28,39.54],
            name:'北京市'
        },{
            point:[105.7282,38.8515],
            name:'阿拉善'
        }];
        
        
        for (var i = 0; i < point.length; ++i) {
            var beijing = fromLonLat(point[i].point);
            features[i] = new Feature(new Point(beijing));
        }

        var source = new VectorSource({
            features: features
        });

        var clusterSource = new Cluster({
            distance: parseInt(distance['value'], 10),
            source: source
        });

        var styleCache = {};
        this.clustersLayer = new VectorLayer({
            source: clusterSource,
            style: function(feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (!style) {
                style = new Style({
                    image: new CircleStyle({
                    radius: 10,
                    stroke: new Stroke({
                        color: '#fff'
                    }),
                    fill: new Fill({
                        color: '#3399CC'
                    })
                    }),
                    text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                        color: '#fff'
                    })
                    })
                });
                styleCache[size] = style;
                }
                return style;
            }
        });
        var raster = new TileLayer({
            source: new OSM()
          });
        this.map.addLayer(raster);
        this.map.addLayer(this.clustersLayer);

      }

      /* 定位 */
      locatorCard(point,zoom){
          //定位地图某一点
          var points = fromLonLat(point);
        var viewAnimate = this.map.getView();
        viewAnimate.animate({zoom: zoom}, {center: points,duration: 2000});
      }

      /* 区域初始化 */
      areaPoint(data){
        
        for(let i=0; i<data.length;i++){
            let point;
            if( data[i].areaCoordinates &&  data[i].areaCoordinates.coordinates){
                point = data[i].areaCoordinates.coordinates.split(',').map(Number)
            }else{
                point = data[i].areaCoordinates?data[i].areaCoordinates.split(',').map(Number):'';
            }
            
            let areaName = '';
            let areaColor = '';
            let areaOpacity;
            areaName = data[i].areaName?data[i].areaName:data[i].projectName;
            areaOpacity =  data[i].areaOpacity?parseInt(data[i].areaOpacity)/100:1;
            areaColor = data[i].areaBackground?data[i].areaBackground:data[i].areaColor;
            //初始化圆形
            if(point.length ==4){
                let dx2 =  Math.pow(point[0] - point[2], 2);
                let dy2 =  Math.pow(point[1] - point[3], 2);
                let distance = Math.sqrt(dx2 + dy2);//半径
                //圆形,中心点和半径
		        let cricle = new Circle([point[0] ,point[1]] , distance) ;
                var iconFeature = new Feature({
                    geometry: cricle,
                    labelPoint: new Point([point[0],point[1]]),
                    name:areaName,
                    description: data[i].description
                });
                //矢量标注的数据源
                var vectorSource = new VectorSource();
                //矢量标注图层
                let vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: new Style({
                        fill: new Fill({
                            color: areaColor
                        }),
                        stroke: new Stroke({
                            color: '#007ad9',
                            width: 2
                        }),
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({
                            color: '#ffcc33'
                            })
                        }),
                        text: new Text({
                            font: '16px',
                            text:  areaName,
                            fill: new Fill({
                                color: '#333333'
                            })
                        })
                    }),
                    opacity: areaOpacity
                });
                this.vectorLayer.push(vectorLayer)
                vectorSource.addFeature(iconFeature);
                this.map.addLayer(vectorLayer);
                continue;
            }
            //初始化多边形
            let geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                  'type': 'name',
                  'properties': {
                    'name': 'EPSG:3857'
                  }
                },
                'features': []
            }
            
            geojsonObject.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': [this.group(point,2)],
                  'name':areaName
                },
                'name':areaName,
                'description': data[i].description?data[i].description:''
            })
            var source = new VectorSource({
                features: (new GeoJSON()).readFeatures(geojsonObject)
              });

              var layer = new VectorLayer({
                source: source,
                style: new Style({
                        fill: new Fill({
                            color: areaColor
                        }),
                        stroke: new Stroke({
                            color: '#007ad9',
                            width: 2
                        }),
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({
                            color: '#ffcc33'
                            })
                        }),
                        text: new Text({
                            font: '16px',
                            text:  areaName,
                            fill: new Fill({
                                color: '#333333'
                            })
                        })
                }),
                opacity: areaOpacity
            });
            this.vectorLayer.push(layer)
            this.map.addLayer(layer);
        }
        
          
      }

}