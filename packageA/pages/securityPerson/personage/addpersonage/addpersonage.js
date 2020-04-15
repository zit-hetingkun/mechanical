// pages/securityPerson/personage/addpersonage/addpersonage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectArray: [{
      id: '1',
      name: '男'
    }, {
      id: '2',
      name: '女'
    }], //性别
    sitePlaces: [], //安保公司
    lines: [], //分公司
    makes: [], //线别
    arrives: [], //站区/中心
    ways: [], //车站
    conditions: [{
      id: '1',
      name: '安检'
    }, {
      id: '2',
      name: '保安'
    }, {
      id: '3',
      name: '列乘'
    }], //专业
    classes: [{
      id: '1',
      name: '甲'
    }, {
      id: '2',
      name: '乙'
    }, {
      id: '3',
      name: '丙'
    }], //班次
    formData: {},
    token: null,
    userId: null,
    managers: [{
      id: '1',
      name: '在职'
    }, {
      id: '2',
      name: '离职'
    }], //在职状态
    gender: null, //选中的性别
    siteplace: null, //选中的安保公司
    line: null, //选中的分公司
    make: null, //选中的线别
    arrive: null, //选中中心
    way: null, //选中车站
    condition: null, //选中专业
    manager: null, //选中在职状态
    productInfo: {},
    addImage: null,//上传图片的路径
    roleId: null, //角色id
    classed: null
  },




  //下拉数据请求 性别
  bindPickerChange1: function (e) {
    var that = this;
    var data = that.data;
    var projectArray = data.projectArray;
    that.setData({
      index1: e.detail.value,
      userLearn: projectArray[e.detail.value],
      gender: projectArray[e.detail.value].id
    })
  },

  //分公司
  bindPickerChange2: function (e) {
    var that = this;
    var data = that.data;
    var lines = data.lines;
    that.setData({
      index2: e.detail.value,
      userLearn: lines[e.detail.value],
      line: lines[e.detail.value].id
    })
    //获得选中的分公司id
    //获得下一级数据 线别
    var line = data.line;
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/" + line + "/tree",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            makes: res.data.data
          })
        }
      },
    })
  },
  //安保公司
  bindPickerChange3: function (e) {
    var that = this;
    var data = that.data;
    var sitePlaces = data.sitePlaces;
    that.setData({
      index3: e.detail.value,
      userLearn: sitePlaces[e.detail.value],
      siteplace: sitePlaces[e.detail.value].id
    })
  },
  //线别
  bindPickerChange4: function (e) {
    var that = this;
    var data = that.data;
    var makes = this.data.makes;
    that.setData({
      index4: e.detail.value,
      userLearn: makes[e.detail.value],
      make: makes[e.detail.value].id
    })
    //获得下一级 站区、中心
    var make = data.make;
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/" + make + "/tree",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            arrives: res.data.data
          })
        }
      },
    })
  },
  //站区/中心
  bindPickerChange5: function (e) {
    var that = this;
    var data = that.data;
    var arrives = this.data.arrives;
    that.setData({
      index5: e.detail.value,
      userLearn: arrives[e.detail.value],
      arrive: arrives[e.detail.value].id
    })
    var arrive = data.arrive;
    //获得下一级 车站
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/" + arrive + "/tree",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            ways: res.data.data
          })
        }
      },
    })
  },
  //车站
  bindPickerChange6: function (e) {
    var that = this;
    var data = that.data;
    var ways = data.ways;
    that.setData({
      index6: e.detail.value,
      userLearn: ways[e.detail.value],
      way: ways[e.detail.value].id
    })
  },
  //专业
  bindPickerChange7: function (e) {
    var that = this;
    var data = that.data;
    var conditions = data.conditions;
    that.setData({
      index7: e.detail.value,
      userLearn: conditions[e.detail.value],
      condition: conditions[e.detail.value].id
    })
  },
  //在职状态
  bindPickerChange8: function (e) {
    var that = this;
    var data = that.data;
    var managers = data.managers;
    that.setData({
      index8: e.detail.value,
      userLearn: managers[e.detail.value],
      manager: managers[e.detail.value].id
    })
  },
  bindPickerChange9: function (e) {
    var that = this;
    var data = that.data;
    var classes = data.classes;
    that.setData({
      index9: e.detail.value,
      userLearn: classes[e.detail.value],
      classed: classes[e.detail.value].id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    that.setData({
      token: wx.getStorageSync('token'),
      userId: wx.getStorageSync('userId'),
      roleId: wx.getStorageSync('roleId')
    })
    //初始化获得最顶层数据 分公司
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/0/tree",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            lines: res.data.data
          })
        }
      },
    })
    //获得安保公司数据
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/common/menu/srcurityCompany",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      dataType: 'json',
      success: function (res) {
        //获得数据
        var code = res.data.code;
        if (code == "200") {
          that.setData({
            //设置数据
            sitePlaces: res.data.data
          })
        }
      },
    })
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

  //添加
  addPerson: function () {
    var that = this;
    var data = that.data;
    var userName = data.formData['userName'];
    var idNum = data.formData['idNum'];
    var qualificationNo = data.formData['qualificationNo'];
    var nativePlace = data.formData['nativePlace'];
    var phone = data.formData['phone'];
    var address = data.formData['address'];
    //添加校验
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(idNum)) {
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var url = app.globalData.appHost + "/security/" + data.userId + "/user";
    console.log('添加'+data.addImage);
    wx.uploadFile({
      url: url,
      filePath: data.addImage,
      name: 'photoFile',
      formData: {
        "operatingBranchCompanyId": parseInt(data.line),
        "securityCompanyId": parseInt(data.siteplace),
        "lineId": parseInt(data.make),
        "stationAreaId": parseInt(data.arrive),
        "stationId": parseInt(data.way),
        "userName": userName,
        "gender": data.gender,
        "idNum": idNum,
        "qualificationNo": qualificationNo,
        "nativePlace": nativePlace,
        "phone": phone,
        "address": address,
        "profession": data.condition,
        "workingState": data.manager,
        "subwayGroup": data.classed
      },
      header: {
        "Content-Type": "multipart/form-data",
        Authorization: data.token
      },
      success: function (res) {
        var code = res.statusCode;
        if (code == 200) {
          //请求成功
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000
          });
          wx.redirectTo({
            url: '../../securityPersonList/securityPersonlist',
          })
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    });
  },
  //取消
  cancel: function () {
    wx.navigateTo({
      url: '../../securityPersonList/securityPersonlist',
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
  //上传照片
  uploadImage: function (e) {
    var that = this;
    var data = that.data;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePathSize=res.tempFiles[0].size;
        if(tempFilePathSize<=2000000){
          //设置路径
          that.setData({
            addImage: res.tempFiles[0].path 
          })
            //启动上传等待中...
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 500
          })
        }
        else{    //图片大于2M，弹出一个提示框
          wx.showToast({
              title:'上传大小不能大于2M!',  //标题
              icon:'none'       //图标 none不使用图标，详情看官方文档
          })
      }  
    }    
      
    });
  },
  //添加的审核提交 4 6
  addCheck: function () {
    var data = this.data;
    //获得人员id
    var personid = event.currentTarget.dataset.personid;
    var ids = [];
    ids.push(parseInt(personid));
    wx.showModal({
      title: '提交添加',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/security/" + data.userId + "/common/1/change/2/1/status",
            method: "POST",
            data: JSON.stringify(ids),
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            dataType: 'json',
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '已通过',
                  icon: 'success',
                  duration: 1000
                });
              } else {
                wx.showToast({
                  title: '当前用户无权操作',
                  icon: 'none',
                  duration: 1000
                });
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})