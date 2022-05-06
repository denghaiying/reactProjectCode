const option = {
  series: [
    {
      type: 'gauge',
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.3, '#fd666d'],
            [0.7, '#37a2da'],
            [1, '#67e0e3']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        distance: -20,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      splitLine: {
        distance: -20,
        length: 20,
        lineStyle: {
          color: '#fff',
          width: 4
        }
      },
      axisLabel: {
        color: 'auto',
        distance: 30,
        fontSize: 15
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} %',
        color: 'auto',
        textStyle:{
          fontSize: 15
        }
      },
      radius :"85%",
      center:['50%','45%'],
      data: [
        {
          value: 70,
          name: '满意度'
        }
      ]
    }
  ]
};

export default option;
