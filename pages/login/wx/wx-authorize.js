// pages/login/wx/wx-authorize.js
//index.js
//获取应用实例
var app = getApp();
var commonService = require('../../../utils/commservice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var me = this;
    //    debugger
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      // commonService.wxLogin();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        app.globalData.userInfo = res.userInfo
        commonService.wxLogin();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          commonService.wxLogin();
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(app.globalData.userInfo);
    //判断用户是否授权
    if (app.globalData.userInfo) {
      console.log('授权方法');
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      //授权 直接跳转首页
      wx.switchTab({
        url: '/pages/index/index',
      })
      // commonService.wxLogin().then(res => {
      //   wx.switchTab({
      //     url: "/pages/index/index"
      //   });
      // });
    } else {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮  之后再调用授权的接口
        var that = this;
        console.log("detail");
        console.log( e.detail.userInfo);
        that.setData({
          userInfo: e.detail.userInfo,
        });
        app.globalData.userInfo = e.detail.userInfo;
        wx.switchTab({
          url: '/pages/index/index',
        })
        // commonService.wxLogin().then(res => {
          // commonService.request({
          //   url: app.globalData.appHost + "/admin/scaleUser/getLoginScaleUser.jsn",
          //   data: {},
          //   success: function (res) {
          //     var data = res.data;
          //     if (data.success) {
          //       wx.switchTab({
          //         url: "/pages/index/index"
          //       });
          //       //this_.processScaleData(res.data);
          //     } else {
          //       wx.navigateTo({
          //         url: "/pages/login/login"
          //         // url: "/pages/login/phone/phone-authorize"
          //       });
          //     }
          //   }
          // });

        // });
      } else {
        // wx.navigateBack({
        //   delta: 2
        // })
        //用户按了拒绝按钮
        // wx.showModal({
        //   title: '警告',
        //   content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        //   showCancel: false,
        //   confirmText: '返回授权',
        //   success: function (res) {
        //     // 用户没有授权成功
        //     if (res.confirm) {
        //       console.log('用户点击了“返回授权”');
        //     }
        //   }
        // });
      }

    }


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