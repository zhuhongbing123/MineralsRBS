import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts'
import { MenuItem } from 'primeng/api';
declare let $;
@Component({
  selector: 'app-power-monitoring',
  templateUrl: './power-monitoring.component.html',
  styleUrls: ['./power-monitoring.component.scss']
})
export class PowerMonitoringComponent implements OnInit {
  chart1;
  mineralProjectTitle;
  mineralProjectValue;
  powerItems: MenuItem[];//tab页标题
  liveDataDisplay = false;
  historyDataDisplay = false;
  voltage;//电压
  electricity;//电流
  power;//总功率
  liveTime;//当前时间
  startTime;
  endTime = new Date();
  constructor() { }

  ngOnInit() {
    this.startTime = this.fun_date(-7);
    this.powerItems = [
      {label: '实时电量监测'},
      {label: '历史数据'}
    ];
    this.mineralProjectTitle=[
      { field: 'time', header: '日期' },
      { field: 'voltage', header: '总有电功能' },
      { field: 'voltage', header: '总输入有功电能' },
      { field: 'voltage', header: '总无功电能' },
      { field: 'voltage', header: '总输入无功电能' },
      { field: 'voltage', header: '总输出无功电能' },
      { field: 'electricity', header: '频率' },
      { field: 'electricity', header: 'A相电流' },
      { field: 'electricity', header: 'B相电流' },
      { field: 'electricity', header: 'C相电流' },
      { field: 'power', header: '总功率' },
      
    ];
    this.mineralProjectValue = [
      {
        voltage:'23.3',
        electricity:'34',
        power:'200',
        time:'2020-1-7 15:40'
      },
      {
        voltage:'23.3',
        electricity:'34',
        power:'200',
        time:'2020-1-7 16:40'
      },
      {
        voltage:'23.3',
        electricity:'34',
        power:'200',
        time:'2020-1-7 17:40'
      },
      {
        voltage:'23.3',
        electricity:'34',
        power:'200',
        time:'2020-1-7 18:40'
      }
    ]
    this.getEcharts();
  }

