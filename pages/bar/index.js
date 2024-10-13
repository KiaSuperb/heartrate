import * as echarts from '../../ec-canvas/echarts';

var timeNum=[];
var valueNum=[];



Page({
  data: {
    ec: {
      lazyLoad:true
    }
  },
  onLoad: function(options){
    var that = this
    this.echarCanve = this.selectComponent('#mychart-dom-bar');
    //初始化曲线
    this.init_chart();
    this.getOption();
    //每隔?s刷新一次
    timer = setInterval(() => {
      this.getOptionNext();
    }, 1000)
  },
  //初始化图表数据
  getOption: function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/stressData/initData',
      method: 'GET',
      header:{
        //携带参数
      },
      data:{
        limit: 200
      },
      success: (res)=>{
        console.log("获取成功",res);
        that.setData({
          //将接口返回的数据data赋值给data
          data: res.data
        })
        for(var i=0; i<60; i++){
          timeNum[i]=res.data.data[i].time;
          valueNum[i]=res.data.data[i].value;
        }
        // 图表数据赋值
        if (that.chart) {
          that.line_set(that.chart, timeNum, valueNum);
        }
      },
    })
    
  },
  //后续每秒更新数组中的数据
  getOptionNext:function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/stressData/initData',
      method: 'GET',
      header:{
        //携带参数
      },
      data:{
        limit: 1
      },
      success: (res)=>{
        console.log("获取成功",res);
        that.setData({
          //将接口返回的数据data赋值给data
          data: res.data
        })
        
        for(var i = 0; i<1; i++){
          timeNum.shift();
          valueNum.shift();
          timeNum.push(res.data.data[i].time);
          valueNum.push(res.data.data[i].value);
        }
        // 图表数据赋值
        if (that.chart) {
          that.line_set(that.chart, timeNum, valueNum);
        }
      },
    })
  },
  //初始化图表
  init_chart: function(){
    this.echarCanve.init((canvas, width, height, dpr)=>{
      const chart = echarts.init(canvas,null,{
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      //console.log("init_chart",xdata,ydata)
      //line_set(chart,xdata,ydata);
      this.chart = chart;
      return chart;
    });
  },
  line_set: function(chart,xdata,ydata){
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
          interval:10, //如果设置为 1，表示隔一个标签显示一个标签
          rotate:50 //标签旋转
        },
        type: 'category',
        boundaryGap: false,
        data: xdata
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitNumber:3, //坐标轴分割段数
        splitLine:{
          lineStyle:{
            type: 'dashed'  //分割线类型(虚线）
          }
        }
      },
      series:[{
        name: '心率值',
        type: 'line',
        smooth: false,
        data: ydata,   //y轴上的动态数据
      }]
    };
    chart.setOption(option);
  },
});
