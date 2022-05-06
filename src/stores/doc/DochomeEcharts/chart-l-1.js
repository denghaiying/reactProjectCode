
const option = {
  color: ['#FFC107', '#DC3545', '#007BFF'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    top: '26%',
    left: '60%',
    icon: 'circle',
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 20,
    textAlign: 'center',
    textStyle: {
      rich: {
        uname: {
          width: 70,
        },
        uvalue: {
          width: 40,
          align: 'right',
        },
      },
    },
    data: [
      '服务总量', '服务启用', '服务停用',
    ],
    formatter (name) {
      const data = [
        { value: 100, name: '服务总量' },
        { value: 80, name: '服务启用' },
        { value: 20, name: '服务停用' },
      ];
      let res = data.filter(v => v.name === name);
      res = res[0] || {};
      return `{uname|${name}}{uvalue|${res.value}}`;
    },
  },
  series: [
    {
      name: '文档服务启用情况',
      type: 'pie',
      center: ['25%', '35%'],
      radius: ['35%', '65%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 100, name: '服务总量' },
        { value: 80, name: '服务启用' },
        { value: 20, name: '服务停用' },
      ],
    },
  ],
};


export default option;
