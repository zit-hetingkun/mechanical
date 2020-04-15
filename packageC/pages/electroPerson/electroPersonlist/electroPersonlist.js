// pages/electromechanical/electroPerson/electroPersonlist/electroPersonlist.js
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
    checkstatused: null,//选中的审核状态
    roleId: null,//角色id
    hiddenmodalput: true,// 初始化隐藏
    hiddenmodalput1: true,//调班的初始化隐藏
    checkstatus: [{
      id: '3',
      name: '待审核'
    }, {
      id: '4',
      name: '审核中'
    }, {
      id: '5',
      name: '已通过'
    },
    {
      id: '6',
      name: '驳回'
    }
    ], //性别,//审核的状态
    persons: [], //列表渲染
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
      id: '1',
      name: '霍营'
    }, {
      id: '2',
      name: '回龙观'
    }, {
      id: '3',
      name: '朱辛庄'
    }],
    stationcheck: null,//选中的施工车站
    personid: null
  },
  //添加
  addPerson: function () {
    wx.navigateTo({
      url: '../addelectroPerson/addelectroPerson',
    })
  },
  //人员详情
  persondetails: function (event) {
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../electroPersondetail/electroPersondetail?personid=' + personid
    })
  },
  //获得审核状态
  bindPickerChange2: function (e) {
    var checkstatus = this.data.checkstatus;
    this.setData({
      index: e.detail.value,
      userLearn: checkstatus[e.detail.value]
    })
    this.checkstatused = checkstatus[e.detail.value].id;
  },
  //获得服务项目部
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


  //通过 flag1 新增  1
  addpersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "4", "status": "5", "flag": "1", "ids": ids });
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
                that.electroPersonlist(data.checkstatused);
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
  //新增的驳回  1
  addpersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "4", "status": "6", "flag": "1", "ids": ids });
    //新增审核
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
                that.electroPersonlist(data.checkstatused);
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
  //修改审核 通过  2 1
  editpersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "5", "status": "5", "flag": "2", "ids": ids });
    wx.showModal({
      title: '修改通过',
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
                that.electroPersonlist(data.checkstatused);
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
  //删除的通过 1 2
  deletepersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "6", "status": "5", "flag": "3", "ids": ids });
    wx.showModal({
      title: '删除通过',
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
                that.electroPersonlist(data.checkstatused);
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
  //修改审核 驳回
  editpersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "5", "status": "6", "flag": "2", "ids": ids });
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
                that.electroPersonlist(data.checkstatused);
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
  //删除的驳回 1 2
  deletepersonReject: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "6", "status": "6", "flag": "3", "ids": ids });
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
                that.electroPersonlist(data.checkstatused);
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


  //拉黑
  personBlock: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "9", "status": "5", "flag": "", "ids": ids });
    wx.showModal({
      title: '拉黑',
      content: '确定拉黑吗',
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
                  title: '已拉黑',
                  icon: 'success',
                  duration: 1000
                });
                that.electroPersonlist(data.checkstatused);
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
  //发证 1
  sendFile: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "8", "status": "5", "flag": "", "ids": ids });
    wx.showModal({
      title: '发证',
      content: '确定发证吗',
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
                  title: '已发证',
                  icon: 'success',
                  duration: 1000
                });
                that.electroPersonlist(that.checkstatused);
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
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/users",
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
              that.electroPersonlist(that.checkstatused);
            }
          }
        } else if (code == "401") {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      },
    })
  },
  //列表数据
  electroPersonlist: function (checkstatused) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = null;
    if (checkstatused != null) {
      //外委
      if (data.roleId == 3) {
        params = JSON.stringify({
          "pageSize": count,
          "page": 1,
          "outerStatus": parseInt(checkstatused)
        });
      }
      //项目部
      if (data.roleId == 2) {
        params = JSON.stringify({
          "pageSize": count,
          "page": 1,
          "projectStatus": parseInt(checkstatused)
        });
      }
      //安质部
      if (data.roleId == 1) {
        params = JSON.stringify({
          "pageSize": count,
          "page": 1,
          "securityStatus": parseInt(checkstatused)
        });
      }
    }
    else {
      params = JSON.stringify({
        "pageSize": count,
        "page": 1,
      });
    }
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/users",
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
  //添加的提交3 
  addSubmit: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "1", "status": "2", "flag": "1", "ids": ids });
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
                that.electroPersonlist(that.checkstatused);
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
  //编辑提交 3 2
  editSubmit: function (event) {
    var data = this.data;
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "2", "status": "2", "flag": "2", "ids": ids });
    wx.showModal({
      title: '提交',
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
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                });
                that.electroPersonlist(that.checkstatused);
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
  deleteSubmit: function (event) {
    var data = this.data;
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "3", "status": "2", "flag": "3", "ids": ids });
    wx.showModal({
      title: '提交',
      content: '确定删除吗',
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
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                });
                that.electroPersonlist(that.checkstatused);
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
  //排班弹框
  orderClass: function (event) {
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    that.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      personid: personid
    })
    //
  },
  //取消按钮 
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
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
  //确认 
  confirm: function (event) {
    var that = this;
    var data = that.data;
    var personid = event.currentTarget.dataset.personid;
    var project = data.formData['project'];
    var params = JSON.stringify({
      "serviceProjectOrg": that.servicecheck,
      "stationId": that.stationcheck,
      "project": project,
      "startTime": data.date,
      "endTime": data.enddate,
      'userId': parseInt(data.personid)
    });
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/plan";
    that.setData({
      hiddenmodalput: true
    })
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
          wx.redirectTo({
            url: '../../../../packageD/pages/crewScheduling/crewSchedulinglist/crewSchedulinglist',
          })
        }
      },
    })
  },
  //调班
  changeClass: function (event) {
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    that.setData({
      hiddenmodalput1: !this.data.hiddenmodalput1,
      personid: personid
    })
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/" + personid + "/plan/detail";
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
          if (stationId == '1') {
            that.setData({
              index4: 0,
              stationcheck: 1
            })
          } else if (stationId == '2') {
            that.setData({
              index4: 1,
              stationcheck: 2
            })
          } else {
            that.setData({
              index4: 2,
              stationcheck: 3
            })
          }
        }
      },
    })
  },

  confirm1: function (event) {
    var that = this;
    var data = that.data;
    var personid = event.currentTarget.dataset.personid;
    var editproject = data.formData['editproject'];
    if (editproject == '') {
      editproject = that.project
    }
    var params = JSON.stringify({
      "id": parseInt(personid),
      "serviceProjectOrg": that.servicecheck,
      "stationId": that.stationcheck,
      "project": editproject,
      "startTime": data.date,
      "endTime": data.enddate
    });
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/plan";
    that.setData({
      hiddenmodalput1: true
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
  cancel1: function () {
    this.setData({
      hiddenmodalput1: true
    });
  }
})
