//index.js
import myDialog from '../../../components/dialog/dialog';
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    roleId: null,
    mechanicalUserId: null,
    token: null,
    userInfo: null,
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
  onShow: function () {
    var roleId = wx.getStorageSync("roleId");
    var mechanicalUserId = wx.getStorageSync("mechanicalUserId");
    var token = wx.getStorageSync("token");
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      roleId: roleId,
      mechanicalUserId: mechanicalUserId,
      token: token,
      userInfo: userInfo
    })

  },
  onLoad: function () {
    // 获取用户信息
    var that = this;
    var data = that.data;
    var userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      this.goToauthorization();
    }

  },
  //机电人员
  electroPerson: function () {
    //判断是否进行授权
    var mechanicalUserId = this.data.mechanicalUserId;
    if (this.data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        //  wx.navigateTo({
        //    url: '/pages/login/login',
        //  })
        wx.navigateTo({
          url: '/packageC/pages/electroPerson/electroPersonlist/electroPersonlist'
        })
      } else {
        wx.navigateTo({
          url: '/packageC/pages/electroPerson/electroPersonlist/electroPersonlist'
        })
      }
    } else {
      this.goToauthorization();
    }
    this.onLoad();
  },
  //行动轨迹
  momentPath: function () {
    //角色
    var roleId = this.data.roleId;
    var mechanicalUserId = this.data.mechanicalUserId;
    if (this.data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
        wx.navigateTo({
          url: '/packageE/pages/movement/movementlist/movementlist',
        })
      } else {
        wx.navigateTo({
          url: '/packageE/pages/movement/movementlist/movementlist',
        })
      }
    } else {
      this.goToauthorization();
    }
  },
  //排班
  scheduling: function () {
    var mechanicalUserId = this.data.mechanicalUserId;
    if (this.data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
        wx.navigateTo({
          url: '/packageD/pages/crewScheduling/crewSchedulinglist/crewSchedulinglist',
        })
      } else {
        wx.navigateTo({
          url: '/packageD/pages/crewScheduling/crewSchedulinglist/crewSchedulinglist',
        })
      }
    } else {
      this.goToauthorization();
    }
  },
  //上岗证
  tableanalysis: function () {
    var mechanicalUserId = this.data.mechanicalUserId;
    if (this.data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        wx.navigateTo({
            url: '/pages/login/login',
        })
      } else {
          if(this.data.roleId==4){
            wx.navigateTo({
              url: '/packageC/pages/electroPerson/workLicense/workLicense',
            })
          }
      }
    }else{
      this.goToauthorization();

    }
  },
  //
  evaluatelist: function () {
    var mechanicalUserId = this.data.mechanicalUserId;
    if (this.data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
        wx.navigateTo({
          url: '/packageD/pages/evaluate/evaluatelist/evaluatelist'
        })
      } else {
        wx.navigateTo({
          url: '/packageD/pages/evaluate/evaluatelist/evaluatelist'
        })
      }
    } else {
      this.goToauthorization();
    }
  },
  //如果未授权 进行授权
  goToauthorization: function () {
    if (this.data.userInfo == null) {
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
  //健康状况
  healthStatus: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    var mechanicalUserId = this.data.mechanicalUserId;
    if (data.userInfo != null) {
      if (mechanicalUserId == null || mechanicalUserId == undefined || mechanicalUserId == '') {
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
        wx.navigateTo({
          url: '/packageD/pages/healthStatus/healthStatuslist/healthStatuslist'
        })
      } else {
        wx.navigateTo({
          url: '/packageD/pages/healthStatus/healthStatuslist/healthStatuslist'
        })
      }
    } else {
      this.goToauthorization();
    }
  }
})
