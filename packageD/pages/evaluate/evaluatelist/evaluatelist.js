// pages/electromechanical/evaluate/evaluatelist/evaluatelist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    checkstatus: [{
      id: '1',
      name: '车站一'
    }, {
      id: '2',
      name: '车站二'
    }, {
      id: '3',
      name: '车站三'
    }], //施工车站
    checkstatused: null,//选中的施工车站
    listContent: null,
    persons: null,
    company: null,
    name: null,
    idNum: null,
    projectOrg: null,
    serviceProjectOrg: null,
    mechanicalUserId: null,
    token: null
  },
  //获得施工车站
  bindPickerChange2: function (e) {
    var checkstatus = this.data.checkstatus;
    this.setData({
      index: e.detail.value,
      userLearn: checkstatus[e.detail.value]
    })
    this.checkstatused = checkstatus[e.detail.value].id;
    this.crewScheduling(this.checkstatused);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = that.data;
    var mechanicalUserId = wx.getStorageSync('mechanicalUserId');
    var token = wx.getStorageSync('token');
    that.setData({
      mechanicalUserId: mechanicalUserId,
      token: token
    })
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/schedulings",
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        var data = res.data.data;
        if (code == "200") {
          if (data == null) {
            that.setData({
              listContent: '暂无内容'
            })
          }
          if (data != null) {
            count = data.total;
            if (count != null) {
              that.setData({
                total: count
              })
              that.crewScheduling(that.checkstatused);
            }
          }
        } else if (code == "401") {
          wx.navigateTo({
            url: '../../login/login',
          })
        }
      },
    })

  },
  //列表数据
  crewScheduling: function (checkstatused) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    if (parseInt(data.currentTab) == 0) {
      var params = JSON.stringify({
        "pageSize": count,
        "page": 1,
        "station": parseInt(checkstatused),
        "time": '1'
      });
    }
    else if (data.currentTab == 1) {
      var params = JSON.stringify({
        "pageSize": count,
        "page": 1,
        "station": parseInt(checkstatused),
        "time": '2'
      });
    } else {
      var params = JSON.stringify({
        "pageSize": count,
        "page": 1,
        "station": parseInt(checkstatused),
        "time": '3'
      });
    }
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/scheduling/schedulings",
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        //列表数据      
        if (code == "200") {
          var result = res.data.data;
          if (result != null) {
            that.setData({
              persons: result.rows
            })
          }
          // var persons = [];
          // for (var idx in result) {
          //   var text = result[idx];
          //   var idNum = text.idNum;
          //   // var idNumfuzzy = that.plusXing(idNum, 3, 2);
          //   var tem = {
          //     company: text.company,
          //     name: text.name,
          //     projectOrg: text.projectOrg,
          //     serviceProjectOrg: text.serviceProjectOrg,
          //     idNum:text.idNum
          //   }
          //   persons.push(tem);
          // }
          // that.setData({
          //   persons: persons
          // })          
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
  //  tab切换逻辑
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.crewScheduling(that.data.checkstatused);
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