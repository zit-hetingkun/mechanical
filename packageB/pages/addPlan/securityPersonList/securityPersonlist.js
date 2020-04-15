var commonService = require('../../../../utils/commservice.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    searchuserName: '',
    token: null,
    userId: null,
    total: null,
    securityed: null,//选中的安保公司id
    roleId: null,//角色id
    hrStatus: '',//hr状态
    branchStatus: '',//运营公司状态
    stationAreaStatus: '',//站区状态
    stationStatus: '',//车站状态
    securityStatus: '',//安保公司状态
    securityCompany: [],//安保公司
    persons: [], //列表渲染
    isClick: false,//初始化发证的按钮是显示\
    hiddenmodalput: true,//添加温度的弹框隐藏控制 初始化隐藏
    line: null, //就诊结果
    lines: [{
      id: '1',
      name: '正常'
    }, {
      id: '2',
      name: '疑似留观'
    }, {
      id: '3',
      name: '确诊'
    }], //就诊结果
    date: null,//时间
    planid: null,//选中的温度id
    listContent:null//如列表无数据时 展示暂无内容


  },
  //下拉数据请求 就诊结果
  bindPickerChange1: function (e) {
    var lines = this.data.lines;
    this.setData({
      index1: e.detail.value
    })
    this.setData({
      userLearn: lines[e.detail.value]
    })
    this.setData({
      line: lines[e.detail.value].id
    })
  },

  //获得选中的中心
  bindPickerChange2: function (e) {
    var securityCompany = this.data.securityCompany;
    this.setData({
      index: e.detail.value
    })
    this.setData({
      userLearn: securityCompany[e.detail.value]
    })
    this.securityed = securityCompany[e.detail.value].id;
  },
  //搜索的清除
  clean:function(){
    var _this=this
   setTimeout(function () {
     _this.setData({
       inputValue: '',
     })
   },100)
 },

  //搜索
  searchPlace: function () {
    var securityed = this.securityed;
    //展示的方法
    this.securityPersonlist(securityed);
  },


  //通过 flag1 新增 4 6
  addpersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "4", "status": "5", "flag": "1", "ids": ids });
    //新增审核4 6  对8新增进行审核
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已通过',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //新增的驳回 4 6
  addpersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "4", "status": "6", "flag": "1", "ids": ids });
    //新增审核
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已驳回',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //修改审核 通过 4 6
  editpersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "5", "status": "5", "flag": "2", "ids": ids });
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '修改通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已通过',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除的通过 4 6
  deletepersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "6", "status": "5", "flag": "3", "ids": ids });
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '修改通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已通过',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //修改审核 驳回 4 6
  editpersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "5", "status": "6", "flag": "2", "ids": ids });
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已驳回',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除的驳回 4 6
  deletepersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "6", "status": "6", "flag": "3", "ids": ids });
    var url = app.globalData.appHost + "/security/" + data.userId + "/common/change/status";
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          //0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
          wx.request({
            url: url,
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已驳回',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(data.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

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

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = this.data;
    //获得角色id
    var roleId = wx.getStorageSync('roleId');
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId');
    var date = new Date().toLocaleDateString();
    // var planTime=new Date();
    // planTime=planTime.getFullYear+'-'+planTime.getMonth+'-'+planTime.getDate;
    this.setData({
      roleId: roleId,
      userId: userId,
      token: token,
      date: date
    })
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/schedulings",
      method: "POST",
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
          if(data==null){           
            that.setData({
              listContent:'暂无内容'
            })            
        }
          if(data!=null){
            count = data.total;
            that.setData({
              total:count
            })
            that.securityPersonlist(that.securityed);
          }
        }
      },
    })
  },
  //列表数据
  securityPersonlist: function (securityed) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = JSON.stringify({
      "pageSize": count,
      "page": 1,
      // "securityCompanyId": parseInt(securityed)
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/schedulings",
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        //列表数据
        if (code == "200") {
          var data = res.data.data;
          if(data!=null){
            var result=data.rows;
            that.setData({
              persons: result
            })
          }         
        }
      },
    })
    //获得安保公司列表
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/srcurityCompany",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            securityCompany: res.data.data
          })
        }
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


  },
  //添加的提交 8
  addSubmit: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "1", "status": "2", "flag": "1", "ids": ids });
    wx.showModal({
      title: '添加提交',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/security/" + data.userId + "/common/change/status",
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已提交',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(that.securityed);
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //添加排班计划 8
  schedulePlan: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../calendarComponent/index?planid=' + personid,
    })
  },
  //填写温度
  addTemperature: function (event) {
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    that.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      planid: personid
    })

  },
  //查看排班计划
  checkSchedule: function (event) {
    var that = this;
    var data = that.data;
    //获得人员id
    var planid = event.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../checkPlan/checkPlan?planid=' + planid,
    })
  },

  //取消按钮 
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //温度确认 
  confirm: function (event) {
    var that = this;
    var data = that.data;
    var planid = event.currentTarget.dataset.personid;
    var timetest = data.date;
    var temperature = data.formData['temperature'];
    var params = JSON.stringify({
      "stationTemperature": temperature,
      "stationTemperatureTime": timetest,
      "result": data.line
    });
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/" + that.data.planid + "/temperature";
    wx.request({
      url: url,
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            hiddenmodalput: true
          })
          that.securityPersonlist(that.securityed);
        }
      },
    })
  },
  _bindDateChange: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      date: olddata2
    });
  },
  get bindDateChange() {
    return this._bindDateChange;
  },
  set bindDateChange(value) {
    this._bindDateChange = value;
  },
  //修改的提交
  deleteSubmit:function(event){
    var ids = [];
    var data = this.data;
    var that=this;
     //获得人员id
     var personid = event.currentTarget.dataset.personid;
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "2", "status": "2", "flag": "2", "ids": ids });
    wx.showModal({
      title: '删除提交',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/security/" + data.userId + "/common/change/status",
            method: "POST",
            data: params,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已提交',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(that.securityed);
              }
              else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
