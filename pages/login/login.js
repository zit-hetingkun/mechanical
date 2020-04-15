// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //登录
  loginBind: function () {
    var me = this;
    var thisData = me.data;
    var phone = thisData.formData['phone'];
    var password = thisData.formData['password'];
    //登录成功 权限判断
    //1地铁HR 2地铁安保部 3运营分公司管理员 4中心管理员 5车站管理员 6安保公司管理员 7个人 8安保公司项目部
    if (phone == null || phone == '') {
      wx.showToast({
        title: '请填写账号',
        icon: 'none'
      });
      return;
    }
    if (password == null || password == '') {
      wx.showToast({
        title: '请填写密码',
        icon: 'none'
      });
      return;
    }
    var url = app.globalData.appHost + "/security/auth/login";
    // var url = app.globalData.appHost + "/mechanical/auth/login";
    var datas = JSON.stringify({
      "account": phone,
      "password": password
    });
    wx.request({
      url: url,
      method: "POST",
      data: datas,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.code == "200") {
          //获得数据 roles
          var datas = res.data.data;
          //获得token
          var loginToken = datas.loginToken;
          wx.setStorageSync('token', loginToken);
          //登录成功后 获得标识tag
          var tag = datas.flag;
          //有标识为机电用户
          wx.setStorageSync('tag', tag);
          if (tag != null) {
            //存储标识
            var mechanicalUserRoles = datas.mechanicalUserRoles;
            wx.setStorageSync('mechanicalUserId', mechanicalUserRoles[0].mechanicalUserId);
            wx.setStorageSync('roleId', mechanicalUserRoles[0].roleId);
            wx.redirectTo({
              url: '../../packageC/pages/index/index',
            })
          }
          //无标识 安保
          else {
            wx.setStorageSync('userId', datas.userId);
            if (datas.roles[0] != null) {
              var roleId = datas.roles[0].id;
              wx.setStorageSync('roleId', roleId);
              console.log('rokleid'+roleId);
            }
            wx.redirectTo({
              url: '/packageA/pages/index/index',
            })
          }
        } else {
          wx.showToast({
            title: '用户不存在或密码不正确',
            icon: 'none'
          });
        }
      },

    })
  },
  //注册
  loginRegister: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})