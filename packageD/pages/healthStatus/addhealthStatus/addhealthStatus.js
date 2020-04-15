// pages/isolatedPersonnel/Personnel/addPersonnel/addPersonnel.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lines: [{
      id: '1',
      name: '男'
    }, {
      id: '2',
      name: '女'
    }
    ], //性别 
    ways: [{
      id: '1',
      name: '良好'
    }, {
      id: '2',
      name: '异常'
    }], //身体状况
    formData: {},
    token: null,
    mechanicalUserId: null,
    managers: [{
      id: '1',
      name: '乏力'
    }, {
      id: '2',
      name: '胸闷'
    }, {
      id: '3',
      name: '干咳'//不适症状
    }, {
      id: 4,
      name: '发烧'
    }], //返京计划
    line: null, //选中的性别
    way: null, //选中身体状况
    manager: null, //选中不适症状
    houses: [{
      id: '1',
      name: '是'
    }, {
      id: '2',
      name: '否'
    }],//小区
    housecheck: null,//选中的小区
    touches: [{
      id: '1',
      name: '是'
    }, {
      id: '2',
      name: '否'
    }],//接触
    touchcheck: null,//选中的接触
    remedy: [{
      id: '1',
      name: '是'
    }, {
      id: '2',
      name: '否'
    }],//是否就医
    remedycheck: null,//选中就医
    addImage: null,//上传的照片
    companys: [{
      id: 1,
      name: '外委单位一'
    },
    {
      id: 2,
      name: '外委单位二'
    },
    {
      id: 3,
      name: '外委单位三'
    },
    {
      id: 4,
      name: '外委单位四'
    }
    ],//公司
    companyed: null,//选中的公司

  },

  //下拉数据请求 性别
  bindPickerChange1: function (e) {
    var lines = this.data.lines;
    this.setData({
      index1: e.detail.value,
      userLearn: lines[e.detail.value],
      line: lines[e.detail.value].id
    })
  },
  //不适症状
  bindPickerChange2: function (e) {
    var managers = this.data.managers;
    this.setData({
      index2: e.detail.value,
      userLearn: managers[e.detail.value],
      manager: managers[e.detail.value].id
    })
  },
  //身体状况
  bindPickerChange3: function (e) {
    var ways = this.data.ways;
    this.setData({
      index3: e.detail.value,
      userLearn: ways[e.detail.value],
      way: ways[e.detail.value].id
    })
  },
  //现小区
  bindPickerChange4: function (e) {
    var houses = this.data.houses;
    this.setData({
      index4: e.detail.value,
      userLearn: houses[e.detail.value],
      housecheck: houses[e.detail.value].id
    })
  },
  //接触
  bindPickerChange5: function (e) {
    var touches = this.data.touches;
    this.setData({
      index5: e.detail.value,
      userLearn: touches[e.detail.value],
      touchcheck: touches[e.detail.value].id
    })
  },
  //就医
  bindPickerChange6: function (e) {
    var remedy = this.data.remedy;
    this.setData({
      index6: e.detail.value,
      userLearn: remedy[e.detail.value],
      remedycheck: remedy[e.detail.value].id
    })
  },


  //公司
  bindPickerChange7: function (e) {
    var that = this;
    var data = that.data;
    var companys = data.companys;
    that.setData({
      index7: e.detail.value,
      userLearn: companys[e.detail.value],
      companyed: companys[e.detail.value].id
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = this.data;
    var date = new Date().toLocaleDateString();
    this.setData({
      backdate: date,
      startdate: date,
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      enddate: date
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
  addPersonal: function (e) {
    var that = this;
    var data = this.data;
    var name = data.formData['name'];
    var idNum = data.formData['idNum'];
    var age = data.formData['age'];
    var result = data.formData['result'];
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health";
    //良好
    if (data.way == 2) {
      wx.request({
        method: "POST",
        url: url,
        data:
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="name"' +
          '\r\n' +
          '\r\n' + name +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="gender"' +
          '\r\n' +
          '\r\n' + data.line +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="idNum"' +
          '\r\n' +
          '\r\n' + idNum +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="age"' +
          '\r\n' +
          '\r\n' + parseInt(age) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="companyId"' +
          '\r\n' +
          '\r\n' + parseInt(data.companyed) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="body"' +
          '\r\n' +
          '\r\n' + parseInt(data.way) +
          '\r\n--ABC--',
        header: {
          "Content-Type": "multipart/form-data;boundary=ABC",
          Authorization: data.token
        },
        success: function (res) {
          var code = res.data.code;
          if (code == 200) {
            //请求成功
            wx.showToast({
              title: '添加',
              icon: 'success',
              duration: 1000
            });
            wx.redirectTo({
              url: '../healthStatuslist/healthStatuslist',
            })
          }
        }
      })
    } else {
      //异常
      wx.uploadFile({
        url: url,
        filePath: data.addImage,
        name: 'prove',
        formData: {
          "name": name,
          "age": parseInt(age),
          "result": result,
          "companyId": parseInt(data.companyed),
          "body": data.way,
          "symptom": data.manager,
          "isConfirm": data.housecheck,
          "isTouch": data.touchcheck,
          "isDoctor": data.remedycheck,
          'idNum': idNum,
          'gender': data.line
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
              url: '../healthStatuslist/healthStatuslist',
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
    }
  },
  //取消
  cencal: function () {
    wx.showToast({
      title: '已取消',
      icon: 'success',
      duration: 1000
    });
    wx.redirectTo({
      url: '../healthStatuslist/healthStatuslist',
    })
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
        var tempFilePathSize = res.tempFiles[0].size;
        if (tempFilePathSize <= 2000000) {
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
        else {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传大小不能大于2M!',  //标题
            icon: 'none'       //图标 none不使用图标，详情看官方文档
          })
        }
      }

    });
  },
})