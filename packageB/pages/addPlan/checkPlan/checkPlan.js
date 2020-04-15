// import initCalendar, { getSelectedDay, setTodoLabels } from '../addPlan/template/calendar/index';
const app = getApp();
Page({
  data: {
    calendarConfig: {
      showLunar: true,
      firstDayOfWeek: 'Mon',
      defaultDay: new Date(),
      multi: true,
    },
    userId: null,
    roleId: null,
    token: null,
    planid: null,
    nowdate: null,//当前选中的时间
    nowday: null,//当前选中的天
    nowmonth: null,//当前选中的月
    nowyear: null,//当前选中的年  
    formData: {},
    item: [],
    securityPlanStatus: null,//当前状态
    plancontent: null,
    actionBtn: [
    ]
  },
  afterTapDay(e) {
    var date = e.detail.currentSelected.year + '-' + e.detail.currentSelected.month + '-' + e.detail.currentSelected.day;
    this.setData({
      nowyear: e.detail.currentSelected.year,
      nowmonth: e.detail.currentSelected.month,
      nowday: e.detail.currentSelected.day,
      nowdate: date
    })
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
    var that = this;
    var data = this.data;
    var url = '';
    if (data.roleId == 8) {
      url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + data.userId + "/plan/detail";
    } else {
      url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + data.planid + "/plan/detail";
    }
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
          }
        }else if(code=="401"){
          wx.navigateTo({
            url: '../../login/login',
          })
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
    const { action, disable } = e.currentTarget.dataset;
    if (disable) {
      this.showToast('抱歉，还不支持～😂');
    }
    this.setData({
      rst: []
    });
    const calendar = this.calendar;
    const { year, month } = calendar.getCurrentYM();
    switch (action) {

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
    //获得角色id
    var roleId = wx.getStorageSync('roleId');
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId');
    var planid = options.planid;
    this.setData({
      roleId: roleId,
      userId: userId,
      token: token,
      planid: planid
    })
  }
});

