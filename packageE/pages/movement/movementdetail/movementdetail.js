// pages/electromechanical/movement/movementdetail/movementdetail.js
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
    planOutTime: null,
    planBackTime: null,
    goalAddress: null,
    reason: null,
    name: null,
    idNum: null,
    practicalOutTime: null,
    practicalBackTime: null,
    num: null,
    backLine: null,
    way: null,
    provePath: null,
    roamingPath: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var personid = options.personid;
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
    this.getPersondetail();
  },
  //获得行动轨迹的详情
  getPersondetail: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/" + data.personid + "/detail",
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
            planOutTime: datas.planOutTime,
            planBackTime: datas.planBackTime,
            goalAddress: datas.goalAddress,
            reason: datas.reason,
            name: datas.name,
            practicalOutTime: datas.practicalOutTime,
            practicalBackTime: datas.practicalBackTime,
            num: datas.num,
            backLine: datas.backLine,
            provePath: datas.billPath,
            roamingPath: datas.roamingPath,
            company: datas.companyId
          })
          var company = datas.company;
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            idNum: idNumfuzzy
          })
          //在职状态
          var way = datas.way;
          if (way == "1") {
            that.setData({
              way: '飞机'
            })
          }
          if (way == "2") {
            that.setData({
              way: '火车/高铁'
            })
          }
          if (way == "3") {
            that.setData({
              way: '客车'
            })
          }
          if (way == "4") {
            that.setData({
              way: '自驾'
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
      url: '../editmovement/editmovement?personid=' + this.data.personid
    })
  },
})