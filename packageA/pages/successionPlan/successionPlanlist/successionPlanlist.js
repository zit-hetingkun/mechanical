// pages/successionPlan/successionPlanlist/successionPlanlist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    searchuserName: '',
    token: null,
    userId: null,
    total: null,
    //战区、中心
    centers: [{
      id: '1',
      name: '运一'
    }, {
      id: '2',
      name: '运二'
    }, {
      id: '3',
      name: '运三'
    }, {
      id: '4',
      name: '运四'
    }],
    //选中中心的id
    centerSelected: null,
    date: null,
    roleId: null,//角色id
    plans: [],//计划的列表
    listContent:null,//列表展示内容
  },


  //获得选中的中心
  bindPickerChange2: function (e) {
    var centers = this.data.centers;
    this.setData({
      index: e.detail.value
    })
    this.setData({
      userLearn: centers[e.detail.value]
    })
    this.centerSelected = centers[e.detail.value].id;
  },

  //搜索
  searchPlace: function () {
    var searchcenter = this.centerSelected;
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

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    var date = new Date().toLocaleDateString();
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId');
    if(userId==null){
        wx.navigateTo({
          url: '../../login/login',
        })
        return;
    }
    //获得角色id
    var roleId = wx.getStorageSync('roleId');
    this.setData({
      date: date,
      userId: userId,
      token: token,
      roleId: roleId
    })
    var count;
    //请求接口 先获得总条数
    var params = JSON.stringify({
      "pageSize": 10,
      "page": 1
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/temperatures",
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          var data = res.data.data;
          if(data==null){           
              that.setData({
                listContent:'暂无内容'
              })            
          }
          if (data != null) {
            count = data.total;
            if (count != null) {
              that.setData({
                total: count
              })
              that.getPlans(that.data.centerSelected);
            }
          }
        }else if(code=="401"){
          wx.navigateTo({
            url: '../../login/login',
          })
        }
      },
    })
  },
  //列表请求
  getPlans: function (centerSelected) {
    var that = this;
    var data = this.data;
    //总条数
    var count = data.total;
    //请求接口
    var params = JSON.stringify({
      "pageSize": count,
      "page": 1
      // "securityCompanyId": parseInt(centerSelected)
    });
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/scheduling/temperatures",
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
          var result = res.data.data.rows;
          that.setData({
            plans: result
          })        
        }
      },
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


  },
})

