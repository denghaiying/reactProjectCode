import { FormInstance } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";


  export interface IUpload {
      disableUpload?: boolean;          // 是否禁用编辑
      disableBigUpload?: boolean;        // 是否禁用删除
      disableDown?: boolean;         // 是否使用索引列
      disableYwDown?: boolean;           // 是否使用新增
      disableViewDoc?: boolean;          // 右侧表格搜索框
      disableYwViewDoc?: boolean;           // 搜索字段
      disableIndexDoc?: boolean;                // 在新增或删除操作后，是否刷新左侧树
  }


