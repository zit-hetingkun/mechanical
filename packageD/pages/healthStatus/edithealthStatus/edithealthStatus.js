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
      name: '咳嗽'
    }, {
      id: '2',
      name: '发烧'
    }, {
      id: '3',
      name: '乏力'//不适症状
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
    age: null,
    name: null,
    result: null,
    provePath: null,
    idNum: null,
    personid: null,
    roleId: null,
    checkIdnum: null

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


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = this.data;
    var personid = options.personid;
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      personid: personid
    })
    that.getHealth();
  },

  //初始化获取数据
  getHealth: function () {
    var that = this;
    var data = that.data;
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
          //公司
          var company = datas.companyId;
          if (company == 1) {
            that.setData({
              companyed: 1,
              index7: 0
            })
          }
          if (company == 2) {
            that.setData({
              companyed: 2,
              index7: 1
            })
          }
          else if (company == 3) {
            that.setData({
              companyed: 3,
              index7: 2
            })
          } else if (company == 4) {
            that.setData({
              companyed: 4,
              index7: 3
            })
          }
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            checkIdnum: idNumfuzzy,
            idNum: idNum
          })

          //性别
          var gender = datas.gender;
          if (gender == "1") {
            that.setData({
              index1: 0,
              line: 1
            })
          } else {
            that.setData({
              index1: 1,
              line: 2
            })
          }
          //身体状况
          var body = datas.body;
          if (body == "1") {
            that.setData({
              index3: 0,
              way: 1
            })
          } else {
            that.setData({
              index3: 1,
              way: 2
            })
          }
          //不适症状
          if (datas.symptom == "1") {
            that.setData({
              manager: 1,
              index2: 0
            })
          } else if (datas.symptom == "2") {
            that.setData({
              manager: 2,
              index2: 1
            })
          } else if (datas.symptom == "3") {
            that.setData({
              manager: 3,
              index2: 2
            })
          } else {
            that.setData({
              manager: 4,
              index2: 3
            })
          }
          //确诊
          if (datas.isConfirm == "1") {
            that.setData({
              housecheck: 1,
              index4: 0
            })
          } else {
            that.setData({
              housecheck: 2,
              index4: 1
            })
          }
          //isTouch
          if (datas.isTouch == "1") {
            that.setData({
              touchcheck: 1,
              index5: 0
            })
          } else if (datas.isTouch == "2") {
            that.setData({
              touchcheck: 2,
              index5: 1
            })
          }
          var isDoctor = datas.isDoctor;
          if (isDoctor == "1") {
            that.setData({
              remedycheck: 1,
              index6: 0
            })
          } else {
            that.setData({
              remedycheck: 2,
              index6: 1
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


  //修改
  editHealth: function (e) {
    var that = this;
    var data = this.data;
    var editname = data.formData['editname'];
    var editidNum = data.formData['editidNum'];
    var editage = data.formData['editage'];
    var editresult = data.formData['editresult'];
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // if (editidNum != null) {
    //   if (!reg.test(editidNum)) {
    //     wx.showToast({
    //       title: '身份证号格式不正确',
    //       icon: 'none',
    //       duration: 1000
    //     });
    //     // return;
    //   }
    // }
    if (editname == "" || editname == undefined) {
      editname = data.name;
    }
    if (editidNum == "" || editidNum == undefined) {
      editidNum = data.idNum;
    }
    if (editage == "" || editage == undefined) {
      editage = data.age;
    }
    if (editresult == "" || editresult == undefined) {
      editresult = data.result;
    }
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/health/" + data.personid + "/wx";
    if (data.addImage == null) {
      wx.request({
        method: "POST",
        url: url,
        data:
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="name"' +
          '\r\n' +
          '\r\n' + editname +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="gender"' +
          '\r\n' +
          '\r\n' + data.line +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="idNum"' +
          '\r\n' +
          '\r\n' + editidNum +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="age"' +
          '\r\n' +
          '\r\n' + parseInt(editage) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="companyId"' +
          '\r\n' +
          '\r\n' + parseInt(data.companyed) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="body"' +
          '\r\n' +
          '\r\n' + parseInt(data.way) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="symptom"' +
          '\r\n' +
          '\r\n' + data.manager +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="isConfirm"' +
          '\r\n' +
          '\r\n' + data.housecheck +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="isTouch"' +
          '\r\n' +
          '\r\n' + data.touchcheck +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="isDoctor"' +
          '\r\n' +
          '\r\n' + data.remedycheck +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="result"' +
          '\r\n' +
          '\r\n' + editresult +
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
              title: '修改',
              icon: 'success',
              duration: 1000
            });
            wx.redirectTo({
              url: '../healthStatuslist/healthStatuslist',
            })
          }
        }
      })
    } else if (data.addImage != null) {
      //异常
      wx.uploadFile({
        url: url,
        filePath: data.addImage,
        name: 'prove',
        formData: {
          "id": parseInt(data.personid),
          "name": editname,
          "age": parseInt(editage),
          "result": editresult,
          "companyId": data.companyed,
          "body": data.way,
          "symptom": data.manager,
          "isConfirm": data.housecheck,
          "isTouch": data.touchcheck,
          "isDoctor": data.remedycheck,
          'idNum': editidNum,
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
              title: '修改成功',
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