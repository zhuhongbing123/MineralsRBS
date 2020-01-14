import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts'
@Component({
  selector: 'app-environment-monitoring',
  templateUrl: './environment-monitoring.component.html',
  styleUrls: ['./environment-monitoring.component.scss']
})
export class EnvironmentMonitoringComponent implements OnInit {
  environmentItems;
  historyDataDisplay = false;
  liveDataDisplay = true;
  liveTableTitle;//实时数据标题
  liveTableValue;//实时数据表格内容
  liveData;
  liveO2;
  liveSO2;
  liveNOx;
  startTime = new Date();
  endTime = new Date();
  constructor() { }

  ngOnInit() {
    this.environmentItems = [
      {label: '实时监测'},
      {label: '历史数据'}
    ];
    this.liveTableTitle = [
      { field: 'name', header: '名称' },
      { field: 'measuredValue', header: '测量值' },
      { field: 'unit', header: '单位' },
      { field: 'max', header: '排放上限' },
      { field: 'state', header: '状态' },
    ];
    this.getLiveData();
    let that =this;
    setInterval(function () {
    
      that.liveData = parseFloat((Math.random() * 100).toFixed(2)) - 0;
      that.liveO2 = parseFloat((Math.random() * 100).toFixed(2)) - 0;
      that.liveSO2 = parseFloat((Math.random() * 100).toFixed(2)) - 0;
      that.liveNOx = parseFloat((Math.random() * 100).toFixed(2)) - 0;
      that.getLiveData();
    },2000);
    this.getEchart();
  }

  getLiveData(){
    this.liveTableValue = [
      {
        name:'O2(干)',
        measuredValue:this.liveO2,
        unit:'%',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'烟气温度',
        measuredValue:this.liveData,
        unit:'℃',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'烟气压力',
        measuredValue:this.liveData,
        unit:'Pa',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'烟气湿度',
        measuredValue:this.liveData,
        unit:'%',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'烟气流速',
        measuredValue:this.liveData,
        unit:'m/s',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'颗粒物(湿)',
        measuredValue:this.liveData,
        unit:'μg/m3',
        max:'0.2',
        state:'已达上限值'
      },
      {
        name:'SO2(干)',
        measuredValue:this.liveSO2,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'NOx(干)',
        measuredValue:this.liveNOx,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'颗粒物(干)',
        measuredValue:this.liveData,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'颗粒物(折算值)',
        measuredValue:this.liveData,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'SO2(折算值)',
        measuredValue:this.liveSO2,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'NOx(折算值)',
        measuredValue:this.liveNOx,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
      {
        name:'颗粒物(排放率)',
        measuredValue:this.liveData,
        unit:'mg/m3',
        max:'12',
        state:'已达上限值'
      },
    ];
    for(let i in this.liveTableValue){
      if(parseFloat(this.liveTableValue[i].measuredValue)<=parseFloat(this.liveTableValue[i].max)){
        this.liveTableValue[i].state = '测量';
      }
    }
  }

  getEchart(){
    let chart1 = echarts.init(document.getElementById("environment"));
    let option = {
      title: {
          text: '历史数据'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: ['O2(干)', '烟气温度', '烟气压力', '烟气湿度', '烟气流速'],
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
      },
      grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              name: 'O2(干)',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
          },  
          {
              name: '烟气温度',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
              name: '烟气压力',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
              name: '烟气湿度',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '烟气流速',
              type: 'line',
              stack: '总量',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
    };
    chart1.setOption(option, true);
  }
  /* 切换tab页 */
  menuClick(event){
    if(event =='实时监测'){
      this.historyDataDisplay = false;
      this.liveDataDisplay  = true;
    }else if(event =='历史数据'){
      this.liveDataDisplay  = false;
      this.historyDataDisplay = true;
    }else if(event =='报警页面'){
      this.liveDataDisplay  = true;
      this.historyDataDisplay = false;
    }
  }
}
