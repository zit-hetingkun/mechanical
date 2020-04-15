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
    addImages: null,//图片数组
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
    addId: null,//添加返回的id
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
    that.setData({
      token: wx.getStorageSync('token'),
      mechanicalUserId: wx.getStorageSync('mechanicalUserId'),
      roleId: wx.getStorageSync('roleId'),
      date: date,
      enddate: date,
      actualdate: date,
      actualdate2: date
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
    var name = data.formData['name'];
    var idNum = data.formData['idNum'];
    var goalAddress = data.formData['goalAddress'];
    var reason = data.formData['reason'];
    var num = data.formData['num'];
    var backLine = data.formData['backLine'];
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(idNum)) {
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
        duration: 1000
      });
      // return;
    }
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement";
    // wx.request({
    //   url: url,
    //   method: "POST",
    //   data:
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="company"' +
    //   '\r\n' +
    //   '\r\n' + parseInt(data.siteplace) +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="planOutTime"' +
    //   '\r\n' +
    //   '\r\n' + data.date +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="planBackTime"' +
    //   '\r\n' +
    //   '\r\n' + data.enddate +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="goalAddress"' +
    //   '\r\n' +
    //   '\r\n' + goalAddress +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="reason"' +
    //   '\r\n' +
    //   '\r\n' + reason +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="name"' +
    //   '\r\n' +
    //   '\r\n' + name +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="idNum"' +
    //   '\r\n' +
    //   '\r\n' + idNum +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="practicalOutTime"' +
    //   '\r\n' +
    //   '\r\n' + data.actualdate +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="practicalBackTime"' +
    //   '\r\n' +
    //   '\r\n' + data.actualdate2 +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="num"' +
    //   '\r\n' +
    //   '\r\n' + num +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="backLine"' +
    //   '\r\n' +
    //   '\r\n' + backLine +
    //   '\r\n--ABC' + '\r\nContent-Disposition: form-data; name="way"' +
    //   '\r\n' +
    //   '\r\n' + data.way +
    //   '\r\n--ABC--',
    //   header: {
    //     "Content-Type": "multipart/form-data;boundary=ABC",
    //      Authorization: data.token
    //   },
    //   success: function (res) {
    //     if (res.data.code == "200") {
    //       //获得添加的id
    //       var id=res.data.data;

    //       wx.showToast({
    //         title: '添加成功',
    //         icon: 'none'
    //       });

    //       // wx.navigateTo({
    //       //   url: '../movementlist/movementlist',
    //       // })        
    //     }else{
    //       wx.showToast({
    //         title: '服务器繁忙',
    //         icon: 'none'
    //       });
    //       wx.redirectTo({
    //         url: '../movementlist/movementlist',
    //       })
    //     }     
    //   },
    // })  
    wx.uploadFile({
      url: url,
      filePath: data.addImage,
      name: 'prove',//票据  
      formData: {
        "company": data.siteplace,
        "planOutTime": data.date,
        "planBackTime": data.enddate,
        "goalAddress": goalAddress,
        "reason": reason,
        "name": name,
        "idNum": idNum,
        "practicalOutTime": data.actualdate,
        "practicalBackTime": data.actualdate2,
        'num': num,
        'backLine': backLine,
        'way': data.way
      },
      header: {
        "Content-Type": "multipart/form-data",
        Authorization: data.token
      },
      success: function (res) {
        var code = res.statusCode;
        if (code == 200) {
          //获得id
          var result = res.data;
          var obj = JSON.parse(result);
          that.setData({
            addId: obj.data
          })
          // that.addImage2();
          // //请求成功
          // wx.showToast({
          //   title: '添加成功',
          //   icon: 'none',
          //   duration: 1000
          // });
          // //获得添加的
          // wx.redirectTo({
          //   url: '../movementlist/movementlist',
          // })
          var url2 = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/" + parseInt(data.addId) + "/wx";
          wx.uploadFile({
            url: url2,
            filePath: data.addImage2,
            name: 'roaming',//票据  
            formData: {
              'id': parseInt(data.addId),
              "company": data.siteplace,
              "planOutTime": data.date,
              "planBackTime": data.enddate,
              "goalAddress": goalAddress,
              "reason": reason,
              "name": name,
              "idNum": idNum,
              "practicalOutTime": data.actualdate,
              "practicalBackTime": data.actualdate2,
              'num': num,
              'backLine': backLine,
              'way': data.way
            },
            header: {
              "Content-Type": "multipart/form-data",
              Authorization: data.token
            },
            success: function (res) {
              var code = res.statusCode;
              if (code == 200) {
                // //请求成功
                wx.showToast({
                  title: '添加成功',
                  icon: 'none',
                  duration: 1000
                });
                //获得添加的
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
                success: function (res) {
                }
              })
              console.log(res);
            }
          });
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
      url: '../electroPersonlist/electroPersonlist',
    })
  },

  //添加漫游地
  addImage2: function () {
    var that = this;
    var data = that.data;
    var url = app.globalData.appHost + "/mechanical/" + data.mechanicalUserId + "/user/movement/" + parseInt(data.addId) + "/wx";
    wx.uploadFile({
      url: url,
      filePath: data.addImage2,
      name: 'roaming',//票据  
      // formData: {
      //   'id':parseInt(data.addId)
      // },
      header: {
        "Content-Type": "multipart/form-data",
        Authorization: data.token
      },
      success: function (res) {
        var code = res.statusCode;
        if (code == 200) {
          // //请求成功
          // wx.showToast({
          //   title: '添加成功',
          //   icon: 'none',
          //   duration: 1000
          // });
          // //获得添加的
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
          success: function (res) {
          }
        })
        console.log(res);
      }
    });

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