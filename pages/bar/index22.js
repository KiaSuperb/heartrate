//引入echarts文件
import * as echarts from '../../ec-canvas/echarts';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec:{
      lazyLoad:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    this.echarCanve = this.selectComponent('#mychart-dom-bar');
    this.init();
  },
  init: function(){
    this.echarCanve.init((canvas,width,height,dpr)=>{
      const chart = echarts.init(canvas,null,{
        width:width,
        height:height,
        devicePixelRatio: dpr
      });
      chart.setOption(this.getOption());
      return chart;
    })
  },
  getOption:function(){
    var option={
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    }
    return option;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

})