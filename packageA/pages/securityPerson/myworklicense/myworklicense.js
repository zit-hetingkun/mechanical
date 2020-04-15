// pages/securityPerson/myworklicense/myworklicense.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    token: null,
    roleId: null,
    image: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var roleId = wx.getStorageSync('roleId');
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId');
    this.setData({
      roleId: roleId
    })
    this.setData({
      userId: userId
    })
    this.setData({
      token: token
    })
    this.getWorkLicense();



  },
  getWorkLicense: function () {
    var that = this;
    var data = that.data;
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/" + data.userId + "/userDetail";
    //如果用户为最底层 进来就直接是详情的页面 personid传啥
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
        var datas = res.data.data;
        if (code == "200") {
          var image = datas.workLicensePath;
          that.setData({
            image: image
          })
        }else if(code=="401"){
          wx.navigateTo({
            url: '../../login/login',
          })
        }
      },
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

  }
})