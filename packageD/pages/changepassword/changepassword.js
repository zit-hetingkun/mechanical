// pages/electromechanical/changepassword/changepassword.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authCode: '',     //全局验证码
    formData: {},
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //刚进入页面随机先获取一个
    this.createCode();
    var userId=wx.getStorageSync('userId');
    this.setData({
      userId:userId
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

  exchange: function () {
    this.createCode();
  },
  //生成验证码
  createCode: function () {
    var code;
    //首先默认code为空字符串
    code = '';
    //设置长度，这里看需求，我这里设置了4
    var codeLength = 4;
    //设置随机字符
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    //循环codeLength 我设置的4就是循环4次
    for (var i = 0; i < codeLength; i++) {
      //设置随机数范围,这设置为0 ~ 36
      var index = Math.floor(Math.random() * 36);
      //字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    //将拼接好的字符串赋值给展示的code
    this.setData({
      code: code
    })
    //将生成的验证码赋值给全局变量
    this.setData({
      authCode: code
    })
    // console.log('全局的验证码'+this.data.authCode);
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

  //修改密码 
  registerBind: function () {
    var that = this;
    var thisData = that.data;
    //输入的验证码
    var inputcode = thisData.formData['authcode'];
    //旧密码
    var startpassword = thisData.formData['startpassword'];
    //新密码及确认密码
    var password = thisData.formData['password'];
    var confirmPassword = thisData.formData['confirmPassword'];
    //用户名
    // var userName = thisData.formData['userName'];
    // var phone = thisData.formData['phone'];
    // var idNum = thisData.formData['idNum'];
    var account = thisData.formData['account'];
    //startpassword
    // if (userName == undefined || userName == '') {
    //   wx.showToast({
    //     title: '请填写姓名',
    //     icon: 'none'
    //   });
    //   return;
    // }
    // if (phone == undefined || phone == '') {
    //   wx.showToast({
    //     title: '请填写手机号',
    //     icon: 'none'
    //   });
    //   return;
    // }
    // if (idNum == undefined || idNum == '') {
    //   wx.showToast({
    //     title: '请填写身份证号',
    //     icon: 'none'
    //   });
    //   return;
    // }
    if (account == undefined || account == '') {
      wx.showToast({
        title: '请填写账号',
        icon: 'none'
      });
      return;
    }
    if (password == undefined || password == '') {
      wx.showToast({
        title: '请填写密码',
        icon: 'none'
      });
      return;
    }
    if (confirmPassword == undefined || confirmPassword == '') {
      wx.showToast({
        title: '请填写确认密码',
        icon: 'none'
      });
      return;
    }
    if (startpassword == undefined || startpassword == '') {
      wx.showToast({
        title: '请填写初始密码',
        icon: 'none'
      });
      return;
    }
    //密码判断
    if (password !== confirmPassword) {
      wx.showToast({
        title: '密码与确认密码不符',
        icon: 'none'
      });
      return;
    }
    if (inputcode == undefined || inputcode == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none'
      });
      return;
    }
    //将验证码转换成大写
    if (inputcode != null || inputcode != undefined) {
      inputcode = inputcode.toUpperCase();
      //验证码不对
      if (inputcode !== thisData.authCode) {
        wx.showToast({
          title: '验证码不正确',
          icon: 'none'
        });
        this.exchange();
        return;
      }
      else {
        //验证码正确
        var url = app.globalData.appHost + "/mechanical/"+this.data.userId+"/user/resetPassword";
        var datas = JSON.stringify({
          "account": account,
          "oldPassword": startpassword,
          "newPassword": password
        });
        wx.request({
          url: url,
          method: "POST",
          data: datas,
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            //获得code
            if (res.data.code == "200") {
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '请核实信息后，重新进行修改',
              icon: 'none',
              duration: 2000
            });
          }
        })
      }
    }
  }
})