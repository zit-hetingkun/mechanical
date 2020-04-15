// pages/electromechanical/electroPerson/electroPersondetail/electroPersondetail.js
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
    company: '',//公司
    gender: '',//性别
    name: '',//姓名
    idNum: '',//身份证号
    phone: '',//联系方式
    workingState: '',//在职状态
    photoPath: '',//照片
    workLicensePath: '',//上岗证
    age: null,//年龄
    category: null,
    project: '',
    registeredAddress: '',
    bjAddress: '',
    emergencyPerson: '',
    emergencyPhone: '',
    remark: '',
    status: null
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
  //获得用户的详情
  getPersondetail: function () {
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
            project: project,
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
              category: '生产'
            })
          } else if (category == "2") {
            that.setData({
              category: '管理'
            })
          }
          var gender = datas.gender;
          if (gender == "1") {
            that.setData({
              gender: '男'
            })
          } else {
            that.setData({
              gender: '女'
            })
          }
          var company = datas.companyId;
          if (company == 1) {
            that.setData({
              company: '外委单位一'
            })
          }
          if (company == 2) {
            that.setData({
              company: '外委单位二'
            })
          } else if (company == 3) {
            that.setData({
              company: '外委单位三'
            })
          } else if (company == 4) {
            that.setData({
              company: '外委单位四'
            })
          }
          var project = datas.projectOrg;
          if (project == 1) {
            that.setData({
              project: '项目部一'
            })
          }
          if (project == 2) {
            that.setData({
              project: '项目部二'
            })
          } else if (project == 3) {
            that.setData({
              project: '项目部三'
            })
          }
          //根据角色获得相应的状态
          //角色为3 外委
          if (roleId == 3) {
            that.setData({
              status: datas.outerStatus
            })
          }
          //角色为2项目
          if (roleId == 2) {
            that.setData({
              status: datas.projectStatus
            })
          }
          //角色为1安质
          if (roleId == 1) {
            that.setData({
              status: datas.securityStatus
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
      url: '../editelectroPerson/editelectroPerson?personid=' + this.data.personid
    })
  },
  //删除
  deletePerson: function () {
    var data = this.data;
    //请求接口
    var ids = [];
    ids.push(parseInt(data.personid));
    wx.showModal({
      title: '删除',
      content: '确定删除吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user",
            method: "DELETE",
            data: ids,
            header: {
              "Content-Type": "application/json",
              Authorization: data.token
            },
            success: function (res) {
              //获得数据
              var code = res.data.code;
              if (code == "200") {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                });
                wx.navigateTo({
                  url: '../electroPersonlist/electroPersonlist',
                })
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
  },
})