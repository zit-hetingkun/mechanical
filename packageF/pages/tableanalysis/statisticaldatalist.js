// pages/tableanalysis/statisticaldatalist.js
const app = getApp();
var onjobsecurityTime = [];
var onjobsecurityData = [];
var leaveJobsecurityDate = [];//安保人员
var onjobcolumnbyPersonTime=[];
var onjobcolumnbyPersonData=[];//在职树
var leaveJobcolumnbyPersonDate=[];//列乘
var onjobsafetyPersonTime=[];//安检
var onjobsafetyPersonData=[];
var leaveJobsafetyPersonDate=[];
var onjoballPersonTime=[];
var onjoballPersonData=[];
var leaveJoballPersonDate=[];//合计
var abnormalCheck=[];//安检温度
var abnormalSecurity=[];//保安温度
var abnormalTran=[];//列乘温度
var temperatureTime=[];//时间
var securityTime=[];//安保上岗时间
var securitydue=[];//安保应到
var securityabsences=[];//安保缺席
var securityattendance=[];//实到
var columnbyTime=[];//列乘时间
var columnbydue=[];//列乘应到
var columnbyabsences=[];//列乘缺席
var columnbyattendance=[];//列乘实到
var safetyTime=[];//安检时间
var safetydue=[];//安检应到
var safetyabsences=[];//安检缺席
var safetyattendance=[];//安检实到
var allworkTime=[];//总计时间
var allworkdue=[];//所有应到
var allworkabsences=[];//所有缺席
var allworkattendance=[]//所有实到
import * as echarts from '../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,//tab切换
    winWidth:null,//屏幕宽
    winHeight: 0,//屏幕高 
    swipserCurrent:0,//轮播选中值
    securityPerson: { //保安人员 延迟加载
      lazyLoad:true
    },
    columnbyPerson:{ //乘务人员
      lazyLoad:true
    },
    safetyPerson:{ //安检人员
      lazyLoad:true
    },
    allPerson:{
      lazyLoad:true //合计总人数
    },
    unusualdetails: { //温度
      lazyLoad:true
    },
    securitywork: { //保安上岗
      lazyLoad:true
    },
    safetyWork:{
      lazyLoad:true //安检上岗
    },
    columnbyWork:{
      lazyLoad:true //乘务上岗
    },
    allWork:{ 
      lazyLoad:true //合计上岗
    },
    onLoad() {

    },
    //轮播遍历
    movies: [
        {id:1},
        {id:2},
        {id:3},
        {id:4}
    ],
    userId:null,
    token:null,
    statisticsPersons:null,//安保头部
    leaveJobDate:[],
    temperatureHead:[],//温度头部数据
    mountHead:[]//上岗头部数据

    //
  },

    //  tab切换逻辑
    swichNav: function (e) {
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
     //获得角色id
     var roleId=wx.getStorageSync('roleId');
     var userId=wx.getStorageSync('userId');
     var token = wx.getStorageSync('token');
     that.setData({
       roleId:roleId,
       userId:userId,
       token:token
     })
        /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //获得
    //保安人员
    that.securityPersonData = that.selectComponent('#mychart-dom-bar1');
    //列乘
    that.columnbyPersonData = that.selectComponent('#mychart-dom-bar2');
    //安检
    that.safetyPersonData = that.selectComponent('#mychart-dom-bar3');
    //总计
    that.allPersonData = that.selectComponent('#mychart-dom-bar4');
    //测温异常
    that.unusualdetailsData = that.selectComponent('#mychart-dom-bar5');
    that.getTemperature();//获得温度数据
    //保安上岗
    that.securityworkData = that.selectComponent('#mychart-dom-bar6');   
    //列乘上岗
    that.columnbyWorkData = that.selectComponent('#mychart-dom-bar8');
    //安检上岗
    that.safetyWorkData = that.selectComponent('#mychart-dom-bar7');
    //上岗合计
    that.allWorkData = that.selectComponent('#mychart-dom-bar9');
    that.getPersonHeadData();//获得人员的头部数据
    that.getPersonData(); //获取人员数据
    that.getTemperatureHeadData();//获得温度的头部数据
    that.getMountHeadData();//获得上岗头部
    that.getMountDatas();//获得上岗数据
  },
  //上岗数据
  getMountDatas:function(){
    var that = this;
    var userId = this.data.userId
    var token = this.data.token
    //保安
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/mount/statistics/2/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) { 
            securitydue.push('应到');  
            securityattendance.push('实到');   
            securityabsences.push('缺席'); 
            securityTime.push('product');
            data.due.forEach(function (item, index) {
              securitydue.push(item.number);
              securityTime.push(item.date);
            });
            data.attendance.forEach(function (item2, index2) {
              securityattendance.push(item2.number);
            });
            data.absences.forEach(function (item3, index2) {
              securityabsences.push(item3.number);
            });
            that.securitywork();
          }
        }       
      },
    })
    //安检
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/mount/statistics/1/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {
            safetydue.push('应到');  
            safetyattendance.push('实到');   
            safetyabsences.push('缺席'); 
            safetyTime.push('product');          
            data.due.forEach(function (item, index) {
              safetydue.push(item.number);
              safetyTime.push(item.date);
            });
            data.attendance.forEach(function (item2, index2) {
              safetyattendance.push(item2.number);
            });
            data.absences.forEach(function (item3, index2) {
              safetyabsences.push(item3.number);
            });
            that.safetyWork();
          }
        }       
      },
    }) 
    //列乘
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/mount/statistics/3/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) { 
            columnbydue.push('应到');  
            columnbyattendance.push('实到');   
            columnbyabsences.push('缺席'); 
            columnbyTime.push('product');               
            data.due.forEach(function (item, index) {
              columnbydue.push(item.number);
              columnbyTime.push(item.date);
            });
            data.attendance.forEach(function (item2, index2) {
              columnbyattendance.push(item2.number);
            });
            data.absences.forEach(function (item3, index2) {
              columnbyabsences.push(item3.number);
            });
            that.columnbyWork();
          }
        }       
      },
    }) 
    //合计
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/mount/statistics/4/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {    
            allworkdue.push('应到');  
            allworkattendance.push('实到');   
            allworkabsences.push('缺席'); 
            allworkTime.push('product');         
            data.due.forEach(function (item, index) {
              allworkdue.push(item.number);
              allworkTime.push(item.date);
            });
            data.attendance.forEach(function (item2, index2) {
              allworkattendance.push(item2.number);
            });
            data.absences.forEach(function (item3, index2) {
              allworkabsences.push(item3.number);
            });
            that.allWork();
          }
        }       
      },
    }) 




  },
  //上岗头部
  getMountHeadData:function(){
    var that=this;
    var data=that.data;
    wx.request({
     url: app.globalData.appHost + "/security/" + data.userId + "/mount/statistics/init",
     method: "GET",
     header: {
       "Content-Type": "application/json",
       Authorization: data.token
     },
     success: function (res) {
       //获得数据
       var code = res.data.code;
       var data = res.data.data;
       if (code == "200") {
         if (data != null) {          
            //获得上岗总人数
            that.setData({
              mountHead:data
            })     
         }
       }
     },
   })

  },
  //温度的头部
  getTemperatureHeadData:function(){
    var that=this;
    var data=that.data;
    wx.request({
     url: app.globalData.appHost + "/security/" + data.userId + "/temperature/statistics/init",
     method: "GET",
     header: {
       "Content-Type": "application/json",
       Authorization: data.token
     },
     success: function (res) {
       //获得数据
       var code = res.data.code;
       var data = res.data.data;
       if (code == "200") {
         if (data != null) {          
            //获得温度总人数
            that.setData({
              temperatureHead:data
            })     
         }
       }
     },
   })
  },

  //安保人员数据
  getPersonData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    var that = this;
    var userId = this.data.userId
    var token = this.data.token
    //保安
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/security/statistics/2/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
            data.onJob.forEach(function (item, index) {
              onjobsecurityData.push(item.number);
              onjobsecurityTime.push(item.date);
            });
            data.leaveJob.forEach(function (item2, index2) {
              leaveJobsecurityDate.push(item2.number);
            });
            that.securityPerson();
          }
        }       
      },
    }) 
    //列乘
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/security/statistics/3/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
            data.onJob.forEach(function (item, index) {
              onjobcolumnbyPersonData.push(item.number);
              onjobcolumnbyPersonTime.push(item.date);
            });
            data.leaveJob.forEach(function (item2, index2) {
              leaveJobcolumnbyPersonDate.push(item2.number);
            });
            that.columnbyPerson();
          }
        }       
      },
    }) 
    //安检
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/security/statistics/1/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
            data.onJob.forEach(function (item, index) {
              onjobsafetyPersonData.push(item.number);
              onjobsafetyPersonTime.push(item.date);
            });
            data.leaveJob.forEach(function (item2, index2) {
              leaveJobsafetyPersonDate.push(item2.number);
            });
            that.safetyPerson();
          }
        }       
      },
    }) 
    //合计
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/security/statistics/4/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
            data.onJob.forEach(function (item, index) {
              onjoballPersonData.push(item.number);
              onjoballPersonTime.push(item.date);
            });
            data.leaveJob.forEach(function (item2, index2) {
              leaveJoballPersonDate.push(item2.number);
            });
            that.allPerson();
          }
        }       
      },
    }) 
  },
  //头部数据
  getPersonHeadData:function(){
     var that=this;
     var data=that.data;
     var params=JSON.stringify({'contentType':1});
     wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/security/statistics/init",
      method: "GET",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
             //获得安保总人数
             that.setData({
              statisticsPersons:data
             })     
          }
        }
      },
    })
   },
  //上岗合计
  allWork:function(){
    this.allWorkData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getallWorkOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  getallWorkOption:function(){
      return{
        title: {
          text: '总计'
      },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            allworkTime,
            allworkabsences,
            allworkdue,
            allworkattendance
          ]
        },
        xAxis: [
          { type: 'category', gridIndex: 0 },
         
        ],
        yAxis: [
          { gridIndex: 0 },
       
        ],
        grid: [
          { bottom: '55%' },
          { top: '55%' }
        ],
        series: [
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },    
        ]
      }
  },
  //安检上岗
  safetyWork:function(){
    this.safetyWorkData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getsafetyWorkOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  getsafetyWorkOption:function(){
    return{
      title: {
        text: '安检'
    },
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          safetyTime,
          safetyabsences,
          safetydue,
          safetyattendance,
        ]
      },
      xAxis: [
        { type: 'category', gridIndex: 0 },
       
      ],
      yAxis: [
        { gridIndex: 0 },
     
      ],
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },    
      ]
    }
  },
  //列乘上岗
  columnbyWork:function(){
    this.columnbyWorkData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getcolumnbyWorkOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //列乘数据
  getcolumnbyWorkOption:function(){
    return{
      title: {
        text: '列乘'
    },
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          columnbyTime,
          columnbyabsences,
          columnbydue,
          columnbyattendance
        ]
      },
      xAxis: [
        { type: 'category', gridIndex: 0 },
       
      ],
      yAxis: [
        { gridIndex: 0 },
     
      ],
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },    
      ]
    }
  },
  //保安上岗
  securitywork:function(){
    this.securityworkData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getsecurityworkOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //保安上岗数据
  getsecurityworkOption:function(){    
    return{
      title: {
        text: '保安'
    },
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          securityTime,
          securityabsences,
          securitydue,
          securityattendance
        ]
      },
      xAxis: [
        { type: 'category', gridIndex: 0 },
       
      ],
      yAxis: [
        { gridIndex: 0 },
     
      ],
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },    
      ]
    }
  },
  //获得温度的数据
  getTemperature:function(){
    var that = this;
    var userId = this.data.userId
    var token = this.data.token
    wx.request({
      url: app.globalData.appHost + "/security/" + userId + "/temperature/statistics/chart",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {          
            data.abnormalCheck.forEach(function (item, index) {
              abnormalCheck.push(item.number);
              temperatureTime.push(item.date);
            });
            data.abnormalSecurity.forEach(function (item2, index2) {
              abnormalSecurity.push(item2.number);
            });
            data.abnormalTran.forEach(function (item3, index2) {
              abnormalTran.push(item3.number);
            });
            that.unusualdetails();
          }
        }       
      },
    }) 
  },
  //测温异常
  unusualdetails:function(){
    this.unusualdetailsData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getunusualdetailsOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //温度数据
  getunusualdetailsOption:function( ){
    return{
      title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['保安', '列乘', '安检']
    },
    grid: [
      { bottom: '55%' },
      { top: '55%' }
    ],
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: temperatureTime
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '保安',
            type: 'line',
            stack: '总量',
            data: abnormalSecurity
        },
        {
            name: '安检',
            type: 'line',
            stack: '总量',
            data: abnormalCheck
        },
        {
            name: '列乘',
            type: 'line',
            stack: '总量',
            data: abnormalTran
        }
    ]      
    }
  },
  //总计人数
  allPerson:function(){
    this.allPersonData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getallPersonOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //总计数据
  getallPersonOption:function(){
      return{
        title: {
          text: '人员合计'
        },
        tooltip: {
          trigger:'axis'
        },
        legend: {
          data: ['在职', '离职']
        },
        xAxis: { 
          type: 'category',
          boundaryGap: false,
          data: onjoballPersonTime
          },
        yAxis:{
          type:'value'
        },
        grid: [
          { bottom: '55%' },
          { top: '55%' }
        ],
        series: [
          { 
           name: '在职',
           type: 'line',
           stack: '总量',
           data: onjoballPersonData
          },
          { 
            name: '离职',
            type: 'line',
            stack: '总量',
            data: leaveJoballPersonDate},
        ]
      }
  },

  //安检
  safetyPerson:function(){
    this.safetyPersonData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getsafetyPersonOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //安检数据
  getsafetyPersonOption:function(){
    return{
      title: {
        text: '安检人员'
      },
      tooltip: {
        trigger:'axis'
      },
      legend: {
        data: ['在职', '离职']
      },
      xAxis: { 
        type: 'category',
        boundaryGap: false,
        data:onjobsafetyPersonTime
        },
      yAxis:{
        type:'value'
      },
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        { 
         name: '在职',
         type: 'line',
         stack: '总量',
         data: onjobsafetyPersonData
        },
        { 
          name: '离职',
          type: 'line',
          stack: '总量',
          data: leaveJobsafetyPersonDate },
      ]
    }
  },
  //列乘
  columnbyPerson:function(){
    this.columnbyPersonData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getcolumnbyPersonOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  //列乘数据
  getcolumnbyPersonOption:function(){
    return{
      title: {
        text: '列乘人员'
      },
      tooltip: {
        trigger:'axis'
      },
      legend: {
        data: ['在职', '离职']
      },
      xAxis: { 
        type: 'category',
        boundaryGap: false,
        data: onjobcolumnbyPersonTime 
        },
      yAxis:{
        type:'value'
      },
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        { 
         name: '在职',
         type: 'line',
         stack: '总量',
         data: onjobcolumnbyPersonData
        },
        { 
          name: '离职',
          type: 'line',
          stack: '总量',
          data: leaveJobcolumnbyPersonDate}
      ]
    }
  },

  //保安
  securityPerson: function (){
    this.securityPersonData.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getsecurityPersonOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  
  //保安人员数据
  getsecurityPersonOption:function(){
    var option = {
      title: {
        text: '保安人员'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['在职', '离职']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisPointer: {
          type: 'shadow'
        },
        data: onjobsecurityTime
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          formatter: '{value}'
        }
      },
      grid: [
        { bottom: '55%' },
        { top: '55%' }
      ],
      series: [
        {
          name: '在职',
          type: 'line',
          stack: '总量',
          data: onjobsecurityData
        },
        {
          name: '离职',
          type: 'line',
          stack: '总量',
          data: leaveJobsecurityDate
        },
      ]
    };
    return option;
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var roleId=wx.getStorageSync('roleId');
    var userId=wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    that.setData({
      roleId:roleId,
      userId:userId,
      token:token
    })
    console.log('token'+token);
    console.log('userid'+userId);
   onjobsecurityTime = [];
   onjobsecurityData = [];
   leaveJobsecurityDate = [];//安保人员
   onjobcolumnbyPersonTime=[];
   onjobcolumnbyPersonData=[];//在职树
   leaveJobcolumnbyPersonDate=[];//列乘
   onjobsafetyPersonTime=[];//安检
   onjobsafetyPersonData=[];
   leaveJobsafetyPersonDate=[];
   onjoballPersonTime=[];
   onjoballPersonData=[];
   leaveJoballPersonDate=[];//合计
   abnormalCheck=[];//安检温度
   abnormalSecurity=[];//保安温度
   abnormalTran=[];//列乘温度
   temperatureTime=[];//时间
   securityTime=[];//安保上岗时间
   securitydue=[];//安保应到
   securityabsences=[];//安保缺席
   securityattendance=[];//实到
   columnbyTime=[];//列乘时间
   columnbydue=[];//列乘应到
   columnbyabsences=[];//列乘缺席
   columnbyattendance=[];//列乘实到
   safetyTime=[];//安检时间
   safetydue=[];//安检应到
   safetyabsences=[];//安检缺席
   safetyattendance=[];//安检实到
   allworkTime=[];//总计时间
   allworkdue=[];//所有应到
   allworkabsences=[];//所有缺席
   allworkattendance=[]//所有实到

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //人员点击显示当前的条件
  selected:function(event){
    var id = event.currentTarget.dataset.id;
    if(id==1){
        this.setData({
          swiperCurrent:0
        })
    }
    if(id==2){
      this.setData({
        swiperCurrent:1
      })
    }
    if(id==3){
      this.setData({
        swiperCurrent:2
      })
    }
    if(id==4){
      this.setData({
        swiperCurrent:3
      })
    }
    console.log('选中的id'+id);
  },
  //安保明细
  evenMore:function(){
    wx.navigateTo({
      url: 'securitydetails/securitydetails?data='+JSON.stringify(this.data.statisticsPersons),
    })
  },
  //测温
  evenMore2:function(){
    wx.navigateTo({
      url: 'unusualdetails/unusualdetails?data='+JSON.stringify(this.data.temperatureHead),
    })
  },
  //上岗
  evenMore3:function(){
    wx.navigateTo({
      url: 'securitywork/securitywork?data='+JSON.stringify(this.data.mountHead),
    })
  },

})