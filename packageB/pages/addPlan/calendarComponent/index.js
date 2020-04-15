// import initCalendar, { getSelectedDay, setTodoLabels } from '../addPlan/template/calendar/index';
import enableArea from '../../../../component/calendar/func/day';
var util = require('../../../../component/calendar/func/day.js');
const app = getApp();
Page({
  data: {
    calendarConfig: {
      showLunar: true,
      firstDayOfWeek: 'Mon',
      defaultDay: new Date(),
      disablePastDay:true,
      multi: true,
    },
    arrs: [],//数组计划
    arrays: [],//修改
    userId: null,
    roleId: null,
    token: null,
    planid: null,
    nowdate: null,//当前选中的时间
    nowday: null,//当前选中的天
    nowmonth: null,//当前选中的月
    nowyear: null,//当前选中的年  
    hiddenmodalput: true,//添加计划的弹框隐藏控制 初始化隐藏
    formData: {},
    item: [],
    securityPlanStatus: null,//当前状态
    result: null,//返回的列表结果
    plancontent: null,
    returndata: [],//返回的数据
    addPlanContent: [],
    checkstatus: 0,//触发添加
    actionBtn: [
      {
        text: '设置待办事项',
        action: 'setTodoLabels',
        color: 'cyan'
      },
      {
        text: '删除指定代办',
        action: 'deleteTodoLabels',
        color: 'pink'
      },
    ]
  },
  afterTapDay(e) {
    var date = e.detail.currentSelected.year + '-' + e.detail.currentSelected.month + '-' + e.detail.currentSelected.day;
    //当前选中的值
    this.setData({
      nowyear: e.detail.currentSelected.year,
      nowmonth: e.detail.currentSelected.month,
      nowday: e.detail.currentSelected.day,
      nowdate: date
    })
    //plancontent
    //获得所有的列表数据
    var result = this.data.result;
    for (var i = 0; i < result.length; i++) {
      var date = result[i].planTime;
      var plan = result[i].plan;
      var time = new Date(date);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();
      if (e.detail.currentSelected.year == year && e.detail.currentSelected.month == month && e.detail.currentSelected.day == day) {
        this.setData({
          plancontent: plan
        })
      }
    }
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail);
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail);
  },
  onTapDay(e) {
    console.log('onTapDay', e.detail);
  },
  afterCalendarRender(e) {
    //调接口
    var days = [];
    var that = this;
    var data = this.data;
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + data.planid + "/plan/detail";
    wx.request({
      url: url,
      method: 'GET',
      header: {
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var result = res.data.data;
        if (code == "200") {
          if (result != null) {
            that.setData({
              result: result
            })
          }
          for (var i = 0; i < result.length; i++) {
            var date = result[i].planTime;
            var plan = result[i].plan;
            var time = new Date(date);
            that.calendar.setTodoLabels(
              {
                showLabelAlways: true,
                days: [{
                  year: time.getFullYear(),
                  month: time.getMonth() + 1,
                  day: time.getDate(),
                  todoText: plan
                }]
              }
            );
            days.push(
              {
                year: time.getFullYear(),
                month: time.getMonth() + 1,
                day: time.getDate(),
                todoText: plan
              });
            days.push(days);
          }
        } else {
          wx.showToast({
            title: '当前用户无权操作',
            icon: 'none',
            duration: 1000
          });
        }
      }, fail: function (res) {
        console.log(res);
      }
    })
  },
  onSwipe(e) {
    console.log('onSwipe', e);
  },
  showToast(msg) {
    if (!msg || typeof msg !== 'string') return;
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    });
  },
  generateRandomDate(type) {
    let random = ~~(Math.random() * 10);
    switch (type) {
      case 'year':
        random = 201 * 10 + ~~(Math.random() * 10);
        break;
      case 'month':
        random = (~~(Math.random() * 10) % 9) + 1;
        break;
      case 'date':
        random = (~~(Math.random() * 100) % 27) + 1;
        break;
      default:
        break;
    }
    return random;
  },
  handleAction(e) {
    var { action, disable } = e.currentTarget.dataset;
    if (disable) {
      this.showToast('抱歉，还不支持～😂');
    }
    this.setData({
      rst: []
    });
    const calendar = this.calendar;
    const { year, month } = calendar.getCurrentYM();
    switch (action) {
      case 'jump': {
        const year = this.generateRandomDate('year');
        const month = this.generateRandomDate('month');
        const date = this.generateRandomDate('date');
        calendar[action](year, month, date);
        break;
      }
      case 'getTodoLabels': {
        const selected = calendar[action]();
        if (!selected || !selected.length)
          return this.showToast('未设置待办事项');
        const rst = selected.map(item => JSON.stringify(item));
        rst.map(item => JSON.stringify(item));
        this.setData({
          rst
        });
        var obj = {};
        for (var i = 0; i < rst.length; i++) {
          console.log(rst[i]);
          console.log(JSON.stringify(rst[i]).day);
        }
        break;
      }
      case 'getSelectedDay': {
        const selected = calendar[action]();
        if (!selected || !selected.length)
          return this.showToast('当前未选择任何日期');
        this.showToast('请在控制台查看结果');
        const rst = selected.map(item => JSON.stringify(item));
        this.setData({
          rst
        });
        break;
      }
      case 'setTodoLabels': {
        var that = this;
        var data = that.data;
        that.addPlan();
        const days = [
          {
            year: data.nowyear,
            month: data.nowmonth,
            day: data.nowday,
            todoText: ''
          }
        ];
        calendar[action]({
          showLabelAlways: true,
          days
        });
        break;
      }
      case 'deleteTodoLabels': {
        //获得当前选中的
        var checkyear = this.data.nowyear;
        var checkmonth = this.data.nowmonth;
        var checkday = this.data.nowday;
        //删除指定的数据 列表原有的
        var result = this.data.result;
        for (var i = 0; i < result.length; i++) {
          var date = result[i].planTime;
          var plan = result[i].plan;
          var time = new Date(date);
          var year1 = time.getFullYear();
          var month1 = time.getMonth() + 1;
          var day1 = time.getDate();
          if (checkyear == year1 && checkmonth == month1 && checkday == day1) {
            result.splice(i, 1);
          }
        }
        this.setData({
          result: result
        })
        const todos = [...calendar.getTodoLabels()];
        if (todos && todos.length) {
          todos.length = 1;
          calendar[action](todos);
          const _todos = [...calendar.getTodoLabels()];
          setTimeout(() => {
            const rst = _todos.map(item => JSON.stringify(item));
            this.setData(
              {
                rst
              },
              () => {

              }
            );
          });
        } else {
          this.showToast('没有待办事项');
        }
        break;
      }
    }
  },
  /**
   * 输入值在view中同步
   */
  bindKeyInput: function (event) {
    //获取输入的值
    var value = event.detail.value;
    var temType = event.currentTarget.dataset.type;
    var data = this.data;
    data.formData[temType] = value;
    this.setData(data);
  },
  onLoad: function (options) {
    var that = this;
    var data = this.data;
    var nowtime = new Date().toLocaleDateString();
    //获得角色id
    var roleId = wx.getStorageSync('roleId');
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId');
    var planid = options.planid;
    that.setData({
      planid: planid,
      roleId: roleId,
      userId: userId,
      token: token
    })
    var plandate=new Date();
    var year = plandate.getFullYear();
    var month = plandate.getMonth() + 1;
    var day = plandate.getDate();
    var dateTemp=year+'-'+month+'-'+day;
    var returndata=this.getNewData(dateTemp,14);
    // util.enableArea([dateTemp, returndata]);
    // this.calendar.enableDays(['2020-3-25', '2020-3-26', '2020-3-27']);
  },
  

  getNewData:function(dateTemp, days) {  
    var dateTemp = dateTemp.split("-");  
    var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式    
    var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);  
    var rDate = new Date(millSeconds);  
    var year = rDate.getFullYear();  
    var month = rDate.getMonth() + 1;  
    if (month < 10) month = "0" + month;  
    var date = rDate.getDate();  
    if (date < 10) date = "0" + date;  
    return (year + "-" + month + "-" + date);  
 },
  //创建计划弹框
  addPlan: function () {
    var that = this;
    var planid = that.planid;
    that.setData({
      hiddenmodalput: !that.data.hiddenmodalput
    })
  },
  //取消按钮 
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //计划确认 
  confirm: function () {
    var that = this;
    var data = that.data;
    //年 月 日
    var now = that.data.nowdate;
    var time=null;
     time = new Date(now);
    if (now == null) {
      // wx.showToast({
      //   title: '请选择日期',
      //   icon: 'none',
      //   duration: 1000
      // });
      // return;
      var defaultday=new Date();
       time = new Date(defaultday);
    }
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var plancontent = data.formData['addcontent'];
    var plantime = year + '-' + month + '-' + day;
    var plans = that.data.addPlanContent;
    var returndata = [plans, plantime];
    plans.push({ "planTime": plantime, "plan": plancontent });
    that.setData({
      hiddenmodalput: true,
      plancontent: ''
    })
    //设置进刚添加的
    that.calendar.setTodoLabels({
      // 待办点标记设置
      pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
      dotColor: '#40', // 待办点标记颜色
      showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
      days: [
        {
          year: year,
          month: month,
          day: day,
          todoText: plancontent
        }
      ]
    });

  },
  //修改
  edit: function () {

  },
  //添加计划
  addSubmit: function () {
    var that = this;
    var data = that.data;
    var params = JSON.stringify(data.addPlanContent);
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + data.planid + "/plan";
    wx.request({
      url: url,
      data: params,
      method: 'POST',
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          // that.setData({
          //   plancontent: plancontent
          // })
          wx.showToast({
            title: '已提交',
            icon: 'none',
            duration: 1000
          });
          wx.navigateTo({
            url: '../securityPersonList/securityPersonlist',
          })
        } else {
          wx.showToast({
            title: '当前用户无权操作',
            icon: 'none',
            duration: 1000
          });
        }
      }, fail: function (res) {
        console.log(res);
      }
    })
  },
  // 
  editSubmit: function () {
    var that = this;
    var data = that.data;
    //返回的所有数据
    var result = that.data.result;
    var params = JSON.stringify(result);
    //修改
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + data.planid + "/plan";
    wx.request({
      url: url,
      data: params,
      method: 'PUT',
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          wx.showToast({
            title: '已保存',
            icon: 'none',
            duration: 1000
          });
          wx.navigateTo({
            url: '../securityPersonList/securityPersonlist',
          })
        } else {
          wx.showToast({
            title: '当前用户无权操作',
            icon: 'none',
            duration: 1000
          });
        }
      }, fail: function (res) {
        console.log(res);
      }
    })
  },
});

