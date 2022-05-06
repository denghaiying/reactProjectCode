const option = {
  tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
      orient: 'vertical',
      left: 'left',
      data: ['已完成项目', '未完成项目']
  },
  series: [
      {
          name: '项目信息',
          type: 'pie',
          radius: '63%',
          center: ['50%', '55%'],
          data: [
              {value: 335, name: '婚姻登记档案'},
              {value: 310, name: '复退军人档案'},
          ],
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
};

export default option;
