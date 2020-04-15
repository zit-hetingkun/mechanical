// pages/electromechanical/electroPerson/electroPersondetail/electroPersondetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personid: null,//人员id
    roleId: null,//角色id
    token: null,//token
    mechanicalUserId: null,//用户id
    company: null,
    body: null,
    age: null,
    symptom: null,
    isConfirm: null,
    name: null,
    isTouch: null,
    isDoctor: null,
    result: null,
    provePath: null,
    idNum: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var personid = options.id;
    var roleId = wx.getStorageSync('roleId');
    var mechanicalUserId = wx.getStorageSync('mechanicalUserId');
    var token = wx.getStorageSync('token');
    this.setData({
      personid: personid,
      roleId: roleId,
      token: token,
      mechanicalUserId: mechanicalUserId
    })
    //调用详情的方法
    this.getHealthstatusdetail();
  },
  //获得详情
  getHealthstatusdetail: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health/" + data.personid + "/detail",
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
            age: datas.age,
            name: datas.name,
            result: datas.result,
            provePath: datas.provePath
          })
          var company = datas.companyId;
          if (company == 1) {
            that.setData({
              company: '外委单位一',
            })
          }
          if (company == 2) {
            that.setData({
              company: '外委单位二',
            })
          }
          else if (company == 3) {
            that.setData({
              company: '外委单位三',
            })
          }
          else if (company == 4) {
            that.setData({
              company: '外委单位四',
            })
          }
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            idNum: idNumfuzzy
          })
          var gender = datas.gender;
          if (gender == "1") {
            that.setData({
              gender: '男'
            })
          } else {
            that.setData({
              gender: '女'
            })
          }
          var body = datas.body;
          if (body == "1") {
            that.setData({
              body: '良好'
            })
          } else if (body == "2") {
            that.setData({
              body: '异常'
            })
          }
          //不适症状
          if (datas.symptom == "1") {
            that.setData({
              symptom: '乏力'
            })
          } else if (datas.symptom == "2") {
            that.setData({
              symptom: '胸闷'
            })
          } else if (datas.symptom == "3") {
            that.setData({
              symptom: '干咳'
            })
          } else if (data.symptom == "4") {
            that.setData({
              symptom: '发烧'
            })
          }
          //确诊
          if (datas.isConfirm == "1") {
            that.setData({
              isConfirm: '是'
            })
          } else if (datas.isConfirm == "2") {
            that.setData({
              isConfirm: '否'
            })
          }
          //isTouch
          if (datas.isTouch == "1") {
            that.setData({
              isTouch: '是'
            })
          } else if (datas.isTouch == "2") {
            that.setData({
              isTouch: '否'
            })
          }
          var isDoctor = datas.isDoctor;
          if (isDoctor == "1") {
            that.setData({
              isDoctor: '是'
            })
          } else if (isDoctor == "2") {
            that.setData({
              isDoctor: '否'
            })
          }
        }
      },
    })
  },

  plusXing: function (str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
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
  //修改
  editPerson: function () {
    wx.navigateTo({
      url: '../edithealthStatus/edithealthStatus?personid=' + this.data.personid
    })
  },
})