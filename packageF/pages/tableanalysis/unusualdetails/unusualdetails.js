// pages/tableanalysis/unusualdetails/unusualdetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temperatureHead:null,
    roleId:null,
    userId:null,
    token:null,
    temperature:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var temperatureHead=JSON.parse(options.data);
    var roleId=wx.getStorageSync('roleId');
    var userId=wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    that.setData({
      roleId:roleId,
      userId:userId,
      token:token,
      temperatureHead:temperatureHead
    })
    console.log(temperatureHead);
    that.getDetails();
  },
  getDetails:function(){
    var that=this;
    var data=that.data;
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/temperature/statistics/more",
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
            var templates = [];
            for (var idx in data) {
              var text = data[idx];
              var times=text.stationTemperatureTime;     
              var date= new Date(Date.parse(times.replace(/-/g,   "/"))); //转换成Data();    
              var month=date.getMonth()+1; //获取当前月份
              var day= date.getDate();
              var hours=date.getHours();       //获取当前小时数(0-23)  
              var minutes=date.getMinutes(); //分钟
              var time=month+"/"+day+""+hours+":"+minutes
              console.log(time);
              var tem = {
                name: text.name,
                profession: text.profession,
                stationTemperatureTime:time,
                stationTemperature: text.stationTemperature
              }
              templates.push(tem);
            }
            that.setData({
              temperature: templates
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

  }
})