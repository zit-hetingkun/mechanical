// pages/securityPerson/personage/addpersonage/addpersonage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectArray: [{
      id: '1',
      name: '男'
    }, {
      id: '2',
      name: '女'
    }], //性别
    sitePlaces: [
      {
        id: '1',
        name: '项目部一'
      },
      {
        id: '2',
        name: '项目部二'
      },
      {
        id: '3',
        name: '项目部三'
      }
    ], //选中所属项目部, //所属项目部
    lines: [{
      id: '1',
      name: '生产'
    }, {
      id: '2',
      name: '管理'
    }], //人员类别
    formData: {},
    token: null,
    mechanicalUserId: null,
    gender: null, //选中的性别
    siteplace: null, //选中所属项目部
    line: null, //选中的人员类别
    roleId: null, //角色id
    companys: [{
      id: 1,
      name: '外委单位一'
    },
    {
      id: 2,
      name: '外委单位二'
    },
    {
      id: 3,
      name: '外委单位三'
    },
    {
      id: 4,
      name: '外委单位四'
    }
    ],//公司
    companyed: null,//选中的公司
  },

  //公司
  bindPickerChange4: function (e) {
    var that = this;
    var data = that.data;
    var companys = data.companys;
    that.setData({
      index4: e.detail.value,
      userLearn: companys[e.detail.value],
      companyed: companys[e.detail.value].id
    })
  },




  //下拉数据请求 性别
  bindPickerChange1: function (e) {
    var that = this;
    var data = that.data;
    var projectArray = data.projectArray;
    that.setData({
      index1: e.detail.value,
      userLearn: projectArray[e.detail.value],
      gender: projectArray[e.detail.value].id
    })
  },

  //人员类别
  bindPickerChange2: function (e) {
    var that = this;
    var data = that.data;
    var lines = data.lines;
    that.setData({
      index2: e.detail.value,
      userLearn: lines[e.detail.value],
      line: lines[e.detail.value].id
    })
  },
  //所属项目部
  bindPickerChange3: function (e) {
    var that = this;
    var data = that.data;
    var sitePlaces = data.sitePlaces;
    that.setData({
      index3: e.detail.value,
      userLearn: sitePlaces[e.detail.value],
      siteplace: sitePlaces[e.detail.value].id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      roleId: wx.getStorageSync('roleId')
    })
    // //所属公司
    // wx.request({
    //   url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/common/menu/srcurityCompany",
    //   method: "GET",
    //   header: {
    //     "Content-Type": "application/json",
    //     Authorization: data.token
    //   },
    //   dataType: 'json',
    //   success: function (res) {
    //     //获得数据
    //     var code = res.data.code;
    //     if (code == "200") {
    //       that.setData({
    //         //设置数据
    //         companys: res.data.data
    //       })
    //     }
    //   },
    // })
    // //获得所属项目部数据
    // wx.request({
    //   url: app.globalData.appHost + "/security/" + data.mechanicalUserId + "/common/menu/srcurityCompany",
    //   method: "GET",
    //   header: {
    //     "Content-Type": "application/json",
    //     Authorization: data.token
    //   },
    //   dataType: 'json',
    //   success: function (res) {
    //     //获得数据
    //     var code = res.data.code;
    //     if (code == "200") {
    //       that.setData({
    //         //设置数据
    //         sitePlaces: res.data.data
    //       })
    //     }
    //   },
    // })
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

  //添加
  addPerson: function () {
    var that = this;
    var data = that.data;
    var name = data.formData['name'];
    var age = data.formData['age'];
    var idNum = data.formData['idNum'];
    var phone = data.formData['phone'];
    var registeredAddress = data.formData['registeredAddress'];
    var bjAddress = data.formData['bjAddress'];
    var emergencyPerson = data.formData['emergencyPerson'];
    var emergencyPhone = data.formData['emergencyPhone'];
    var remark = data.formData['remark'];
    //添加校验
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      });
      // return;
    }
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(emergencyPhone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      });
      // return;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(idNum)) {
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
        duration: 1000
      });
      // return;
    }
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user";
    var params = JSON.stringify({
      'name': name,
      'age': parseInt(age),
      'idNum': idNum,
      'gender': data.gender,
      'phone': phone,
      "category": data.line,
      "companyId": data.companyed,
      "projectOrg": data.siteplace,
      'registeredAddress': registeredAddress,
      'bjAddress': bjAddress,
      'emergencyPerson': emergencyPerson,
      'emergencyPhone': emergencyPhone,
      'remark': remark
    });
    wx.request({
      url: url,
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          });
          wx.navigateTo({
            url: '../electroPersonlist/electroPersonlist',
          })
        } else {
          // wx.showToast({
          //   title: '服务器繁忙',
          //   icon: 'none'
          // });
          wx.redirectTo({
            url: '../electroPersonlist/electroPersonlist',
          })

        }
      },
    })
  },
  //取消
  cancel: function () {
    wx.navigateTo({
      url: '../electroPersonlist/electroPersonlist',
    })
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
})