import { Component, OnInit } from '@angular/core';
import { Openlayer } from '../../../common/map/openlayer';
import { Map2dService } from '../../../common/map/map2-d/map2-d.service';

@Component({
  selector: 'app-project-map',
  templateUrl: './project-map.component.html',
  styleUrls: ['./project-map.component.css']
})
export class ProjectMapComponent implements OnInit {
  OlFloorMap: Openlayer;
  constructor(private map2dService: Map2dService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.OlFloorMap = new Openlayer(this.map2dService);
    this.OlFloorMap.mapDivId = 'projectMap';
    this.OlFloorMap.fullMap = false;
    this.OlFloorMap.initMap();
  }
}
