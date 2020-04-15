// pages/electromechanical/electroPerson/healthStatuslist/healthStatuslist.js
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
    checkstatus: [{
      id: '1',
      name: '良好'
    }, {
      id: '2',
      name: '异常'
    }], //性别,//审核的状态
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
      id: '1',
      name: '霍营'
    }, {
      id: '2',
      name: '回龙观'
    }, {
      id: '3',
      name: '朱辛庄'
    }],
    stationcheck: null//选中的施工车站
  },
  //添加
  addPerson: function () {
    wx.navigateTo({
      url: '../addhealthStatus/addhealthStatus',
    })
  },
  //健康详情
  persondetails: function (event) {
    //获得id
    var personid = event.currentTarget.dataset.personid;
    var body = event.currentTarget.dataset.body;
    wx.navigateTo({
      url: '../healthStatusdetail/healthStatusdetail?id=' + personid
    })
  },
  //获得身体状况
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
    this.healthStatuslist(checkstatused);
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
    this.setData({
      roleId: roleId,
      mechanicalUserId: mechanicalUserId,
      token: token
    })
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health/healties",
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
              that.healthStatuslist(that.checkstatused);
            }
          }
        }
      },
    })
  },
  //列表数据
  healthStatuslist: function (checkstatused) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = JSON.stringify({
      "pageSize": count,
      "page": 1,
      "body": parseInt(checkstatused)
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health/healties",
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
  //删除
  deletePerson: function (event) {
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
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health",
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
                  url: '../healthStatuslist/healthStatuslist',
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
  }
})
