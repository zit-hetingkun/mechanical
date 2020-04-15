// pages/electromechanical/movement/addmovement/addmovement.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sitePlaces: [{
      id: '1',
      name: '公司一'
    }, {
      id: '2',
      name: '公司二'
    }], //所属公司
    formData: {},
    token: null,
    mechanicalUserId: null,
    siteplace: null, //选中公司
    roleId: null, //角色id
    date: null,//时间
    enddate: null,//结束时间
    actualdate: null,//实际出京日期
    actualdate2: null,//实际返京日期
    addImage: null,//票据
    addImage2: null,//漫游地
    ways: [{
      id: '1',
      name: '飞机'
    }, {
      id: '2',
      name: '火车/高铁'
    },
    {
      id: '3',
      name: '客车'
    }, {
      id: '4',
      name: '自驾'
    }], //所属公司
    way: null,
    goalAddress: null,
    reason: null,
    name: null,
    idNum: null,
    checkidNum: null,
    num: null,
    backLine: null,
    provePath: null,
    roamingPath: null,
    personid: null
  },
  //所属公司
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
  bindPickerChange2: function (e) {
    var that = this;
    var data = that.data;
    var ways = data.ways;
    that.setData({
      index2: e.detail.value,
      userLearn: ways[e.detail.value],
      way: ways[e.detail.value].id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    var data = that.data;
    var date = new Date().toLocaleDateString();
    var personid = options.personid;
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      roleId: wx.getStorageSync('roleId'),
      personid: personid
    })
    //获得所属项目部数据
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
    that.getMovement();
  },
  //初始
  getMovement: function () {
    var that = this;
    var data = that.data;
    var that = this;
    var data = that.data;
    var roleId = data.roleId;
    wx.request({
      url: app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/" + data.personid + "/detail",
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
            provePath: datas.provePath,
            goalAddress: datas.goalAddress,
            reason: datas.reason,
            num: datas.num,
            backLine: datas.backLine,
            roamingPath: datas.roamingPath
          })
          //公司
          var company = datas.companyId;
          if (company == 1) {
            that.setData({
              siteplace: 1,
              index3: 0
            })
          }
          if (company == 2) {
            that.setData({
              siteplace: 2,
              index3: 1
            })
          }
          else if (company == 3) {
            that.setData({
              siteplace: 3,
              index3: 2
            })
          }
          else if (company == 4) {
            that.setData({
              siteplace: 4,
              index3: 3
            })
          }
          //身份证号进行模糊显示
          var idNum = datas.idNum;
          var idNumfuzzy = that.plusXing(idNum, 3, 2);
          that.setData({
            checkIdnum: idNumfuzzy,
            idNum: idNum,
          })
          //出京日期
          var planOutTime = datas.planOutTime;
          that.setData({
            date: planOutTime
          })
          var planBackTime = datas.planBackTime;
          that.setData({
            enddate: planBackTime
          })
          var practicalOutTime = datas.practicalOutTime;
          that.setData({
            actualdate: practicalOutTime
          })
          var practicalBackTime = datas.practicalBackTime;
          that.setData({
            actualdate2: practicalBackTime
          })
          var way = datas.way;
          if (way == '1') {
            that.setData({
              way: 1,
              index2: 0
            })
          } else if (way == '2') {
            that.setData({
              way: 2,
              index2: 1
            })
          } else if (way == '3') {
            that.setData({
              way: 3,
              index2: 2
            })
          } else if (way == '4') {
            that.setData({
              way: 4,
              index2: 3
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
  addPerson: function () {
    var that = this;
    var data = that.data;
    var editname = data.formData['editname'];
    var editidNum = data.formData['editidNum'];
    var editgoalAddress = data.formData['editgoalAddress'];
    var editreason = data.formData['editreason'];
    var editnum = data.formData['editnum'];
    var editbackLine = data.formData['editbackLine'];
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
    if (editname == "" || editname == undefined) {
      editname = data.name;
    }
    if (editidNum == "" || editidNum == undefined) {
      editidNum = data.idNum;
    }
    if (editgoalAddress == "" || editgoalAddress == undefined) {
      editgoalAddress = data.goalAddress;
    }

    if (editreason == "" || editreason == undefined) {
      editreason = data.reason;
    }

    if (editnum == "" || editnum == undefined) {
      editnum = data.num;
    }

    if (editbackLine == "" || editbackLine == undefined) {
      editbackLine = data.backLine;
    }
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/" + parseInt(data.personid) + "/wx";
    //不修改图片
    if (data.addImage == null && data.addImage2 == null) {
      wx.request({
        url: url,
        method: "post",
        data:
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="company"' +
          '\r\n' +
          '\r\n' + parseInt(data.siteplace) +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="planOutTime"' +
          '\r\n' +
          '\r\n' + data.date +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="planBackTime"' +
          '\r\n' +
          '\r\n' + data.enddate +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="goalAddress"' +
          '\r\n' +
          '\r\n' + editgoalAddress +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="reason"' +
          '\r\n' +
          '\r\n' + editreason +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="name"' +
          '\r\n' +
          '\r\n' + editname +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="idNum"' +
          '\r\n' +
          '\r\n' + editidNum +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="practicalOutTime"' +
          '\r\n' +
          '\r\n' + data.actualdate +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="practicalBackTime"' +
          '\r\n' +
          '\r\n' + data.actualdate2 +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="num"' +
          '\r\n' +
          '\r\n' + editnum +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="backLine"' +
          '\r\n' +
          '\r\n' + editbackLine +
          '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="way"' +
          '\r\n' +
          '\r\n' + data.way +
          '\r\n--ABC--',
        header: {
          "Content-Type": "multipart/form-data;boundary=ABC",
          Authorization: data.token
        },
        success: function (res) {
          if (res.data.code == "200") {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            });
            wx.redirectTo({
              url: '../movementlist/movementlist',
            })
          } else {
            // wx.showToast({
            //   title: '服务器繁忙',
            //   icon: 'none'
            // });
            wx.redirectTo({
              url: '../movementlist/movementlist',
            })
          }
        },
      })
    }
    else if (data.addImage != null && data.addImage2 == null) { //修改票据
      wx.uploadFile({
        url: url,
        filePath: data.addImage,
        name: 'prove',//票据  roaming漫游地
        formData: {
          "company": data.siteplace,
          "planOutTime": data.date,
          "planBackTime": data.enddate,
          "goalAddress": editgoalAddress,
          "reason": editreason,
          "name": editname,
          "idNum": editidNum,
          "practicalOutTime": data.actualdate,
          "practicalBackTime": data.actualdate2,
          'num': editnum,
          'backLine': editbackLine,
          'way': data.way,
          'id': parseInt(data.personid)
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
              url: '../movementlist/movementlist',
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
    } else if (data.addImage == null && data.addImage2 != null) { //修改漫游地记录
      wx.uploadFile({
        url: url,
        filePath: data.addImage2,
        name: 'roaming',// roaming漫游地
        formData: {
          "company": data.siteplace,
          "planOutTime": data.date,
          "planBackTime": data.enddate,
          "goalAddress": editgoalAddress,
          "reason": editreason,
          "name": editname,
          "idNum": editidNum,
          "practicalOutTime": data.actualdate,
          "practicalBackTime": data.actualdate2,
          'num': editnum,
          'backLine': editbackLine,
          'way': data.way,
          'id': parseInt(data.personid)
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
              url: '../movementlist/movementlist',
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
    //两张都修改
    else if (data.addImage != null && data.addImage2 != null) {
      //修改漫游地记录
      wx.uploadFile({
        url: url,
        filePath: data.addImage2,
        name: 'roaming',//票据  roaming漫游地
        formData: {
          "company": data.siteplace,
          "planOutTime": data.date,
          "planBackTime": data.enddate,
          "goalAddress": editgoalAddress,
          "reason": editreason,
          "name": editname,
          "idNum": editidNum,
          "practicalOutTime": data.actualdate,
          "practicalBackTime": data.actualdate2,
          'num': editnum,
          'backLine': editbackLine,
          'way': data.way,
          'id': parseInt(data.personid)
        },
        header: {
          "Content-Type": "multipart/form-data",
          Authorization: data.token
        },
        success: function (res) {
          var code = res.statusCode;
          if (code == 200) {
            //请求成功
            // wx.showToast({
            //   title: '修改成功',
            //   icon: 'none',
            //   duration: 1000
            // });
            // wx.redirectTo({
            //   url: '../movementlist/movementlist',
            // })
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
      //修改记录
      wx.uploadFile({
        url: url,
        filePath: data.addImage,
        name: 'prove',
        header: {
          "Content-Type": "multipart/form-data",
          Authorization: data.token
        },
        formData: {
          "company": data.siteplace,
          "planOutTime": data.date,
          "planBackTime": data.enddate,
          "goalAddress": editgoalAddress,
          "reason": editreason,
          "name": editname,
          "idNum": editidNum,
          "practicalOutTime": data.actualdate,
          "practicalBackTime": data.actualdate2,
          'num': editnum,
          'backLine': editbackLine,
          'way': data.way,
          'id': parseInt(data.personid)
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
              url: '../movementlist/movementlist',
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
    wx.redirectTo({
      url: '../movementlist/movementlist',
    })
  },
  //取消
  cancel: function () {
    wx.redirectTo({
      url: '../movementlist/movementlist',
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
  //结束时间 
  _bindDateChange1: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      enddate: olddata2
    });
  },
  get bindDateChange1() {
    return this._bindDateChange1;
  },
  set bindDateChange1(value) {
    this._bindDateChange1 = value;
  },


  //开始时间
  _bindDateChange: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      date: olddata2
    });
  },
  get bindDateChange() {
    return this._bindDateChange;
  },
  set bindDateChange(value) {
    this._bindDateChange = value;
  },
  //实际出京时间 actualdate
  _bindDateChange2: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      actualdate: olddata2
    });
  },
  get bindDateChange2() {
    return this._bindDateChange2;
  },
  set bindDateChange2(value) {
    this._bindDateChange2 = value;
  },
  //返京
  _bindDateChange3: function (e) {
    var olddata = e.detail.value;
    let olddata2 = olddata.replace(/-/g, '/');
    this.setData({
      actualdate2: olddata2
    });
  },
  get bindDateChange3() {
    return this._bindDateChange3;
  },
  set bindDateChange3(value) {
    this._bindDateChange3 = value;
  },

  //上传票据
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
  //上传漫游地
  uploadImage2: function (e) {
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
            addImage2: res.tempFiles[0].path
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