import { Component, OnInit } from '@angular/core';
import { HttpUtil } from '../../../common/util/http-util';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ExplorationProject } from '../../../common/util/app-config';

@Component({
  selector: 'app-mineral-project',
  templateUrl: './mineral-project.component.html',
  styleUrls: ['./mineral-project.component.scss']
})
export class MineralProjectComponent implements OnInit {
  LIMIT_LOGIN = 10;//列表每页显示数量
  startPage = 1;//列表开始的页数
  limit = 10;//列表每页的行数

  projectTotal;//矿权项目列表总数
  mineralProjectTitle;//矿权项目列表标题
  mineralProjectValue;//矿权项目列表数据
  mineralProjectDisplay = false;//矿权项目弹出框
  explorationStartTime;//探矿权首立时间
  miningStartTime;//采矿权首立时间
  mineralProject: ExplorationProject = new ExplorationProject();//矿权项目数据初始化
  constructor(private httpUtil: HttpUtil,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.setTableValue();
  }

  //初始化表格
  public setTableValue(){
    
    this.mineralProjectTitle=[
      { field: 'projectName', header: '项目名称' },
      { field: 'owner_id', header: '矿权人' },
      { field: 'explorationStartTime', header: '探矿权首立时间' },
      { field: 'miningStartTime', header: '采矿权首立时间' },
      { field: 'explorationArea', header: '矿权范围' },
      { field: 'operation', header: '操作' }
    ];
    this.getExplorationInfo()
  }

  /* 获取矿权项目数据 */
  getExplorationInfo(){
    this.httpUtil.get('mineral-project/list/'+this.startPage+'/'+this.limit).then(value=>{
      if (value.meta.code === 6666) {
        let data = value.data.mineralProjects.list;
        this.projectTotal = value.data.mineralProjects.total;
        for(let i in data){
          data[i].explorationStartTime =  new Date(data[i].explorationStartTime*1000).toLocaleDateString().replace(/\//g, "-");
          data[i].miningStartTime =  new Date(data[i].miningStartTime*1000).toLocaleDateString().replace(/\//g, "-");
        }
        
        this.mineralProjectValue = data;
      }
    }); 
  }

  /* 操作 */
  setMineral(type,value?){
    if(type=='add'){
      this.mineralProject = new ExplorationProject();
      this.mineralProjectDisplay = true;
    }else{
      this.confirmationService.confirm({
        message: '确认删除该项目('+value.projectName+')吗?',
        header: '删除项目',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'确定',
        rejectLabel:'取消',
        accept: () => {
          this.httpUtil.delete('mineral-project/'+value.id).then(value=>{
            if (value.meta.code === 6666) {
              this.getExplorationInfo();
              this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '删除成功'});
            }
          })
        },
        reject: () => {
        
        }
      });
    }
  }

  /* 保存项目 */
  saveMineralProject(){
    let projectInfo = {
      "areaGeologicBackground": this.mineralProject.areaGeologicBackground,
      "explorationArea": this.mineralProject.explorationArea,
      "explorationStartTime": this.explorationStartTime.getTime()/1000,
      "geophysicalGeochemical": this.mineralProject.geophysicalGeochemical,
      "investigationFinalStage": this.mineralProject.investigationFinalStage,
      "majorAchievement": this.mineralProject.majorAchievement,
      "mineralBeltGeologic": this.mineralProject.mineralBeltGeologic,
      "mineralBeltOwner": this.mineralProject.mineralBeltOwner,
      "mineralCharacteristics": this.mineralProject.mineralCharacteristics,
      "mineralGeologicalMagmatite": this.mineralProject.mineralGeologicalMagmatite,
      "mineralGeologicalStratum": this.mineralProject.mineralGeologicalStratum,
      "mineralGeologicalStructure": this.mineralProject.mineralGeologicalStructure,
      "miningArea": this.mineralProject.miningArea,
      "miningStartTime":this.miningStartTime.getTime()/1000,
      "preliminaryUnderstanding": this.mineralProject.preliminaryUnderstanding,
      "projectName": this.mineralProject.projectName,
      "remarks": this.mineralProject.remarks,
      "rockAlteration": this.mineralProject.rockAlteration,
      "id": this.mineralProject.id
    };

    /* 增加探矿权项目 */
    this.httpUtil.post('mineral-project',projectInfo).then(value=>{
      if (value.meta.code === 6666) {
        this.messageService.add({key: 'tc', severity:'success', summary: '信息', detail: '添加成功'});
        this.mineralProjectDisplay = false;
        this.getExplorationInfo();
      }
    })
  }

  pageChange(event,type){
    this.startPage = event.page+1;//列表开始的页数
    this.limit = event.rows;//列表每页的行数
    this.getExplorationInfo();    
  }
}
