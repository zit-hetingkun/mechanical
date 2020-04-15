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
    date: null,//时间
    listContent:null

  },
  //添加
  addPerson: function () {
    wx.navigateTo({
      url: '../personage/addpersonage/addpersonage',
    })
  },
  //人员详情
  persondetails: function (event) {
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../personage/personagedetail/personagedetail?personid=' + personid
    })
  },
  //获得选中的中心
  bindPickerChange2: function (e) {
    var securityCompany = this.data.securityCompany;
    this.setData({
      index: e.detail.value,
      userLearn: securityCompany[e.detail.value]
    })
    this.securityed = securityCompany[e.detail.value].id;
  },

  //搜索
  searchPlace: function () {
    var securityed = this.securityed;
    //展示的方法
    this.securityPersonlist(securityed);
  },


  //通过 flag1 新增 3 1
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
  //新增的驳回 3 1
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
  //修改审核 通过
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
  //删除的通过
  deletepersonPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "6", "status": "5", "flag": "3", "ids": ids });
    wx.showModal({
      title: '修改通过',
      content: '确定通过吗',
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
  //删除的驳回
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
                  title: '已拉黑',
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
                  title: '已发证',
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
  //岗前培训通过 3
  trainPass: function (event) {
    var that = this;
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "7", "status": "5", "flag": "", "ids": ids });
    wx.showModal({
      title: '培训通过',
      content: '确定通过吗',
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
                  title: '已通过',
                  icon: 'success',
                  duration: 1000
                });
                that.securityPersonlist(that.securityed);
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
    this.setData({
      roleId: roleId,
      userId: userId,
      token: token,
      date: date
    })
    if(userId==null){
      wx.navigateTo({
        url: '../../../../pages/login/login',
      })
      return;
  }
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/users",
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data=res.data.data;
        if (code == "200") {
          if(data==null){           
            that.setData({
              listContent:'暂无内容'
            })            
        }
          if(data!=null){
            count = data.total;
            if(count!=null){
             that.setData({
               total:count
             })
              that.securityPersonlist(that.securityed);
            }
          }         
        }else if(code=="401"){
           wx.navigateTo({
             url: '../../../../pages/login/login',
           })
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
      "securityCompanyId": parseInt(securityed)
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/users",
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
          if(result!=null){
            that.setData({
              persons: result.rows
            })
          }
        } else if(code=="401"){
          wx.navigateTo({
            url: '../../../../pages/login/login',
          })              
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
  //添加的提交 4或6
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
  //排班计划
  schedulePlan: function (event) {
    //获得人员id
    var planid = event.currentTarget.dataset.planid;
    wx.navigateTo({
      url: '/pages/successionPlan/crewScheduling/crewScheduling?planid=' + planid,
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
  editPerson:function(event){
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
                  title: '提交成功',
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
  deleteSubmit: function (event) {
    var data = this.data;
    var that = this;
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "3", "status": "2", "flag": "3", "ids": ids });
    wx.showModal({
      title: '提交',
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
                  title: '提交成功',
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
  }
})
