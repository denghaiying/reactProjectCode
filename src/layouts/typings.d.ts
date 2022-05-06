// @ts-ignore
/* eslint-disable */

type locationType = {
  pathname?: string;
  query?: any;
};

type MenuNodeType = {
  layout: boolean;
  locale: boolean;
  name?: string;
  path?: string;
  key?: string;
  openlx?: string;
  closable?: boolean;
  query?: object;
};

type ArchTreeType = {
  bh?: string;
  dqzq?: number;
  dw?: string;
  edittype?: number;
  fid?: string;
  fjs?: number;
  id?: string;
  key?: string;
  label?: string;
  leaf?: boolean;
  lx?: string;
  bmc?: string;
  mc?: string;
  sl?: number;
  text?: string;
  title?: string;
  tms?: number;
  type?: string;
  whsj?: string;
  xh?: number;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  loaded?: boolean;
  loading?: boolean;
  halfChecked?: boolean;
  dragOver?: boolean;
  dragOverGapTop?: boolean;
  dragOverGapBottom?: boolean;
  pos?: string;
  active?: boolean;
  umid?: string;
  umname?: string;
};

type ArchParams = {
  bh?: string;
  dw?: string; //单位
  edittype?: number;
  fid?: string; //父档案库id
  fjs?: number;
  dakid?: string; //档案库id
  key?: string;
  lx?: string; //档案库类型
  bmc?: string; //表名
  mc?: string; //档案库名称
  text?: string;
  title?: string;
  tms?: number;
  type?: string;
  umid: string;
  path: string;
  umname: string;
  tmzt?: number;
};
