export const setInterTime = {
  // 报警管理
  alarmWarn: 30000,
  // 求救信息
  helps: 30000,
  // 欠压信息
  power: 30000,
  // 电子点名
  rollcall: 100000,
  // 考勤记录
  attends: 300000,
  // 巡检记录
  records: 300000,
  // 智能点名
  IntelligentRollCall: 3000000,
  // 健康信息
  health: 10000,
  // 心率异常
  abnormal: 300000
}

export const HTTP = '192.168.0.58:8100'
/* mqtt地址 */

export const mqttAddress = 'ws://192.168.0.58:9001/';
// export const mqttAddress = `ws://${window.location.hostname}:9001/`;

/* 服务器地址 */
export const serverAddress = 'http://192.168.0.58';
