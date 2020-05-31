import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MiningStatistics } from '../../../common/util/app-config';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-mining-statistics',
  templateUrl: './mining-statistics.component.html',
  styleUrls: ['./mining-statistics.component.css']
})
export class MiningStatisticsComponent implements OnInit {

  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数
  miningStatisticsInfo: MiningStatistics = new MiningStatistics();//一条矿山统计数据

  miningStatisticsTitle: any;//矿山统计标题
  miningStatisticsValue: any[] =[];//矿山统计数据
  setStatisticsDisplay = false;//新增、修改弹出框是否显示
  allProjectName;//所有的项目名称
  mineralOwner;//所有矿权人名称
  modifyStatistics = false;//是否修改
  constructor(private httpUtil: HttpUtil,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,) { }

  ngOnInit() {
    this.setTableValue();
  }

  public setTableValue() {
    this.miningStatisticsTitle = [
      { field: 'projectName', header: '矿山名称' },
      { field: 'owner_id', header: '采矿权人' },
      { field: 'implementPlan', header: '实施方案' },
      { field: 'implementProgress', header: '建设进程' },
      { field: 'selfInvestigation', header: '自评情况' },
      { field: 'thirdPartyInvestigation', header: '第三方评估结果' },
      { field: 'projectAcceptance', header: '验收情况' },
      { field: 'projectRating', header: '评级' },
      { field: 'comment', header: '备注' }
    ];
    this.getProjectName();
  };
  
  //获取矿山统计数据
  getMiningStatistics(){
    this.httpUtil.get('mineral-green-mining/list/' + this.startPage + '/' + this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.greenMinings.list;
        for (let i = 0; i < data.length; i++){
          data[i]['number'] = (this.startPage - 1) * this.limit + i + 1;
          for (let j in this.mineralOwner){
            if (data[i].ownerId === this.mineralOwner[j].id){
              data[i]['owner_id'] = this.mineralOwner[j].ownerName;
              }
          }
          for (let j in this.allProjectName) {
            if (data[i].projectId === this.allProjectName[j].projectId) {
              data[i]['projectName'] = this.allProjectName[j].projectName;
            }
          }
          
        }
        this.miningStatisticsValue = data;
      }
    })
  }

  /* 获取矿权项目名称 */
  getProjectName() {
    this.httpUtil.get('mineral-project/name/0').then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.projectNames;
        for (let i in data) {
          data[i]['label'] = data[i].projectName;
          data[i]['value'] = data[i].projectId;
        }
        this.allProjectName = data;
        this.getMineralOwner();
      }
    })
  }

  /*  获取矿权人*/
  getMineralOwner() {
    this.httpUtil.get('mineral-owner/list/1/10000').then(value => {
      if (value.meta.code === 6666) {
        let data = value.data.mineralOwners.list;
        for (let i in data) {
          data[i]['label'] = data[i].ownerName;
          data[i]['value'] = data[i].id;
        }
        this.mineralOwner = data;
        this.getMiningStatistics();
      }
    })
  }
  //修改、新增、删除
  setStatistics(type,value){
    
    if(type =='add'){
      this.miningStatisticsInfo = new MiningStatistics();
      this.setStatisticsDisplay = true;
      this.modifyStatistics = false;
      return;
    }
    if (type == 'modify'){
      this.miningStatisticsInfo = value;
      this.setStatisticsDisplay = true;
      this.modifyStatistics = true;
      return;
    }
    if (type == 'delete') {
      this.confirmationService.confirm({
        message: '确认删除该条数据吗?',
        header: '删除文件',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '确定',
        rejectLabel: '取消',
        accept: () => {
          this.httpUtil.delete('mineral-green-mining/' + value.id).then(value => {
            if (value.meta.code === 6666) {
              this.getMiningStatistics();
              this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '删除成功' });
            }
          })
        },
        reject: () => {

        }
      });
      return;
    }

  }

  /* 保存新增、修改 */
  saveStatistics(){
    let data = this.miningStatisticsInfo;
    if (!this.miningStatisticsInfo.projectId){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '矿山名称不能为空' });
      return;
    }
    if (!this.miningStatisticsInfo.ownerId) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: '警告', detail: '采矿权人不能为空' });
      return;
    }
    if(this.modifyStatistics){
      this.httpUtil.put('mineral-green-mining', data).then(value => {
        if (value.meta.code === 6666) {
          this.getMiningStatistics();
          this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '修改成功' });
          this.setStatisticsDisplay = false;
        }
      })
      return;
    }
    for(let i in data){
      delete data[i].id;
    }
    this.httpUtil.post('mineral-green-mining', data).then(value=>{
      if (value.meta.code === 6666) {
        this.getMiningStatistics();
        this.messageService.add({ key: 'tc', severity: 'success', summary: '信息', detail: '新增成功' });
        this.setStatisticsDisplay = false;
      }
    })
  }
}
