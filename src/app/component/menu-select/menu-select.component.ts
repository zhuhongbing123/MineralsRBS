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
  aaa(){
    this.router.navigate(['/layout/explorationRight/explorationInfo']);
  }
}
