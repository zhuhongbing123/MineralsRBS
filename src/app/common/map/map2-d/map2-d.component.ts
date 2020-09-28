import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Openlayer } from '../openlayer';
import { unByKey } from 'ol/Observable';
import { OutdoorComponent } from '../../../component/map/outdoor/outdoor.component';
import { Map2dService } from './map2-d.service';
import { MapLocationArea, MapLocationLabel } from '../../util/app-config';
import { OSM } from 'ol/source';
declare let $;
@Component({
  selector: 'app-map2-d',
  templateUrl: './map2-d.component.html',
  styleUrls: ['./map2-d.component.scss']
})
export class Map2DComponent implements OnInit {
  @Input() mapDivId;//地图的id识别
  @Output() fromChild = new EventEmitter<any>(); //暴露一个输出属性
  OlFloorMap: Openlayer;
  iconUrl;
  map;
  oldIconValue = [];//初始化时的图标数据
  oldAreaValue = [];//初始化时的区域数据
  zoom;
  constructor(private outdoorComponent: OutdoorComponent,
              private map2dService: Map2dService) { 
                this.map2dService.areaLocationCommon$.subscribe(value=>{
                  if(value.type=='area'){
                    
                    this.outdoorComponent.mapLocationArea = new MapLocationArea();
                    this.outdoorComponent.mapLocationArea.areaColor = '#ff0044';
                    this.outdoorComponent.areaOpacity = 1;
                    this.outdoorComponent.areaInfoDisplay = true;
                  }else{
                    this.outdoorComponent.areaOpacity = 1;
                    this.outdoorComponent.mineralInfoDisplay=true;

                  }
                  this.outdoorComponent.areaCoordinate = value.points;
                  this.zoom = this.OlFloorMap.map.getView().getZoom();
                })
              }

  ngOnInit() {
    let that = this;
    window.onresize = function(){
      if(document.getElementById('main_content')){
        document.getElementById('main_content').style.width = document.getElementById('layout-main').offsetWidth+"px";
        that.removeLayer();
        for(let i in that.oldIconValue){
          that.initializeLabel(that.oldIconValue[i]);
        }
        
        for(let i in that.oldAreaValue){
          that.initializeArea(that.oldAreaValue[i])
        }
        
        }
    }
  }

  ngAfterViewInit(){
    this.OlFloorMap = new Openlayer(this.map2dService);
    this.OlFloorMap.mapDivId = this.mapDivId;
    this.OlFloorMap.initMap();
    this.map = this.OlFloorMap.map;
     //禁止网页自带的右击事件
    document.getElementById(this.mapDivId).oncontextmenu = function(e){
      　　return false;
    }
            
    /* 关闭弹出框 */
    let that = this;
      this.OlFloorMap.closer.onclick = function() {
        that.OlFloorMap.overlay.setPosition(undefined);
        that.OlFloorMap.closer.blur;
        return false;
      }
  }

  
  /* 定位 */
  locatorCard(point,zoom){
    this.OlFloorMap.locatorCard(point,zoom);
  }

  /* 添加定位标记点 */
  signPoint(url){
    let that = this;
    this.iconUrl = JSON.parse(JSON.stringify(url));
    this.OlFloorMap.addPoint = false;
    
    this.OlFloorMap.map.on('pointermove',function(e) {
      
      if(that.OlFloorMap.addPoint){
        return;
      }else{

        that.OlFloorMap.map.getTargetElement().style.cursor= 'pointer';
      }
      
    })

    this.OlFloorMap.map.on('singleclick',function(event){
      //已经添加了定位标记
      if(that.OlFloorMap.addPoint ){
        return;
      }
      
      that.OlFloorMap.signPoint(event,that.iconUrl);
      that.outdoorComponent.locationPointCoordinate = event.coordinate;
      that.outdoorComponent.mapLocationLabel = new MapLocationLabel();
      that.outdoorComponent.labelInfoDisplay = true;
    })
  }
  /* 测距 */
  mapMeasure(){
    this.OlFloorMap.mapMeasure();
    $("#clear_measure_location").show();
    this.OlFloorMap.clickRuler = true;
    this.OlFloorMap.addPoint = true;
  }

  /* 取消测距 */
  clearMeasure(){
    $("#clear_measure_location").hide();
    this.OlFloorMap.clickRuler = false;
    /* this.OlFloorMap.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    this.OlFloorMap.measureTooltip.setOffset([0, -7]); */
    unByKey(this.OlFloorMap.listener);
    this.OlFloorMap.sketch = null;
    this.OlFloorMap.map.removeInteraction(this.OlFloorMap.draw);
    this.OlFloorMap.createMeasureTooltip();
  }

/* 画点线面 */
  addInteractions(type,clickType){
    this.OlFloorMap.addPoint = true;
    this.OlFloorMap.addInteractions(type,clickType);
  }
/* 地图中删除互动 */
  removeInteraction(){
    this.OlFloorMap.map.removeInteraction(this.OlFloorMap.draw);
    this.OlFloorMap.map.removeOverlay(this.OlFloorMap.overlay)

    this.OlFloorMap.map.getOverlays().clear();
    this.OlFloorMap.addPoint = true;
  }

  /* 删除临时图层 */
  removeTemporary(){
        //删除添加的临时图层
    this.OlFloorMap.map.removeLayer(this.OlFloorMap.vectorLayer[this.OlFloorMap.vectorLayer.length-1]);

  }

  /* 清除地图所有图层 */
  removeLayer(){
    //this.OlFloorMap.map.getLayers().get
    let layer = this.OlFloorMap.vectorLayer;
    for(let i in layer){
      this.OlFloorMap.map.removeLayer(layer[i])
    }
  }
/* 初始化图标 */
  initializeLabel(value){   
    this.OlFloorMap.labelPoint(value);
  }
  /* 初始化区域 */
  initializeArea(value){
    this.OlFloorMap.areaPoint(value);
  }
}
