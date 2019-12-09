import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';

@Component({
  selector: 'app-policy-report',
  templateUrl: './policy-report.component.html',
  styleUrls: ['./policy-report.component.scss']
})
export class PolicyReportComponent implements OnInit {
  constructor(private httpUtil: HttpUtil) { }

  ngOnInit() {
  }

}
