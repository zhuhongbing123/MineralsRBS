import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-select',
  templateUrl: './menu-select.component.html',
  styleUrls: ['./menu-select.component.scss']
})
export class MenuSelectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goMineral(type){
    if(type =='exploration'){
      this.router.navigate(['/layout/explorationRight/explorationInfo']);
    }
    if(type=='mining'){
      this.router.navigate(['/layout/miningRight/miningInfo']);
    }
  }
}
