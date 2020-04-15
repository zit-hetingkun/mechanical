// pages/securityPerson/personage/personagedetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personid: null,//人员id
    roleId: null,//角色id
    token: null,//token
    userId: null,//用户id
    operatingBranchConpany: '',//运营分公司
    securityCompany: '',//安保公司
    line: '',//线别
    stationArea: '',//站区
    station: '',//车站
    gender: '',//性别
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
    status: null,//0库存1未提交2已提交3待审核4审核中5已通过6驳回7已拉黑'
    isTrain: '',//是否通过培训 1是2否
    flag: '',//1新增 2修改3删除
    subwayGroup: null//班组


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var personid = options.personid;
    var roleId = wx.getStorageSync('roleId');
    var userId = wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    this.setData({
      personid: personid,
      roleId: roleId,
      token: token,
      userId: userId
    })
    //调用详情的方法
    this.getPersondetail();
  },
  //获得安保用户的详情
  getPersondetail: function () {
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    //用户为8级用户
    if (roleId == 8) {
      data.personid = data.userId;
    }
    //如果用户为最底层 进来就直接是详情的页面 personid传userid
    wx.request({
      url: app.globalData.appHost + "/security/" + data.userId + "/user/" + data.personid + "/userDetail",
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
            operatingBranchConpany: datas.operatingBranchName,
            securityCompany: datas.securityCompanyName,
            line: datas.lineName,
            stationArea: datas.stationAreaName,
            station: datas.stationName,
            userName: datas.name,
            qualificationNo: datas.qualificationNo,
            address: datas.address,
            nativePlace: datas.nativePlace,
            phone: datas.phone,
            photoPath: datas.photoPath,
            workLicensePath: datas.workLicensePath,
            remark: datas.remark
          })
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            idNum: idNumfuzzy
          })
          //在职状态
          var workingState = datas.workingState;
          if (workingState == "1") {
            that.setData({
              workingState: '在职'
            })
          } else {
            that.setData({
              workingState: '离职'
            })
          }
          //专业
          if (datas.profession == "1") {
            that.setData({
              profession: '安检'
            })
          } else if (datas.profession == "2") {
            that.setData({
              profession: '保安'
            })
          } else {
            that.setData({
              profession: '列乘'
            })
          }
          //性别
          if (datas.gender == "1") {
            that.setData({
              gender: '男'
            })
          } else {
            that.setData({
              gender: '女'
            })
          }
          //班组subwayGroup
          if (datas.subwayGroup == "1") {
            that.setData({
              subwayGroup: '甲'
            })
          } else if (datas.subwayGroup == "2") {
            that.setData({
              subwayGroup: '乙'
            })
          } else if (datas.subwayGroup == "3"){
            that.setData({
              subwayGroup: '丙'
            })
          }
          var isTrain = datas.isTrain;
          if (isTrain == "1") {
            that.setData({
              isTrain: '是'
            })
          } else {
            that.setData({
              isTrain: '否'
            })
          }
          //根据角色获得相应的状态
          //角色为5 车站
          if (roleId == 5) {
            that.setData({
              status: datas.stationStatus
            })
          }
          //角色为4站区
          if (roleId == 4) {
            that.setData({
              status: datas.stationAreaStatus
            })
          }
          //当前的审核状态
          that.setData({
            flag: datas.flag
          })
        }else if(code=="401"){
          wx.navigateTo({
            url: '../../login/login',
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
  //编辑提交
  addPerson: function () {
    var data = this.data;
    var that = this;
    var personid = data.personid;
    var ids = [];
    ids.push(parseInt(personid));
    var params = JSON.stringify({ "module": "1", "operation": "2", "status": "2", "flag": "2", "ids": ids });
    wx.showModal({
      title: '提交',
      content: '确定提交吗',
      showCancel: true,
      confirmColor: '#405f80',
      cancelColor: '#333',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.appHost + "/security/" + data.userId + "/common/change/status",
            method: "POST",
            data: params,
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
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                });
                if (data.roleId != 8) {
                  wx.navigateTo({
                    url: '../../securityPersonList/securityPersonlist',
                  })
                } else {
                  wx.switchTab({
                    url: '../../../index/index',
                  })
                }
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
  //修改
  editPerson: function () {
    wx.navigateTo({
      url: '../editpersonage/editpersonage?personid=' + this.data.personid
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
            url: app.globalData.appHost + "/security/" + data.userId + "/user",
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
                  url: '../../securityPersonList/securityPersonlist',
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