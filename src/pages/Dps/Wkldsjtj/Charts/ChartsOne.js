const option = {
  title: {
    text: '工作量统计',
  },
  tooltip: {
    trigger: 'axis',
  },
  textStyle: {
    //全局设置文本样式
    fontSize: 20,
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      // dataZoom: {
      //   yAxisIndex: 'none'
      // },
      dataView: {
        show:false,
        readOnly: false,
        title: '数据视图',
        lang: { '0': '数据视图', '1': '关闭', '2': '刷新' },
        backgroundColor: '#fff',
        textColor: '#000',
        textareaColor: '#fff',
        textareaBorderColor: '#333',
        buttonColor: '#c23531',
        buttonTextColor: '#fff',
        itemSize: 20,
      },
      magicType: { type: ['line', 'bar'], title: { line: '切换为折线图', bar: '切换为柱状图' } },
      restore: {
        show: false,
        title: '刷新',
        icon: 'M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5',
      },
      saveAsImage: { title: '保存为图片' },
    },
    itemSize: 30,
    itemGap: 8,
  },
  xAxis: {
    type: 'category',
    name: '日期',
    nameTextStyle: {
      fontSize: 20,
    },
    boundaryGap: false,
    data: [
      // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      // 25, 26, 27, 28, 29, 30, 31,
    ],
  },
  yAxis: {
    name: '工作量',
    nameTextStyle: {
      fontSize: 20,
    },
    type: 'value',
    axisLabel: {
      formatter: '{value}',
    },
  },
  series: [
    {
      name: '工序1',
      type: 'line',
      data: [
        // 30, 31, 32, 32, 33, 31, 30, 29, 28, 27, 29, 25, 28, 29, 27, 28, 33, 32, 31, 30, 30, 26, 59,
        // 58, 57, 55,
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
      markLine: {
        precision: 0,
        data: [{ type: 'average', name: 'Avg' }],
      },
    },
    {
      name: '工序2',
      type: 'line',
      data: [
        // 40, 40, 40, 41, 42, 43, 44, 45, 46, 47, 49, 48, 46, 47, 46, 45, 42, 43, 41, 40, 41, 42, 42,
        // 43, 41, 44,
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
      markLine: {
        precision: 0,
        data: [{ type: 'average', name: 'Avg' }],
      },
    },
    {
      name: '工序3',
      type: 'line',
      data: [
        // 50, 51, 54, 55, 55, 56, 57, 53, 55, 50, 51, 54, 55, 55, 56, 57, 53, 55, 52, 53, 51, 50, 55,
        // 56, 52, 50,
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
      markLine: {
        precision: 0,
        data: [{ type: 'average', name: 'Avg' }],
      },
    },
    {
      name: '工序4',
      type: 'line',
      data: [
        // 60, 60, 60, 56, 65, 60, 66, 66, 67, 68, 69, 70, 60, 61, 62, 63, 64, 65, 66, 67, 63, 60,
        // 63, 65, 66, 67,
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
      markLine: {
        precision: 0,
        data: [{ type: 'average', name: 'Avg' }],
      },
    },
    {
      name: '工序5',
      type: 'line',
      data: [
        // 99, 86, 88, 89, 73, 89, 79, 99, 102, 105, 106, 99, 88, 77, 80, 86, 89, 72, 83, 86, 96, 84,
        // 92, 89, 83, 86,
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
      markLine: {
        precision: 0,
        data: [{ type: 'average', name: 'Avg' }],
      },
    },
  ],
};

export default option