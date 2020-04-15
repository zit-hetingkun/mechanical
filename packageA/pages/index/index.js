//index.js
import myDialog from '../../../components/dialog/dialog';
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
      { url: "../../../image/index.png" },
      { url: "../../../image/index.png" },
    ]
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
    this.setData({
      roleId: roleId,
      userId: userId,
      token: token,
      userInfo:userInfo
    })
    console.log('userid'+userId);

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
    var userId=this.data.userId;
    if (this.data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
       wx.navigateTo({
         url: '/pages/login/login',
       })
      }else{           
        wx.navigateTo({
          url: '/packageA/pages/securityPerson/securityPersonList/securityPersonlist'
        })
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
    var userId=this.data.userId;
    if (this.data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        wx.navigateTo({
          url: '/packageA/pages/successionPlan/successionPlanlist/successionPlanlist',
        })       
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
    var userId=this.data.userId;
    console.log('roleid'+this.data.roleId);
    if(this.data.userInfo!=null){
      if(userId==null||userId==undefined||userId==''){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        if(this.data.roleId==1||this.data.roleId==2){
            wx.navigateTo({
              url: '/packageF/pages/tableanalysis/statisticaldatalist'
            })
        }else{
          wx.showToast({
            title: "无权限",
            icon: "none"
          });
        }
      }     
    }else{
      this.goToauthorization();
    }

  },
  //每日打卡
  dailyclock: function () {
    if(this.data.userInfo==null){
      this.goToauthorization();
    }
  },
  //我的上岗证
  myworklicense: function () {
    var userId=this.data.userId;
    if(this.data.userInfo!=null){
      if(userId==null||userId==undefined||userId==''){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
       if(this.data.roleId==8){
        wx.navigateTo({
          url: '/packageA/pages/securityPerson/myworklicense/myworklicense'
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
    var userId=this.data.userId;    
    if (data.userInfo!=null) {
      if(userId==null||userId==undefined||userId==''){
          wx.navigateTo({
            url: '/pages/login/login',
          })
      }else{
        if (roleId != 8) {
          wx.navigateTo({
            url: '/packageB/pages/addPlan/securityPersonList/securityPersonlist'
          })
        } else if (roleId == 8) {
          wx.navigateTo({
            url: '/packageB/pages/addPlan/checkPlan/checkPlan',
          })
        }
      }    
      //安保人员及其他的高级
    } else {
      this.goToauthorization();
    }
  }
})