  fun_date(aa){
    var date1 = new Date(),
    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+aa);
    var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    return date2;
  }
  /* 初始化 */
  getEcharts(){
  let chart1 = echarts.init(document.getElementById("electricity"));

	let colorTemplate1 = [[0.2, "rgba(0,255,0,0.8)"], [0.8, "rgba(0,255,255,0.8)"], [1, "rgba(255,0,0,0.8)"]];


	  
	// 指定图表的配置项和数据
	let option = {
		
		//backgroundColor: "#000",
		tooltip: {				// 本系列特定的 tooltip 设定。	
				show: true,
		        formatter: "{b}：{c}",
		        backgroundColor: "rgba(50,50,50,0.7)",	// 提示框浮层的背景颜色。注意：series.tooltip 仅在 tooltip.trigger 为 'item' 时有效。
		        borderColor: "#333",		// 提示框浮层的边框颜色。...
		        borderWidth: 0,				// 提示框浮层的边框宽。...
		        padding: 5,					// 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。...
		        textStyle: {				// 提示框浮层的文本样式。...
		        	// color ,fontStyle ,fontWeight ,fontFamily ,fontSize ,lineHeight ,.......
		        },
	    },
      grid: {

        width: "20px",
        height: "280px",
        containLabel: true
    },
	    series: [
          {
            name: "电压",		// 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
            type: "gauge",			// 系列类型
            radius:	"50%",			// 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
            center: ["20%", "45%"],	// 仪表盘位置(圆心坐标)
            startAngle: 225,		// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: -45,			// 仪表盘结束角度,默认 -45
            clockwise: true,		// 仪表盘刻度是否是顺时针增长,默认 true。
            min: 0,					// 最小的数据值,默认 0 。映射到 minAngle。
            max: 100,				// 最大的数据值,默认 100 。映射到 maxAngle。
            splitNumber: 10,		// 仪表盘刻度的分割段数,默认 10。
            
            axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
              show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
              lineStyle: {			// 仪表盘轴线样式。
                color: colorTemplate1, 	//仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 20,					//轴线宽度,默认 30。
                shadowBlur: 20,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            splitLine: {			// 分隔线样式。
              show: true,				// 是否显示分隔线,默认 true。
              length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
              lineStyle: {			// 分隔线样式。
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 2,					//线度,默认 2。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            axisTick: {				// 刻度(线)样式。
              show: true,				// 是否显示刻度(线),默认 true。
              splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
              length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
              lineStyle: {			// 刻度线样式。	
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 1,					//线度,默认 1。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              },
            },
                
            axisLabel: {			// 刻度标签。
              show: true,				// 是否显示标签,默认 true。
              distance: 5,			// 标签与刻度线的距离,默认 5。
              color: "#fff",			// 文字的颜色,默认 #fff。
              fontSize: 12,			// 文字的字体大小,默认 5。
              formatter: "{value}",	// 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            
            pointer: {				// 仪表盘指针。
              show: true,				// 是否显示指针,默认 true。
              length: "70%",			// 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
              width: 5,				// 指针宽度,默认 8。
            },
            
            itemStyle: {			// 仪表盘指针样式。
              color: "auto",			// 指针颜色，默认(auto)取数值所在的区间的颜色
              opacity: 1,				// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              borderWidth: 0,			// 描边线宽,默认 0。为 0 时无描边。
              borderType: "solid",	// 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
              borderColor: "#000",	// 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
              shadowBlur: 10,			// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
            shadowColor: "#fff",	// 阴影颜色。支持的格式同color。
            },
            
            emphasis: {				// 高亮的 仪表盘指针样式
              itemStyle: {
                //高亮 和正常  两者具有同样的配置项,只是在不同状态下配置项的值不同。
              }
            },
            
            title: {				// 仪表盘标题。
              show: true,				// 是否显示标题,默认 true。
              offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#fff",			// 文字的颜色,默认 #333。
              fontSize: 16,			// 文字的字体大小,默认 15。
            },
            
            detail: {				// 仪表盘详情，用于显示数据。
              show: true,				// 是否显示详情,默认 true。
              offsetCenter: [0,"50%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "auto",			// 文字的颜色,默认 auto。
              fontSize: 16,			// 文字的字体大小,默认 15。
              formatter: "{value}V",	// 格式化函数或者字符串
            },
            
            data: [{
              name: "电压",
              value: 85,
            }]
          },
          {
            name: "电流",		// 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
            type: "gauge",			// 系列类型
            radius:	"50%",			// 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
            center: ["50%", "45%"],	// 仪表盘位置(圆心坐标)
            startAngle: 225,		// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: -45,			// 仪表盘结束角度,默认 -45
            clockwise: true,		// 仪表盘刻度是否是顺时针增长,默认 true。
            min: 0,					// 最小的数据值,默认 0 。映射到 minAngle。
            max: 100,				// 最大的数据值,默认 100 。映射到 maxAngle。
            splitNumber: 10,		// 仪表盘刻度的分割段数,默认 10。
            
            axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
              show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
              lineStyle: {			// 仪表盘轴线样式。
                color: colorTemplate1, 	//仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 20,					//轴线宽度,默认 30。
                shadowBlur: 20,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            splitLine: {			// 分隔线样式。
              show: true,				// 是否显示分隔线,默认 true。
              length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
              lineStyle: {			// 分隔线样式。
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 2,					//线度,默认 2。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            axisTick: {				// 刻度(线)样式。
              show: true,				// 是否显示刻度(线),默认 true。
              splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
              length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
              lineStyle: {			// 刻度线样式。	
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 1,					//线度,默认 1。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              },
            },
                
            axisLabel: {			// 刻度标签。
              show: true,				// 是否显示标签,默认 true。
              distance: 5,			// 标签与刻度线的距离,默认 5。
              color: "#fff",			// 文字的颜色,默认 #fff。
              fontSize: 12,			// 文字的字体大小,默认 5。
              formatter: "{value}",	// 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            
            pointer: {				// 仪表盘指针。
              show: true,				// 是否显示指针,默认 true。
              length: "70%",			// 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
              width: 5,				// 指针宽度,默认 8。
            },
            
            itemStyle: {			// 仪表盘指针样式。
              color: "auto",			// 指针颜色，默认(auto)取数值所在的区间的颜色
              opacity: 1,				// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              borderWidth: 0,			// 描边线宽,默认 0。为 0 时无描边。
              borderType: "solid",	// 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
              borderColor: "#000",	// 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
              shadowBlur: 10,			// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
            shadowColor: "#fff",	// 阴影颜色。支持的格式同color。
            },
            
            emphasis: {				// 高亮的 仪表盘指针样式
              itemStyle: {
                //高亮 和正常  两者具有同样的配置项,只是在不同状态下配置项的值不同。
              }
            },
            
            title: {				// 仪表盘标题。
              show: true,				// 是否显示标题,默认 true。
              offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#fff",			// 文字的颜色,默认 #333。
              fontSize: 16,			// 文字的字体大小,默认 15。
            },
            
            detail: {				// 仪表盘详情，用于显示数据。
              show: true,				// 是否显示详情,默认 true。
              offsetCenter: [0,"50%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "auto",			// 文字的颜色,默认 auto。
              fontSize: 16,			// 文字的字体大小,默认 15。
              formatter: "{value}A",	// 格式化函数或者字符串
            },
            
            data: [{
              name: "电流",
              value: 85,
            }]
          },
          {
            name: "总功率",		// 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
            type: "gauge",			// 系列类型
            radius:	"50%",			// 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
            center: ["80%", "45%"],	// 仪表盘位置(圆心坐标)
            startAngle: 225,		// 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
            endAngle: -45,			// 仪表盘结束角度,默认 -45
            clockwise: true,		// 仪表盘刻度是否是顺时针增长,默认 true。
            min: 0,					// 最小的数据值,默认 0 。映射到 minAngle。
            max: 100,				// 最大的数据值,默认 100 。映射到 maxAngle。
            splitNumber: 10,		// 仪表盘刻度的分割段数,默认 10。
            
            axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
              show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
              lineStyle: {			// 仪表盘轴线样式。
                color: colorTemplate1, 	//仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 20,					//轴线宽度,默认 30。
                shadowBlur: 20,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            splitLine: {			// 分隔线样式。
              show: true,				// 是否显示分隔线,默认 true。
              length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
              lineStyle: {			// 分隔线样式。
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 2,					//线度,默认 2。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              }
            },
            
            axisTick: {				// 刻度(线)样式。
              show: true,				// 是否显示刻度(线),默认 true。
              splitNumber: 5,			// 分隔线之间分割的刻度数,默认 5。
              length: 8,				// 刻度线长。支持相对半径的百分比,默认 8。
              lineStyle: {			// 刻度线样式。	
                color: "#eee",				//线的颜色,默认 #eee。
                opacity: 1,					//图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 1,					//线度,默认 1。
                type: "solid",				//线的类型,默认 solid。 此外还有 dashed,dotted
                shadowBlur: 10,				//(发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
                shadowColor: "#fff",		//阴影颜色。支持的格式同color。
              },
            },
                
            axisLabel: {			// 刻度标签。
              show: true,				// 是否显示标签,默认 true。
              distance: 5,			// 标签与刻度线的距离,默认 5。
              color: "#fff",			// 文字的颜色,默认 #fff。
              fontSize: 12,			// 文字的字体大小,默认 5。
              formatter: "{value}",	// 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            
            pointer: {				// 仪表盘指针。
              show: true,				// 是否显示指针,默认 true。
              length: "70%",			// 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
              width: 5,				// 指针宽度,默认 8。
            },
            
            itemStyle: {			// 仪表盘指针样式。
              color: "auto",			// 指针颜色，默认(auto)取数值所在的区间的颜色
              opacity: 1,				// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              borderWidth: 0,			// 描边线宽,默认 0。为 0 时无描边。
              borderType: "solid",	// 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
              borderColor: "#000",	// 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
              shadowBlur: 10,			// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。 
            shadowColor: "#fff",	// 阴影颜色。支持的格式同color。
            },
            
            emphasis: {				// 高亮的 仪表盘指针样式
              itemStyle: {
                //高亮 和正常  两者具有同样的配置项,只是在不同状态下配置项的值不同。
              }
            },
            
            title: {				// 仪表盘标题。
              show: true,				// 是否显示标题,默认 true。
              offsetCenter: [0,"20%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "#fff",			// 文字的颜色,默认 #333。
              fontSize: 16,			// 文字的字体大小,默认 15。
            },
            
            detail: {				// 仪表盘详情，用于显示数据。
              show: true,				// 是否显示详情,默认 true。
              offsetCenter: [0,"50%"],// 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: "auto",			// 文字的颜色,默认 auto。
              fontSize: 16,			// 文字的字体大小,默认 15。
              formatter: "{value}KW",	// 格式化函数或者字符串
            },
            
            data: [{
              name: "总功率",
              value: 85,
            }]
        }
	    ]
		
	};
	let that = this;
  setInterval(function () {
    
    option.series[0].data[0].value = parseFloat((Math.random() * 100).toFixed(2)) - 0;
    that.voltage = option.series[0].data[0].value;
    option.series[1].data[0].value = parseFloat((Math.random() * 100).toFixed(2)) - 0;
    
    option.series[2].data[0].value = parseFloat((Math.random() * 100).toFixed(2)) - 0;
    that.power = option.series[2].data[0].value;
    var myDate = new Date();


    let hours = myDate.getHours();       // 获取当前小时数(0-23)
    let minutes = myDate.getMinutes();     // 获取当前分钟数(0-59)
    let second = myDate.getSeconds();     // 获取当前秒数(0-59)
    that.liveTime = new Date().toLocaleDateString()+' ' + hours+':'+minutes+':'+second


    chart1.setOption(option, true);

    
  },2000);
  chart1.setOption(option, true);

  let chart3 = echarts.init(document.getElementById("electricityHistory"));
    let option3 = {
      title: {
          text: '电压历史数据'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: ['总有功电能', '总输入有功电能', '总输出有功电能', '电压', '电流'],
          orient: 'vertical',
          right: 10,
          top: 10,
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
              name: '总有功电能',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
          },  
          {
              name: '总输入有功电能',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
              name: '总输出有功电能',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
              name: '电压',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '电流',
              type: 'line',
              stack: '总量',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
    };
    chart3.setOption(option3, true);
  }

  /* 切换tab页 */
  menuClick(event){
    if(event =='历史数据'){
      this.historyDataDisplay = true;
      this.liveDataDisplay  = false;
    }else{
      this.liveDataDisplay  = true;
      this.historyDataDisplay = false;
    }
  }

}
