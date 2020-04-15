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
    mechanicalUserId: null,
    total: null,
    checkstatused: null,//选中的施工车站
    roleId: null,//角色id
    hiddenmodalput: true,// 初始化隐藏
    hiddenmodalput1: true,//调班的初始化隐藏
    checkstatus: [{
      id: '1',
      name: '车站一'
    }, {
      id: '2',
      name: '车站二'
    }, {
      id: '3',
      name: '车站三'
    }], //施工车站
    persons: null, //列表渲染
    date: null,//时间
    enddate: null,//结束时间
    listContent: null,
    serviceDepartment: [{
      id: '1',
      name: '第一项目部'
    }, {
      id: '2',
      name: '第二项目部'
    }, {
      id: '3',
      name: '第三项目部'
    }],
    servicecheck: null,//选中的服务部
    serviceStations: [{ //施工车站
      id: 1,
      name: '霍营'
    }, {
      id: 2,
      name: '回龙观'
    }, {
      id: 3,
      name: '朱辛庄'
    }],
    stationcheck: null,//选中的施工车站
    planid: null,
    personid: null,
    operateProject: null,//操作人所属项目
  },
  //获得施工车站
  bindPickerChange2: function (e) {
    var checkstatus = this.data.checkstatus;
    this.setData({
      index: e.detail.value,
      userLearn: checkstatus[e.detail.value]
    })
    this.checkstatused = checkstatus[e.detail.value].id;
  },

  //获得项目部
  bindPickerChange3: function (e) {
    var serviceDepartment = this.data.serviceDepartment;
    this.setData({
      index1: e.detail.value,
      userLearn: serviceDepartment[e.detail.value]
    })
    this.servicecheck = serviceDepartment[e.detail.value].id;
  },
  //获得施工车站
  bindPickerChange4: function (e) {
    var serviceStations = this.data.serviceStations;
    this.setData({
      index2: e.detail.value,
      userLearn: serviceStations[e.detail.value]
    })
    this.stationcheck = serviceStations[e.detail.value].id;
  },


  //搜索
  searchPlace: function () {
    var checkstatused = this.checkstatused;
    //展示的方法
    this.electroPersonlist(checkstatused);
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
    var mechanicalUserId = wx.getStorageSync('mechanicalUserId');
    var date = new Date().toLocaleDateString();
    var enddate = new Date().toLocaleDateString();
    this.setData({
      roleId: roleId,
      mechanicalUserId: mechanicalUserId,
      token: token,
      date: date,
      enddate: enddate
    })
    //获得操作人的项目部
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/" + data.mechanicalUserId + "/userDetail",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        var project = data.projectOrg.toString();
        if (code == "200") {
          if (data != null) {
            that.setData({
              operateProject: project
            })
          }
        } else if (code == "401") {
          wx.navigateTo({
            url: '../../login/login',
          })
        }
      },
    })
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/schedulings",
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
          if (data == null) {
            that.setData({
              listContent: '暂无内容'
            })
          }
          if (data != null) {
            count = data.total;
            if (count != null) {
              that.setData({
                total: count
              })
              that.crewScheduling(that.checkstatused);
            }
          }
        } else if (code == "401") {
          wx.navigateTo({
            url: '../../login/login',
          })
        }
      },
    })
  },
  //列表数据
  crewScheduling: function (checkstatused) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = JSON.stringify({
      "pageSize": count,
      "page": 1,
      "station": parseInt(checkstatused)
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/schedulings",
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
          var result = res.data.data;
          if (result != null) {
            that.setData({
              persons: result.rows
            })
          }
        }
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


  },
  //排班提交
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
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //调班提交
  editSubmit: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "2", "status": "2", "flag": "2", "ids": ids });
    wx.showModal({
      title: '修改提交',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //删除提交
  deleteSubmit: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "3", "status": "2", "flag": "3", "ids": ids });
    wx.showModal({
      title: '删除提交',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //结束时间 
  _bindDateChange1: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      enddate: olddata2
    });
  },
  get bindDateChange1() {
    return this._bindDateChange1;
  },
  set bindDateChange1(value) {
    this._bindDateChange1 = value;
  },


  //开始时间
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

  //评价
  changeClass1: function (event) {
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    that.setData({
      hiddenmodalput1: !this.data.hiddenmodalput1,
      planid: personid
    })
  },
  //评价
  confirm1: function (event) {
    var that = this;
    var data = that.data;
    var evaluateContent = data.formData['evaluateContent'];
    var params = JSON.stringify({
      "id": parseInt(data.planid),
      "evaluate": evaluateContent
    });
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/plan";
    wx.request({
      url: url,
      method: "PUT",
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
            hiddenmodalput1: true
          })
          // that.electroPersonlist(that.checkstatused);
        }
      },
    })
    that.setData({
      hiddenmodalput1: true
    })
    wx.redirectTo({
      url: '../../evaluate/evaluatelist/evaluatelist',
    })
  },
  //取消
  cancel1: function () {
    this.setData({
      hiddenmodalput1: true
    });
  },
  //删除排班
  deleteClass: function (event) {
    var data = this.data;
    //请求接口
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    wx.showModal({
      title: '删除',
      content: '确定删除吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/schedulings",
            method: "DELETE",
            data: ids,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                });
                wx.redirectTo({
                  url: '../crewSchedulinglist/crewSchedulinglist',
                })
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
          wx.showToast({
            title: '已删除',
            icon: 'none',
            duration: 1000
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //调班
  changeClass: function (event) {
    var that = this;
    var data = that.data;
    var personid = event.currentTarget.dataset.personid;
    that.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      personid: personid
    })
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/" + data.personid + "/plan/detail";
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          var result = res.data.data;
          that.setData({
            project: result.project,
            date: result.startTime,
            enddate: result.endTime
          })
          //服务项目部
          var serviceProjectOrg = result.serviceProjectOrg;
          if (serviceProjectOrg == '1') {
            that.setData({
              index1: 0,
              servicecheck: 1
            })
          } else if (serviceProjectOrg == '2') {
            that.setData({
              index1: 1,
              servicecheck: 2
            })
          } else {
            that.setData({
              index1: 2,
              servicecheck: 3
            })
          }
          //车站
          var stationId = result.stationId;
          if (stationId == 1) {
            that.setData({
              index2: 0,
              stationcheck: 1
            })
          } else if (stationId == 2) {
            that.setData({
              index2: 1,
              stationcheck: 2
            })
          } else {
            that.setData({
              index2: 2,
              stationcheck: 3
            })
          }
        }
      },
    })
  },
  //添加通过
  addSchedulingPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "4", "status": "5", "flag": "1", "ids": ids });
    wx.showModal({
      title: '通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //添加驳回
  addSchedulingReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "4", "status": "6", "flag": "1", "ids": ids });
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //删除的通过
  deleteSchedulingPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "6", "status": "5", "flag": "3", "ids": ids });
    wx.showModal({
      title: '通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //删除驳回
  deleteSchedulingReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "6", "status": "6", "flag": "3", "ids": ids });
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //修改审核
  editSchedulingPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "5", "status": "5", "flag": "2", "ids": ids });
    wx.showModal({
      title: '通过',
      content: '确定通过吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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
  //修改的驳回
  editSchedulingReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "2", "operation": "5", "status": "6", "flag": "2", "ids": ids });
    wx.showModal({
      title: '驳回',
      content: '确定驳回吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/change/status",
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
                that.crewScheduling(that.checkstatused);
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

  confirm: function (event) {
    var that = this;
    var data = that.data;
    var personid = event.currentTarget.dataset.personid;
    var editproject = data.formData['editproject'];
    console.log('editproject' + editproject);
    if (editproject == '') {
      editproject = that.project
    }
    var params = JSON.stringify({
      "id": parseInt(data.personid),
      "serviceProjectOrg": that.servicecheck,
      "stationId": that.stationcheck,
      "project": editproject,
      "startTime": data.date,
      "endTime": data.enddate
    });
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/plan";
    that.setData({
      hiddenmodalput: true
    })
    wx.redirectTo({
      url: '../../../../packageD/pages/crewScheduling/crewSchedulinglist/crewSchedulinglist',
    })
    wx.request({
      url: url,
      method: "PUT",
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
        }
      },
    })
  },
  //取消
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  }
})
