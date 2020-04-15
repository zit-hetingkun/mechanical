//index.js
//获取应用实例
import myDialog from '../../components/dialog/dialog';
const app = getApp()  //生命一个实例，调用app.js中全局的数据和函数
Page({
  data: {  //定义页面初始化数据
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userId: null,
    token: null,
    roleId: null
  },
  onShow:function(){
    var roleId = wx.getStorageSync('roleId');
    //获得token userId
    var userId = wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync("userInfo");
    app.globalData.userInfo = userInfo;
    this.setData({
      roleId: roleId,
      token: token,
      userId: userId,
      userInfo:userInfo
    })
  },
  onLoad: function () {  //监听页面加载
    //获得角色id
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
     // 获取用户信息
     if (this.data.userInfo==null) {
      this.goToauthorization();
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync("userInfo", e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //消息
  goToMessagePage: function () {
    if (this.data.userInfo==null) {
      this.goToauthorization();
    } 
  },
  //我的上岗证
  goToWorklicense: function () {
    if (this.data.userInfo!=null) {
     if(this.data.userId==null||this.data.userId==''||this.data.userId==undefined){
       wx.navigateTo({
         url: '../login/login',
       })
     }else{
       if(this.data.roleId==8){
        var data = this.data;
        var url = app.globalData.appHost + "/security/" + data.userId + "/user/" + data.userId + "/userDetail";
        //如果用户为最底层 进来就直接是详情的页面 personid传userid
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
                wx.navigateTo({
                  url: '../securityPerson/personage/personagedetail/personagedetail'
                })              
            }else{
              {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            }
          },
        })
      } 
       }     
    }else {
      this.goToauthorization();     
    }
  },
  //排班
  goToWorkScheduling: function () {
   if(this.data.userInfo!=null){
    if(this.data.userId==null||this.data.userId==''||this.data.userId==undefined){
        wx.navigateTo({
          url: '../login/login',
        })
    }else{
     if(this.data.roleId==8){
      wx.navigateTo({
        url: '../addPlan/checkPlan/checkPlan',
      })
     }
    } 
   }else {
      this.goToauthorization();
    }
  },
  //如果未授权 进行授权
  goToauthorization: function () {
    if(this.data.userInfo==null){
      myDialog.showModal({
        title: "提示",
        content: " 小程序需要授权才能提供更好的服务哦~",
        confirmOpenType: "getUserInfo",  //如果不设置就是普通弹框
        success: (e) => {
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                //已授权
                let userInfo = e.detail.userInfo;
                wx.setStorageSync("userInfo", userInfo);
                this.onShow();
              }
            }
          })
        },
        fail: (err) => {
          // 用户不小必点到拒绝,提示登录失败
          wx.showToast({
            title: "登录失败",
            icon: "none"
          });
        }
      });
    }  
  }
})


