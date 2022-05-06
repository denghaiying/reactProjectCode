/* eslint-disable prefer-template */
import { dynamic } from 'umi';
import { WindowsFilled } from '@ant-design/icons';
import { Drawer, Modal } from 'antd';
import { ReactNode } from 'react';
import EpsComponentLoader from '@/components/loader';

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

const ArchMenuAction = (props: EpsModalButtonProps) => {
  const { archStore, modalVisit, params } = props;

  const closeModal = () => {
    archStore.setModalVisit(false);
  };

  return (
    <Modal
      title={archStore.modalTitle}
      visible={modalVisit}
      width={archStore?.modalWidth}
      destroyOnClose
      afterClose={props.afterClose}
      closable={true}
      style={{
        maxHeight: archStore?.modalHeight,
        height: archStore?.modalHeight,
        ...props.modalStyles,
      }}
      footer={archStore.showFoot == true ? undefined : archStore.showFoot}
      onCancel={() => closeModal()}
      onOk={() => closeModal()}
    >
      <div
        style={{
          maxHeight: archStore?.modalHeight,
          height: archStore?.modalHeight,
        }}
      >
        {archStore.useIframe ? (
          <iframe
            id="iframe"
            width="100%"
            height="100%"
            name="auxLcsp"
            style={{
              width: '100%',
              height: '100%',
              border: 'solid 1px #f4f4f4',
            }}
            src={archStore.modalUrl}
          ></iframe>
        ) : (
          <EpsComponentLoader
            closeModal={closeModal}
            params={props.params}
            onClose={props.onClose}
            extendParams={props.extendParams}
            store={props.archStore}
            url={archStore.modalUrl}
            modalVisit={archStore.modalVisit}
          />
        )}
      </div>
    </Modal>
  );
};

export default ArchMenuAction;
