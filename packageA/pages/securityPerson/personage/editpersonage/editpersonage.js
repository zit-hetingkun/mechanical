const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    personid: null,//修改的用户id
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
    //详情展示
    operatingBranchConpany: '',//运营分公司
    securityCompany: '',//安保公司
    stationArea: '',//站区
    station: '',//车站
    userName: '',//姓名
    idNum: '',//身份证号
    qualificationNo: '',//资格证件号
    address: '',//暂住地
    nativePlace: '',//籍贯
    phone: '',//联系方式
    workingState: '',//在职状态
    profession: '',//专业 专业1安检2保安3列乘
    photoPath: '',//照片
    workLicensePath: '',//上岗证
    remark: '',//备注
    status: '',//0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
    isTrain: '',//是否通过培训 1是2否
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
    classed: null
  },

  //班组
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
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    var personid = options.personid;
    this.setData({
      personid: parseInt(personid)
    })
    that.setData({
      token: wx.getStorageSync('token'),
      userId: wx.getStorageSync('userId'),
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
    //调用详情的接口
    this.getPersondetail();
  },
  //获得安保用户的详情
  getPersondetail: function () {
    var that = this;
    var data = that.data;
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/" + data.personid + "/userDetail";
    //如果用户为最底层 进来就直接是详情的页面 personid传啥
    wx.request({
      url: url,
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
          //分公司
          var lines = data.lines;
          var index = datas.operatingBranchId - 1;
          that.setData({
            index2: index,
            userLearn: lines[index]
          })
          data.line = datas.operatingBranchId;
          //安保公司
          var sitePlaces = data.sitePlaces;
          var index2 = datas.securityCompanyId - 1;
          that.setData({
            index3: index2,
            userLearn: sitePlaces[index2]
          })
          data.siteplace = datas.securityCompanyId;
          //线别
          that.setData({
            makes: [{ id: datas.lineId, name: datas.lineName }]
          })
          that.setData({
            index4: 0
          })
          data.make = datas.lineId;
          //站区
          that.setData({
            arrives: [{ id: datas.stationAreaId, name: datas.stationAreaName }],
            index5: 0
          })
          data.arrive = datas.stationAreaId;
          //车站
          that.setData({
            ways: [{ id: datas.stationId, name: datas.stationName }],
            index6: 0
          })
          data.way = datas.stationId;
          //专业
          var profession = datas.profession;
          if (profession == "1") {
            that.setData({
              index7: 0,
              condition: '1'
            })
          }
          if (profession == "2") {
            that.setData({
              index7: 1,
              condition: '2'
            })
          }
          if (profession == "3") {
            that.setData({
              index7: 2,
              condition: '3'
            })
          }
          //在职状态
          var workingState = datas.workingState;
          if (workingState == "1") {
            that.setData({
              index8: 0,
              manager: '1'
            })
          } else {
            that.setData({
              index8: 1,
              manager: '2'
            })
          }
          //性别
          var gender = datas.gender;
          if (datas.gender == '1') {
            that.setData({
              index1: 0
            })
          }
          if (datas.gender == '2') {
            that.setData({
              index1: 1
            })
          }
          that.setData({
            gender: datas.gender
          })
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            idNum: idNumfuzzy,
            userName: datas.name,
            qualificationNo: datas.qualificationNo,
            address: datas.address,
            nativePlace: datas.nativePlace,
            phone: datas.phone,
            photoPath: datas.photoPath,
            workLicensePath: datas.workLicensePath,
            remark: datas.remark,
            status: datas.status,
            isTrain: datas.isTrain
          })
          var subwayGroup = datas.subwayGroup;
          if (subwayGroup == '1') {
            that.setData({
              index9: 0,
              classed:1
            })
          }

          if (subwayGroup == '2') {
            that.setData({
              index9: 1,
              classed:2
            })
          } else if(subwayGroup == '3'){
            that.setData({
              index9: 2,
              classed:3
            })
          }
          that.setData({
            classed: datas.subwayGroup
          })
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



  //取消
  cancel: function () {
    wx.redirectTo({
      url: '../../securityPersonList/securityPersonlist',
    })
  },
  formReset: function () {
    wx.redirectTo({
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
  //选择图片
  uploadImage: function (e) {
    var that = this;
    var data = that.data;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
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
        }else{    //图片大于2M，弹出一个提示框
          wx.showToast({
              title:'上传大小不能大于2M!',  //标题
              icon:'none'       //图标 none不使用图标，详情看官方文档
          })
      }      
      }
    });
  },
  //修改表单
  formSubmit: function (e) {
    var data = this.data;
    var userName = e.detail.value.userName;
    var id = e.detail.value.id;
    var companyId = e.detail.value.companyId;
    var securityId = e.detail.value.securityId;
    var lineId = parseInt(data.line);
    var centerId = e.detail.value.centerId;
    var gender = e.detail.value.gender;
    var nativePlace = e.detail.value.nativePlace;
    var phone = e.detail.value.phone;
    var professionId = e.detail.value.professionId;
    var qualificationNo = e.detail.value.qualificationNo;
    var stationId = e.detail.value.stationId;
    var subwayId = parseInt(data.classed);
    var updateidNum = e.detail.value.updateidNum;
    var workState = e.detail.value.workState;
    var address = e.detail.value.address;
    var addImage = data.addImage;
    if (userName == "") {
      userName = data.userName;
    }   
    //校验
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;    
    if(updateidNum!=''){
      if (!reg.test(updateidNum)) {
        wx.showToast({
          title: '身份证号格式不正确',
          icon: 'none',
          duration: 1000
        });
        return;
      }
    }
    if (updateidNum == "") {
      updateidNum = data.idNum;
    }
    if (qualificationNo == "") {
      qualificationNo = data.qualificationNo;
    }
    if (nativePlace == "") {
      nativePlace = data.nativePlace
    }
    if (phone == "") {
      phone = data.phone;
    }
    if (address == "") {
      address = data.address;
    }

    //添加校验
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    }
   
    var url = app.globalData.appHost + "/security/" + data.userId + "/user/update";
    if (addImage == null) {
      wx.request({
        method: "POST",
        url: url,
        data:
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="id"' +
          '\r\n' +
          '\r\n' + parseInt(id) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="operatingBranchCompanyId"' +
          '\r\n' +
          '\r\n' + companyId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="securityCompanyId"' +
          '\r\n' +
          '\r\n' + securityId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="lineId"' +
          '\r\n' +
          '\r\n' + lineId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="stationAreaId"' +
          '\r\n' +
          '\r\n' + centerId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="stationId"' +
          '\r\n' +
          '\r\n' + stationId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="userName"' +
          '\r\n' +
          '\r\n' + userName +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="gender"' +
          '\r\n' +
          '\r\n' + gender +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="idNum"' +
          '\r\n' +
          '\r\n' + updateidNum +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="qualificationNo"' +
          '\r\n' +
          '\r\n' + qualificationNo +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="nativePlace"' +
          '\r\n' +
          '\r\n' + nativePlace +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="phone"' +
          '\r\n' +
          '\r\n' + phone +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="address"' +
          '\r\n' +
          '\r\n' + address +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="profession"' +
          '\r\n' +
          '\r\n' + professionId +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="workingState"' +
          '\r\n' +
          '\r\n' + workState +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="photoFile"' +
          '\r\n' +
          '\r\n' + addImage +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="subwayGroup"' +
          '\r\n' +
          '\r\n' + subwayId +
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
              title: '已修改',
              icon: 'success',
              duration: 1000
            });
            wx.redirectTo({
              url: '../../securityPersonList/securityPersonlist',
            })
          }
        }
      })
    }
    else {
      wx.uploadFile({
        url: url,
        filePath: data.addImage,
        name: 'photoFile',
        formData: {
          'id': parseInt(id),
          'operatingBranchCompanyId': companyId,
          'securityCompanyId': securityId,
          'lineId': lineId,
          'stationAreaId': centerId,
          'stationId': stationId,
          'userName': userName,
          'gender': gender,
          'idNum': updateidNum,
          'qualificationNo': qualificationNo,
          'nativePlace': nativePlace,
          'phone': phone,
          'address': address,
          'profession': professionId,
          'workingState': workState,
          'subwayGroup': subwayId
        },
        header: {
          "Content-Type": "multipart/form-data",
          Authorization: data.token
        },
        success: function (res) {
          var code = res.statusCode;
          if (code == 200) {
            //请求成功
            wx.showModal({
              title: '成功',
              content: '修改成功',
              showCancel: false
            })
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
    }
  }
})