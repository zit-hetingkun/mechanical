// pages/tableanalysis/securitydetails/securitydetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    clicked:true,
    statisticsPersons:null,//头部数据
    roleId:null,
    userId:null,
    token:null,
    branchlist:null,
    linelist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var securitypersons=JSON.parse(options.data);
    var roleId=wx.getStorageSync('roleId');
    var userId=wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    that.setData({
      roleId:roleId,
      userId:userId,
      token:token,
      statisticsPersons:securitypersons
    })
    console.log(securitypersons);
    that.getDetails();
  },

  getDetails:function(){
    var that=this;
    var data=that.data;
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/security/statistics/more",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {           
             that.setData({
               branchlist:data.groupByBranchList
             }) 
          }
        }
      },
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
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 3
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  clickCompany:function(event){
    var cl=this.data.clicked;
    var id = event.currentTarget.dataset.id;
    var that=this;
    var data=that.data;
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/security/statistics/"+parseInt(id)+"/unfold",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data != null) {           
             that.setData({
              linelist:data.groupByLineList
             }) 
          }
        }
      },
    })
      this.setData({
        clicked:!cl
      })
  }
})