const option = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['文书档案', '文书档案', '实物档案', '声像档案', '婚姻档案'],
  },
  series: [
    {
      name: '档案种类',
      type: 'pie',
      radius: '63%',
      center: ['50%', '55%'],
      data: [
        { value: 0, name: '文书档案' },
        { value: 0, name: '会计档案' },
        { value: 0, name: '实物档案' },
        { value: 0, name: '声像档案' },
        { value: 0, name: '婚姻档案' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

export default option;
