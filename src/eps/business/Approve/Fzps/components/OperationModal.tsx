import type { FC } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { BasicListItemDataType } from '../data.d';
import styles from '../style.less';
import { Button, Result } from 'antd';
import SysStore from "@/stores/system/SysStore";

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  fid:string;
};

const OperationModal: FC<OperationModalProps> = (props) => {

  console.log("OperationModalprops=",props)
  const { done, visible, current, onDone, onSubmit, children,fid } = props;
  if (!visible) {
    return null;
  }
  return (
    <ModalForm<BasicListItemDataType>
      visible={visible}
      title={done ? null : `评审${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {

        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      {!done ? (
        <>
          <ProFormText
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
            placeholder="请输入"
          />
          <ProFormTextArea
            name="desc"
            label="说明"
            rules={[{ message: '请输入至少五个字符的评审说明！', min: 5 }]}
            placeholder="请输入至少五个字符"
          />
          <ProFormText
            name="whr"
            label="上传人员"
         //   rules={[{ required: true, message: '请输入任务名称' }]}
            placeholder="请输入"
            disabled
            initialValue={SysStore.getCurrentUser().yhmc}
          />
          <ProFormText
            name="fzpsid"
            label="fzpsid"
            rules={[{ required: true, message: '请输入' }]}
            placeholder="请输入"
            hidden
            initialValue={props.fid}
          />
          <ProFormText
            name="id"
            label="id"
            hidden
          />
          {/* <ProFormDateTimePicker
            name="whsj"
            label="审核时间"
            rules={[{ required: true, message: '请选择审核时间' }]}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            placeholder="请选择"
          /> */}
          {/*<ProFormSelect*/}
          {/*  name="owner"*/}
          {/*  label="任务负责人"*/}
          {/*  rules={[{ required: true, message: '请选择任务负责人' }]}*/}
          {/*  options={[*/}
          {/*    {*/}
          {/*      label: '付晓晓',*/}
          {/*      value: 'xiao',*/}
          {/*    },*/}
          {/*    {*/}
          {/*      label: '周毛毛',*/}
          {/*      value: 'mao',*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*  placeholder="请选择管理员"*/}
          {/*/>*/}

        </>
      ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="请上传文件。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};

export default OperationModal;
