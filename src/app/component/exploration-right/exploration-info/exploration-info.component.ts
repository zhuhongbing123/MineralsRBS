import { Component, OnInit } from '@angular/core';
declare let PDFObject;


@Component({
  selector: 'app-exploration-info',
  templateUrl: './exploration-info.component.html',
  styleUrls: ['./exploration-info.component.scss']
})
export class ExplorationInfoComponent implements OnInit {

  public explorationInfoTitle:any;//探矿权列表标题
  public explorationValue: any[] = [];//探矿权列表数据
  public detailsDisplay = false;//是否显示详情页面
  public exampleDisplay = false;//是否显示预览
  constructor() { }

  ngOnInit() {
    this.setTableValue();
   
  }

  //初始化表格
  public setTableValue(){
    this.explorationInfoTitle=[
      { field: 'name', header: '名称' },
      { field: 'time', header: '时间' },
      { field: 'type', header: '类型' },
      { field: 'operation', header: '操作' }
    ];
    this.explorationValue = [
      {
        name:'矿业局开工报告',
        time:'2019.2.2',
        type:'矿权人信息'
      },
      {
        name:'矿业局坐标',
        time:'2019.3.2',
        type:'坐标范围(坐标系)'
      },
      {
        name:'矿业局勘查报告',
        time:'2019.4.2',
        type:'勘查阶段'
      },
      {
        name:'南山矿种分析',
        time:'2019.5.2',
        type:'矿种'
      }
    ]
  }
  //查看详情
  public goDetails(value){
    this.detailsDisplay = true;
  }
  //返回列表
  public goBack(){
    this.detailsDisplay = false;
  }

  //查看PDF
  public lookPDF(){
    PDFObject.embed("./assets/js/房源表.pdf","#example-pdf");
    this.exampleDisplay =true;
    
  }
}
