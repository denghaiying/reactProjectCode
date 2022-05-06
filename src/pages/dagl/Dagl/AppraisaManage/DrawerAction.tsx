/* eslint-disable prefer-template */
import { dynamic } from 'umi';
import { WindowsFilled } from '@ant-design/icons';
import { Affix, Badge, Button, Drawer, Modal, Space } from 'antd';
import { ReactNode, useState } from 'react';
import EpsComponentLoader from '@/components/loader';
import style from '@/components/MyDrawer/index.less';
import settings from '@/styles/assets/img/float-settings-img.png';
import cancel from '@/styles/assets/img/float-cancel-img.png';

export interface EpsModalButtonProps {
  name: string; // 按钮文字
  // store?: EpsTableStore;          // tableStore
  title: ReactNode; // 对话框标题
  url?: string; // 组件的路由地址
  params?: ArchParams; // 页面参数，传递给url对应的组件
  hidden?: boolean; // 组件是否隐藏
  width?: number; // 弹框宽度
  height?: number; // 弹框高度
  useIframe?: boolean; // 使用iframe
  noFoot?: boolean; // 隐藏底部按钮区
  opt: OptType;
  optcode: string; // 菜单的optcode，菜单唯一编号，如DAK0010
  archStore?: ArchStoreType; // 菜单optid对应dakopt optid;
  modalVisit: boolean; // 弹窗显示隐藏
  beforeOpen?: (value: any) => boolean; // 打开窗口前判断
  //  onFinish?: (values, tableStore: EpsTableStore)=>Promise<void>  // 弹框确定按钮事件
}

const DrawerAction = (props: EpsModalButtonProps) => {
  const { archStore, params } = props;

  const closeDrawer = () => {
    props.colseDraw();
  };

  return (
    <>
      <div
        className={
          props.drawVisit
            ? `${style['imgs-url']} ${style['imgs-url-o']}`
            : `${style['imgs-url']}`
        }
        onClick={() => props.setDrawVisit(!props.drawVisit)}
      >
        <Badge offset={[-10]} count={props.count}>
          <img src={props.drawVisit ? cancel : settings} />
        </Badge>
      </div>

      <Drawer
        key={props.key || 'draw_dak'}
        mask={false}
        title={props.drawTitle}
        placement="right"
        onClose={() => closeDrawer()}
        width={props?.drawWidth}
        visible={props.drawVisit}
      >
        <>
          <EpsComponentLoader
            refreshPage={props.refreshPage}
            extendParams={props.drawExtendParams}
            url={props.drawUrl}
            doSubmit={props.doSubmit}
          />
        </>
      </Drawer>
    </>
  );
};

export default DrawerAction;
