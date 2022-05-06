import { FileProtectOutlined, FolderOpenOutlined } from '@ant-design/icons';

// 档案库基础配置

const ArchCommon = {
  DAJD0006: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行销毁',
    //  确认框内容
    popContentText: '请确认是否执行销毁?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0005: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行生成档号',
    //  确认框内容
    popContentText: '请确认是否执行生成档号?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0006: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行清除档号',
    //  确认框内容
    popContentText: '请确认是否执行清除档号?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0003: {
    // 是否启动选中判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行取消归档',
    //  确认框内容
    popContentText: '请确认是否执行取消归档?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0009: {
    // 是否启动选中判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
  },
  DAK0058: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行综合排序',
    //  确认框内容
    popContentText: '请确认是否执行综合排序?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0054: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行取消装盒',
    //  确认框内容
    popContentText: '请确认是否执行取消装盒?',

    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0056: {
    // 是否开启选择判断
    selectRowsCheck: false,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行实时批量导出',
    //  确认框内容
    popContentText:
      '如未选择条目，则导出该档案库所有条目，请确认是否执行实时批量导出?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0016: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行定时AIP导出',
    //  确认框内容
    popContentText: '请确认是否执行定时AIP导出?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0133: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行AIP导出',
    //  确认框内容
    popContentText: '请确认是否执行AIP导出?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0020: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行公式计算',
    //  确认框内容
    popContentText: '请确认是否执行公式计算?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0065: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行档案审核',
    //  确认框内容
    popContentText: '请确认是否执行档案审核?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0130: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行流程状态退回',
    //  确认框内容
    popContentText: '请确认是否执行流程状态退回?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0027: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行撤件',
    //  确认框内容
    popContentText: '请确认是否执行撤件?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0059: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认按模板刷新',
    //  确认框内容
    popContentText: '请确认是否按模板刷新?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0060: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认按综合排序刷新',
    //  确认框内容
    popContentText: '请确认是否按综合排序刷新?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0038: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行页数转页次',
    //  确认框内容
    popContentText: '请确认是否执行页数转页次?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0039: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行页次转页数',
    //  确认框内容
    popContentText: '请确认是否执行页次转页数?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0001: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行归档',
    //  确认框内容
    popContentText: '请确认是否执行归档?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0002: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行取消归档',
    //  确认框内容
    popContentText: '请确认是否执行取消归档',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0004: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行退回收集',
    //  确认框内容
    popContentText: '请确认是否执行退回收集?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0113: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行查看无原文',
    //  确认框内容
    popContentText: '请确认是否执行查看无原文?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0084: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认加入借阅车',
    //  确认框内容
    popContentText: '请确认是否加入借阅车?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0086: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认加入我的收藏',
    //  确认框内容
    popContentText: '请确认是否加入我的收藏?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0051: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行原文批量导出',
    //  确认框内容
    popContentText: '请确认是否执行原文批量导出?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0067: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行批量组卷',
    //  确认框内容
    popContentText: '请确认是否执行批量组卷?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAK0015: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行拆卷',
    //  确认框内容
    popContentText:
      '拆卷后案卷信息不会被删除,卷内条目将进入未整理文件库中,是否继续?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
  DAKBTN01: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: false,
    // 确认框标题
    popTitle: '确认执行拆卷',
    //  确认框内容
    popContentText:
      '拆卷后案卷信息不会被删除,卷内条目将进入未整理文件库中,是否继续?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
    // 图标
    icon: <FolderOpenOutlined />,
  },
  DAKBTN02: {
    // 是否开启选择判断
    selectRowsCheck: true,
    // 开启多选 true false或者空为单选
    selectMulitMode: true,
    // 提示信息
    selectRowsCheckWarMessage: '请选择条目信息',
    // 显示确认框
    showPopconfirm: false,
    // 确认框标题
    popTitle: '确认执行拆卷',
    //  确认框内容
    popContentText:
      '拆卷后案卷信息不会被删除,卷内条目将进入未整理文件库中,是否继续?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
    // 图标
    icon: <FileProtectOutlined />,
  },
  // DAK0146: {
  //   // 显示确认框
  //   showPopconfirm: true,
  //   // 确认框标题
  //   popTitle: '提升期限',
  //   //  确认框内容
  //   popContentText:
  //     '将对所选条目进行提升保管期限操作，提升保管期限将覆盖原保管期限，是否继续?',
  //   // 确认按钮显示，非必须 默认为确认
  //   okText: '确认',
  //   // 取消按钮显示，非必须 默认为取消
  //   cancelText: '取消',
  // },
  DAK0121: {
    // 显示确认框
    showPopconfirm: true,
    // 确认框标题
    popTitle: '确认执行查空卷',
    //  确认框内容
    popContentText: '请确认是否执行查空卷?',
    // 确认按钮显示，非必须 默认为确认
    okText: '确认',
    // 取消按钮显示，非必须 默认为取消
    cancelText: '取消',
  },
};

export default ArchCommon;
