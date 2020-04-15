var commonService = require('../../../../utils/commservice.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    token: null,
    mechanicalUserId: null,
    total: null,
    checkstatused: null,//选中的审核状态
    roleId: null,//角色id
    checkstatus: [{
      id: 1,
      name: '公司一'
    }, {
      id: 2,
      name: '公司二'
    }, {
      id: 3,
      name: '公司三'
    }], //公司
    persons: null, //列表渲染
    date: null,//时间
    enddate: null,//结束时间
    listContent: null,
  },
  //添加
  addMovement: function () {
    wx.navigateTo({
      url: '../addmovement/addmovement',
    })
  },
  //详情
  persondetails: function (event) {
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../movementdetail/movementdetail?personid=' + personid
    })
  },
  //获得所属公司
  bindPickerChange2: function (e) {
    var checkstatus = this.data.checkstatus;
    this.setData({
      index: e.detail.value,
      userLearn: checkstatus[e.detail.value]
    })
    this.checkstatused = checkstatus[e.detail.value].id;
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
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/movements",
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
              that.movementlist(that.checkstatused);
            }
          }
        }
      },
    })
  },
  //列表数据
  movementlist: function (checkstatused) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = JSON.stringify({
      "pageSize": count,
      "page": 1,
      "companyId": parseInt(checkstatused)
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/movements",
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
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


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
  //删除
  deleteMovement: function (event) {
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
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement",
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
})
