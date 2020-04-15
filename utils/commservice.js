//获取应用实例
const app = getApp()
var service = {};

//获取用户的session值
service.getSessionId = function(){
  var tpd_sessionid = wx.getStorageSync('tpd_sessionid');
  return tpd_sessionid;
}
service.wxLogin = function(){
  wx.showLoading({
    mask: true
  });
  var promise = new Promise(function (resolve, reject) {
    wx.login({
      timeout: 5000,
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            success: function (res1) {
              // 发起网络请求
              wx.hideLoading();
              wx.request({
                url: app.globalData.appHost + '/wx/miniprogramLogin.jsn',
                data: {
                  code: res.code,
                  encryptedData: res1.encryptedData,
                  iv: res1.iv
                },
                success: function (resBiz) {
                  var data = resBiz.data;
                  //将sessionid放到缓存里
                  // var sessionId = data.data.accept_token;
                  // var sysWxUser = data.data.sysWxUser;
                  // app.globalData.sysWxUser = sysWxUser;
                  // var bind = data.data.bind;
                  // wx.setStorageSync('tpd_sessionid', sessionId);
                  // resolve(sysWxUser);

                }
              });
            },
            fail: function () {
              wx.hideLoading();
              console.log('获取用户信息失败')
              wx.navigateTo({
                url: "/pages/login/wx/wx-authorize"
              });
            }
          });

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 1000
          });
          reject(res.errMsg);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        });
        reject('登录失败');
      }
    });
  });
 
  return promise;
 
}

service.httpErrorAction = function(res){
  //处理错误消息
  var data = res.data;
  
  if(data.errType =='wx_user_not_login'){

    wx.getSetting({
      success: function (res) {
        //微信授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
              commonService.wxLogin();
            }
          })
        } else {
          wx.showModal({
            title: '需要登录',
            content: '登录后才可进入',
            showCancel: true,
            confirmColor: '#405f80',
            cancelColor: '#333',
            success(res) {
              if (res.confirm) {
                service.wxLogin();
              } else if (res.cancel) {
                // wx.navigateBack({
                //   delta: 1
                // })
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    });
    //service.wxLogin();
  
  } else if (data.errType == 'user_not_bind') {
    wx.showModal({
      title: '需要登录',
      content: '登录后才可进入',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
           wx.navigateTo({
      url: "/pages/login/login"
    });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else{
    var errMsg = data.errMsg;
    if (!errMsg){
      errMsg = "后台异常";
    }
    wx.showModal({
      title: '信息提示',
      content: errMsg,
      showCancel:false
    })
  }
}


module.exports = service;