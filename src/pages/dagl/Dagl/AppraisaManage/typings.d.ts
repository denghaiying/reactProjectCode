// @ts-ignore
/* eslint-disable */

type OptType = {
  whsj?: string;
  tmzt?: number;
  sort?: number;
  optlx?: number;
  optcode: string;
  name?: string;
  isadd?: string;
  icon?: string;
  fz?: string;
  fjs?: number;
  fid?: string;
  edittype?: number;
};

type KtableType = {
  id: string;
  fzmc?: string;
  bmc: string; //表名称
  mc: string; // 中文名称
  //tms;
  kpkd?: number; // 卡片宽度
  kpgd?: number; //卡片高度
  kpmhkjs?: number;
  daklx?: String;
  mbid?: String; // 模板id
  instdh?: String;
  dwmc?: string; // 单位名称
  sfdyw?: String; //是否多业务
  dywstfl?: String; //多业务分类
  lcqy?: String; // 流程启用
  dakwidth?: dakwidth;
  daheight?: daheight;
};

type UserInfoType = {
  id: String;
  bh: String;
  yhmc: String;
  dwid: String;
  golbalrole: String;
  bmid: String;
  bmmc: String;
};

type CmpInfoType = {
  id: String;
  dwbh: String;
  mc: String;
  dwname: String;
  qzh: String;
};

type ArchStoreType = {
  columns?: Array;
  // 主表档案库信息
  ktable?: KtableType;
  // 高级检索列
  advSearchColumns?: Array;
  // 点击的菜单action
  menuActionItem?: object;
  // 档案库opt
  dakopt: Array;
  // tmzt
  tmzt?: number;
  // 菜单按钮code
  optcode?: string;
  // 菜单按配置
  menuProp?: Array;
  // 已配置菜单按配置
  menuButton?: Array;
  // 获取档案按钮权限
  modalVisit?: boolean;
  // 档案库id
  dakid?: string;
  // 单位id
  dwid?: string;
  // 选中记录
  selectRecords: Array;
  // 弹出框宽度
  modalWidth?: number;
  // 弹出框高度
  modalHeight?: number;
  // 是否多业务
  sfdyw: boolean;
  // 实体分类id;
  stflid: string;
  //左边选择的数据
  tablekey: string;
  // 档案管理功能接收的参数
  archParams?: ArchParams;
  //当前用户
  currentUser: UserInfoType;

  queryDakopt: (value) => void;
  initArchInfo: (archParams: ArchParams, ktable: KtableType) => string;
  menuLoad: () => void;
};

type DakFormProps = {
  dakid: string;
  tmid?: string;
  tmzt?: string;
  ktable?: KtableType;
  kfields?: string;
};
