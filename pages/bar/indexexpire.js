//引入echarts文件
import * as echarts from '../../ec-canvas/echarts';

//给option 赋值
function line_set(chart,xdata,ydata){
  var option = {
    title: {
      text: '折线图',
      left: 'center'
    },
    legend: { //图例组件
      data: ['心率值'],
      top: '20%',
      left: 'center',
      backgroundColor: 'pink',
      textStyle: {
        color: 'black'
      }
    },
    tooltip: {  //提示框组件
      show: true,
      tigger: 'axis'
    }, 
    xAxis: {
      name: '时间',
      axisLabel: {
        intervat:0, //如果设置为 1，表示隔一个标签显示一个标签
        rotate:50 //标签旋转
      },
      type: 'time',
      boundaryGap: false,
      data: xdata
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitNumber:8, //坐标轴分割段数
      splitLine:{
        lineStyle:{
          type: 'dashed'  //分割线类型(虚线）
        }
      }
    },
    series:[{
      name: '心率值',
      tpye: 'line',
      smooth: false,
      data: ydata,
    }]
  }
}

Page({
  //页面初始数据
  data: {
    ec:{
      lazyLoad:true
    },
  },
  //初始化图表
  init_chart: function(xdata,ydata){
    this.oneComponent.init((canvas, width, height, dpr)=>{
      const chart = echarts.init(canvas,null,{
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      line_set(chart,xdata,ydata)
      this.chart = chart;
      return chart;
    });
  },
  //请求获取数据
  getOption: function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/stressData/initData',
      method: 'GET',
      header:{
        //携带参数
      },
      data:{
        limit: 60
      },
      success: (res)=>{
        console.log("获取成功",res);
        that.setData({
          //将接口返回的数据data赋值给data
          data: res.data
        })
        var i
        var timeNum=[];
        var valueNum=[];
        for(i=0; i<60; i++){
          timeNum[i]=res.data.data[i].time;
          valueNum[i]=res.data.data[i].value;
        }
        //图表数据赋值
        that.init_chart(timeNum,valueNum)
      },
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function(options){
    var that = this;
    that.oneComponent = that.selectComponent('#mychart-dom-bar');
    that.getOption();
    that.setData({
      timer: setInterval(function(){
        that.getOption();
      },15000)
    })
  }
})