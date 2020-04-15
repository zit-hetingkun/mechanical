//index.js
import myDialog from '../../components/dialog/dialog';
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    roleId: null,
    userId: null,
    token: null,
    userInfo:null,
    movies: [
      { url: "../../image/index.png" },
      { url: "../../image/index.png" },
    ],
    tag:null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    var roleId = wx.getStorageSync("roleId");
    var userId = wx.getStorageSync("userId");
    var token = wx.getStorageSync("token");
    var userInfo = wx.getStorageSync("userInfo");
    var tag=wx.getStorageSync('tag');
    this.setData({
      roleId: roleId,
      userId: userId,
      token: token,
      userInfo:userInfo,
      tag:tag
    })     
  },
  onLoad: function () {   
    // 获取用户信息
    var that=this;
    var data=that.data;
    var userInfo=wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.goToauthorization();
     } 
  },
  //安保人员
  securityPerson: function () {    
    //判断是否进行授权
    var userId=this.data.token;
    var data=this.data;
    if (this.data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
       wx.navigateTo({
         url: '../login/login',
       })
      }else{           
        if(data.tag==null&&data.token!=null){
          wx.redirectTo({
            url: '/packageA/pages/index/index',
          })
      }else if(data.tag!=null&&data.token!=null){
          wx.redirectTo({
            url: '/packageC/pages/index/index',
          })
      }    
      }
    } else {
      this.goToauthorization();
    }
    this.onLoad();
  },
  //排班计划
  successionPlan: function () {
    //角色
    var roleId = this.data.roleId;
    var data=this.data;
    var userId=this.data.token;
    if (this.data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
        wx.navigateTo({
          url: '../login/login',
        })
      }else{
        if(data.tag==null&&data.token!=null){
          wx.redirectTo({
            url: '/packageA/pages/index/index',
          })
      }else if(data.tag!=null&&data.token!=null){
          wx.redirectTo({
            url: '/packageC/pages/index/index',
          })
      }           
      }      
    } else {
      this.goToauthorization();
    }
  },
  //隔离人员统计
  isolatedPersonnel: function () {
    if(this.data.userInfo==null){
      this.goToauthorization();
    }
  },
  //统计明细
  tableanalysis: function () {
    if(this.data.userInfo==null){
      this.goToauthorization();
    }else{
      wx.redirectTo({
        url: '/packageC/pages/index/index',
      })
    }

  },
  //每日打卡
  dailyclock: function () {
    if(this.data.userInfo==null){
      this.goToauthorization();
    }
  },
  //更多
  myworklicense: function () {
    var userId=this.data.token;
    var data=this.data;
    if(this.data.userInfo!=null){
      if(userId==null||userId==undefined||userId==''){
        wx.navigateTo({
          url: '../login/login',
        })
      }else{
        if(data.tag==null&&data.token!=null){
          wx.redirectTo({
            url: '/packageA/pages/index/index',
          })
      }else if(data.tag!=null&&data.token!=null){
          wx.redirectTo({
            url: '/packageC/pages/index/index',
          })
      }      
      }   
    }else{
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
  },
  addPlan: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    var userId=this.data.token;    
    if (data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
          wx.navigateTo({
            url: '../login/login',
          })
      }else{
        if(data.tag==null&&data.token!=null){
            wx.redirectTo({
              url: '/packageA/pages/index/index',
            })
        }else if(data.tag!=null&&data.token!=null){
            wx.redirectTo({
              url: '/packageC/pages/index/index',
            })
        }         
      }    
      //安保人员及其他的高级
    } else {
      this.goToauthorization();
    }
  }
})
