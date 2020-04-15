const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: null,
    mechanicalUserId: null,
    image: '',
    person:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var roleId = wx.getStorageSync('roleId');
    var token = wx.getStorageSync('token');
    var mechanicalUserId = wx.getStorageSync('mechanicalUserId');
    this.setData({
      roleId: roleId,
      mechanicalUserId: mechanicalUserId,
      token: token
    })
    this.getWorkLicense();
  },
  getWorkLicense: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
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
        var datas = res.data.data;
        if (code == "200") {
          that.setData({
            person:datas
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