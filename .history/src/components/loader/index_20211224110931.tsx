import React from 'react';
import { dynamic } from 'umi';

const getEpsComponent = (props) => {
  const EpsComponent = dynamic({
    async loader() {
      if (props.url === '/sys/params/systemConf') {
        const { default: Comp1 } = await import(
          '@/components/sys/params/systemConf'
        );
        return Comp1;
      }
      if (props.url === '/base/dak/referToDak') {
        const { default: Comp1 } = await import(
          '@/components/base/dak/referToDak'
        );
        return Comp1;
      }
      if (props.url === '/sys/params/functionConf') {
        const { default: Comp1 } = await import(
          '@/components/sys/params/functionConf'
        );
        return Comp1;
      }
      if (props.url === '/sys/params/roleConf') {
        const { default: Comp1 } = await import(
          '@/components/sys/params/roleConf'
        );
        return Comp1;
      }
      if (props.url === '/sys/params/roleFuntionConf') {
        const { default: Comp1 } = await import(
          '@/components/sys/params/roleFuntionConf'
        );
        return Comp1;
      }
      // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去

      // 加入协查单
      if (props.url === '/sys/dagl/addXcd') {
        const { default: Comp1 } = await import(
          '@/components/arch/Xcd/XcdList'
        );
        return Comp1;
      }
      // 利用实体借阅单
      if (props.url === '/sys/dagl/addStjyd') {
        const { default: Comp1 } = await import(
          '@/components/arch/Stjyd/StjydList'
        );
        return Comp1;
      }
      // 回收站
      if (props.url === '/sys/dagl/RecycleBin') {
        const { default: Comp1 } = await import(
          '@/components/arch/RecycleBin/RecycleBinView'
        );
        return Comp1;
      }
      // 档案整理
      if (props.url === '/sys/dagl/Dazl') {
        const { default: Comp1 } = await import(
          '@/components/arch/Dazl/DazlView'
        );
        return Comp1;
      }
      // 归属部门调整
      if (props.url === '/sys/dagl/ResetDagsbm') {
        const { default: Comp1 } = await import(
          '@/components/arch/ResetDagsbm/index'
        );
        return Comp1;
      }
      // 进馆移交
      if (props.url === '/sys/dagl/Jgyj') {
        const { default: Comp1 } = await import('@/pages/dagl/Gsyj/Zxyj');
        return Comp1;
      }
      //  // 组新卷
      //  if (props.url === "/sys/dagl/ResetDagsbm") {
      //   const { default: Comp1 } = await import("@/components/arch/ResetDagsbm/index");
      //   return Comp1;
      // }
      // SIP导入
      if (props.url === '/sys/dagl/importSIP') {
        const { default: Comp1 } = await import(
          '@/components/arch/ImportSIP/index'
        );
        return Comp1;
      }
      // EEP信息导入
      if (props.url === '/sys/dagl/importEEP') {
        const { default: Comp1 } = await import(
          '@/components/arch/ImportEEP/index'
        );
        return Comp1;
      }
      // 发布到门户
      if (props.url === '/sys/daby/Bykfdbmh') {
        const { default: Comp1 } = await import(
          '@/components/arch/Bykfdbmh/index'
        );
        return Comp1;
      }
      if (props.url === '/eps/business/Approve/SelectDialog') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/SelectDailog'
        );
        return Comp1;
      }
      // 离线导入eep
      if (props.url === '/eps/business/Approve/EepLxdr') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/EepLxdr'
        );
        return Comp1;
      }
      // 申请单
      if (props.url === '/eps/business/Approve/SelectDialogDiv') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/SelectDailogDiv'
        );
        return Comp1;
      }
      // 审批编辑界面
      if (props.url === '/sys/dagl/importSIP') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/ApproveEdit'
        );
        return Comp1;
      }

      // 编研档案库---文档
      if (props.url === '/sys/daby/ByContentDoc') {
        const { default: Comp1 } = await import(
          '@/components/arch/ByContentDoc/index'
        );
        return Comp1;
      }
      // 档案利用--档案指导
      if (props.url === '/sys/daly/Dazd') {
        const { default: Comp1 } = await import('@/components/arch/Dazd/index');
        return Comp1;
      }
      // 档案指导--提交档案指导
      if (props.url === '/sys/daly/Dazd12') {
        const { default: Comp1 } = await import(
          '@/components/arch/Dazd12/index'
        );
        return Comp1;
      }
      // 档案管理--组新郑
      if (props.url === '/sys/dagl/zxj') {
        const { default: Comp1 } = await import('@/components/arch/zxj');
        return Comp1;
      }


      // 进馆移交
      if (props.url === '/eps/business/Approve/SelectJgyjDailog') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/SelectJgyjDailog'
        );
        return Comp1;
      }
      // 移交
      if (props.url === 'dagl/Yjsp/SelectDailog') {
        const { default: Comp1 } = await import(
          '@/pages/dagl/Yjsp/SelectDailogVisiable'
        );
        return Comp1;
      }
      // 归档
      if (props.url === 'dagl/Dagd/SelectDailog') {
        debugger;
        const { default: Comp1 } = await import(
          '@/pages/dagl/Yjsp/SelectDailogVisiable'
        );
        return Comp1;
      }
      if (props.url === '/eps/business/Approve/SelectDailogPublish') {
        const { default: Comp1 } = await import(
          '@/eps/business/Approve/SelectDailogPublish'
        );
        return Comp1;
      }
      // 进馆移交
      if (props.url === 'eps/components/list/articles') {
        const { default: Comp1 } = await import(
          '@/eps/components/list/articles'
        );
        return Comp1;
      }
    },
  });
  return (
    <EpsComponent
      params={props.params}
      extendParams={props.extendParams}
      closeModal={props.closeModal}
      refreshPage={props.refreshPage}
      store={props.store}
      doSubmit={props.doSubmit}
    />
  );
};

function EpsComponentsLoader(props) {
  return <>{getEpsComponent(props)}</>;
}

export default EpsComponentsLoader;
