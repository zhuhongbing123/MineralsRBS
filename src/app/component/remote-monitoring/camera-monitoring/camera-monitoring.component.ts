import { Component, OnInit } from '@angular/core';
import { Openlayer } from '../../../common/map/openlayer';
import Map from 'ol/Map';
import { Map2dService } from '../../../common/map/map2-d/map2-d.service';

@Component({
  selector: 'app-camera-monitoring',
  templateUrl: './camera-monitoring.component.html',
  styleUrls: ['./camera-monitoring.component.scss']
})
export class CameraMonitoringComponent implements OnInit {
  map: Map;
  OlFloorMap: Openlayer;
  cameraLabelValue;
  cameraLabelTitle;
  cameraDisplay = false;
  constructor(private map2dService: Map2dService) { }

  ngOnInit() {
    this.cameraLabelTitle = [
      { field: 'poiName', header: '标注名称' },
      { field: 'description', header: '描述' },
      { field: 'operation', header: '操作' }
    ];
    this.cameraLabelValue = [
      {
        id: 23,
        poiName: "矿山3",
        poiCoordinates: "112.58129889518023,41.24353316274795",
        poiIcon: "assets/img/location_icon/camera.png",
        description: "123"
      },
      {
        id: 24,
        poiName: "矿山4",
        poiCoordinates: "112.968017578125,41.59285092482557",
        poiIcon: "assets/img/location_icon/camera.png",
        description: "123",
      }
    ];
    

  }

  ngAfterViewInit(){
    this.OlFloorMap = new Openlayer(this.map2dService);
    this.OlFloorMap.mapDivId = 'cameraMaps';
    this.OlFloorMap.initMap();
    this.OlFloorMap.labelPoint(this.cameraLabelValue);
    
  }

  /* 操作 */
  setCameraMap(type,value){
    if(type=='location'){
      let point  = value.poiCoordinates.split(',').map(Number)
      this.OlFloorMap.locatorCard(point,6);
    }else{
      this.cameraDisplay = true;
    }
  }
}
