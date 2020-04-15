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
    sitePlaces: [
      {
        id: '1',
        name: '项目部一'
      },
      {
        id: '2',
        name: '项目部二'
      },
      {
        id: '3',
        name: '项目部三'
      }
    ], //选中所属项目部, //所属项目部
    lines: [{
      id: '1',
      name: '生产'
    }, {
      id: '2',
      name: '管理'
    }], //人员类别
    formData: {},
    token: null,
    mechanicalUserId: null,
    gender: null, //选中的性别
    siteplace: null, //选中所属项目部
    line: null, //选中的人员类别
    roleId: null, //角色id
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
    name: '',//姓名
    idNum: '',//身份证号
    phone: '',//联系方式
    photoPath: '',//照片
    workLicensePath: '',//上岗证
    age: null,//年龄
    registeredAddress: '',
    bjAddress: '',
    emergencyPerson: '',
    emergencyPhone: '',
    personid: null,//人员id
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

  //人员类别
  bindPickerChange2: function (e) {
    var that = this;
    var data = that.data;
    var lines = data.lines;
    that.setData({
      index2: e.detail.value,
      userLearn: lines[e.detail.value],
      line: lines[e.detail.value].id
    })
  },
  //所属项目部
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
  //公司
  bindPickerChange4: function (e) {
    var that = this;
    var data = that.data;
    var companys = data.companys;
    that.setData({
      index4: e.detail.value,
      userLearn: companys[e.detail.value],
      companyed: companys[e.detail.value].id
    })

  },
  onShow: function () {
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      roleId: wx.getStorageSync('roleId')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    var personid = options.personid;
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      roleId: wx.getStorageSync('roleId'),
      personid: personid
    })
    that.personDetail();
    // //获得所属项目部数据
    // wx.request({
    //   url: app.globalData.appHost + "/security/" + data.mechanicalUserId + "/common/menu/srcurityCompany",
    //   method: "GET",
    //   header: {
    //     "Content-Type": "application/json",
    //     Authorization: data.token
    //   },
    //   dataType: 'json',
    //   success: function (res) {
    //     //获得数据
    //     var code = res.data.code;
    //     if (code == "200") {
    //       that.setData({
    //         //设置数据
    //         sitePlaces: res.data.data
    //       })
    //     }
    //   },
    // })
  },
  //初始化数据
  personDetail: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/" + data.personid + "/userDetail",
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
            name: datas.name,
            age: datas.age,
            phone: datas.phone,
            // company: datas.company,
            // project: datas.project,
            registeredAddress: datas.registeredAddress,
            bjAddress: datas.bjAddress,
            emergencyPerson: datas.emergencyPerson,
            emergencyPhone: datas.emergencyPhone,
            workLicensePath: datas.workLicensePath,
            remark: datas.remark
          })
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            idNum: idNumfuzzy
          })
          //人员类别
          var category = datas.category;
          if (category == "1") {
            that.setData({
              index2: 0,
              line: 1
            })
          } else {
            that.setData({
              index2: 1,
              line: 2
            })
          }
          var gender = datas.gender;
          if (gender == "1") {
            that.setData({
              index1: 0,
              gender: 1

            })
          } else {
            that.setData({
              index1: 1,
              gender: 2
            })
          }
          //公司
          var company = datas.companyId;
          if (company == 1) {
            that.setData({
              index4: 0,
              companyed: 1

            })
          } else if (company == 2) {
            that.setData({
              index4: 1,
              companyed: 2
            })
          } else if (company == 3) {
            that.setData({
              index4: 2,
              companyed: 3
            })
          }
          else if (company == 4) {
            that.setData({
              index4: 3,
              companyed: 4
            })
          }
          //项目部
          var project = datas.projectOrg;
          if (project == "1") {
            that.setData({
              index3: 0,
              siteplace: 1

            })
          } else if (project == "2") {
            that.setData({
              index3: 1,
              siteplace: 2
            })
          } else {
            that.setData({
              index3: 2,
              siteplace: 3
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
  editPerson: function () {
    var that = this;
    var data = that.data;
    var editname = data.formData['editname'];
    var editidNum = data.formData['editidNum'];
    var editage = data.formData['editage'];
    var editregisteredAddress = data.formData['editregisteredAddress'];
    var editbjAddress = data.formData['editbjAddress'];
    var editphone = data.formData['editphone'];
    var editemergencyPerson = data.formData['editemergencyPerson'];
    var editemergencyPhone = data.formData['editemergencyPhone'];

    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (editidNum != '') {
      if (!reg.test(editidNum)) {
        wx.showToast({
          title: '身份证号格式不正确',
          icon: 'none',
          duration: 1000
        });
        // return;
      }
    }
    if (editphone != '') {
      //添加校验
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(editphone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        });
        // return;
      }
    }
    if (editemergencyPhone != '') {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(editemergencyPhone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        });
        // return;
      }
    }

    if (editname == "" || editname == undefined) {
      editname = data.name;
    }
    if (editidNum == "" || editidNum == undefined) {
      editidNum = data.idNum;
    }
    if (editage == "" || editage == undefined) {
      editage = data.age;
    }
    if (editregisteredAddress == "" || editregisteredAddress == undefined) {
      editregisteredAddress = data.registeredAddress;
    }
    if (editbjAddress == "" || editbjAddress == undefined) {
      editbjAddress = data.bjAddress;
    }
    if (editphone == "" || editphone == undefined) {
      editphone = data.phone;
    }
    if (editemergencyPerson == "" || editemergencyPerson == undefined) {
      editemergencyPerson = data.emergencyPerson;
    }
    if (editemergencyPhone == "" || editemergencyPhone == undefined) {
      editemergencyPhone = data.emergencyPhone;
    }



    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user";
    var params = JSON.stringify({
      'id': parseInt(data.personid),
      'name': editname,
      'age': parseInt(editage),
      'idNum': editidNum,
      'gender': data.gender,
      'phone': editphone,
      "category": data.line,
      "companyId": data.companyed,
      "projectOrg": data.siteplace,
      'registeredAddress': editregisteredAddress,
      'bjAddress': editbjAddress,
      'emergencyPerson': editemergencyPerson,
      'emergencyPhone': editemergencyPhone
    })
    wx.request({
      url: url,
      method: "PUT",
      data: params,
      header: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      success: function (res) {
        if (res.data.code == "200") {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          });
          wx.redirectTo({
            url: '../electroPersonlist/electroPersonlist',
          })
        } else {
          // wx.showToast({
          //   title: '服务器繁忙',
          //   icon: 'none'
          // });
          wx.redirectTo({
            url: '../electroPersonlist/electroPersonlist',
          })

        }
      },
    })
  },
  //取消
  cancel: function () {
    wx.navigateTo({
      url: '../electroPersonlist/electroPersonlist',
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
})