/* eslint-disable comma-dangle */
/**
 * @author caijc
 * Field组件不适用函数组件，目前是解决办法是对表单使用函数式进行代理
 */
// todo icefly框架Field组件不适用于函数式组件。后期@ice/form（https://www.npmjs.com/package/@ice/form）完善后可用该组件重构，目前功能太简单，暂不适用于生产环境
import React from "react";
import stores from "../../../stores/etl/etlStore";
import ArchiveInfoEdit from "./ArchiveInfoEdit";

/**
 * @param {*} props react props参数
 */
const ArchiveInfoEditProxy = props => {
  //  const etlStore = stores.useStore("etlStore");
    /* eslint-disable */
    const {editFieldValues} = stores;
    console.log("editFieldValues:");
    console.log(editFieldValues);
    return <ArchiveInfoEdit {...Object.assign(stores, props)} />;
};

export default ArchiveInfoEditProxy;
