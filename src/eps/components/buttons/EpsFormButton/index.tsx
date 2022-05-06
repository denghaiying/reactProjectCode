import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Tooltip, Modal, Form } from 'antd';
import { AlignCenterOutlined, UnderlineOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel2';
import { ButtonType } from 'antd/lib/button';
import EpsForm from '../../form/EpsForm';


export interface EpsFormButtonProps {
    name: string;              // 按钮文字
    store?: EpsTableStore;          // tableStore
    title: ReactNode;              // 对话框标题
    type?: ButtonType;                //按钮类型
    data?: object;                // 业务数据
    icon?: React.ReactNode;       // 按钮图标，一般为antd的icon
    isIcon?: boolean;             // 是否是图标按钮
    hidden?: boolean;             // 组件是否隐藏
    width?: number;               // 弹框宽度
    height?: number;              // 弹框高度
    useIframe?: boolean;         // 使用iframe
    noFoot?: boolean;             // 隐藏底部按钮区
    beforeOpen?: (value) => boolean;   // 打开窗口前判断
    onFinish?: (values, tableStore: EpsTableStore)=>Promise<void>  // 弹框确定按钮事件
}

// 正则规则   (/./xxx/xx/):xx

function EpsFormButton(props: EpsFormButtonProps) {

  const [modalVisit, setModalVisit] = useState(false);
  const [width, setWidth] = useState(0);

  const [modalHeight, setModalHeight] = useState(0);

  const [form]= Form.useForm()

  useEffect(() => {
    setWidth(props.width || 800)
    setModalHeight(window.innerHeight - 300)
  }, [])

    
  return (
    <>
      {!props.isIcon ? 
        <Button
          type={props.type || 'primary'}
          icon={props.icon  || <AlignCenterOutlined />}
          style={{display: props.hidden ? 'none': ''}}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation()
            e.stopPropagation()
            form.setFieldsValue(props.data);
            setModalVisit(true);
          }}
        > 
          {props.name}
        </Button> :
        <Tooltip title={props.name}>
          <Button size="small" style={{fontSize: '12px',display: props.hidden ? 'none': ''}} type={props.type || 'primary'} shape="circle" icon={props.icon || <AlignCenterOutlined />} onClick={() => {
            form.setFieldsValue(props.data);
            if(props.beforeOpen){
                setModalVisit(props.beforeOpen(props.data));
            }else{
              setModalVisit(true);
            }}}/>
        </Tooltip>
        }
         <Modal
            title= {props.title}
            visible={modalVisit}
            width={width}
            closable={!!props.noFoot}
            style={{maxHeight: (props.height || modalHeight) + 'px', height: (props.height || modalHeight) + 'px'}}
            footer={props.noFoot && null}
            onCancel={() => setModalVisit(false)}
            onOk={() => setModalVisit(false)}
        >
          <EpsForm source={source} detailVisible={visible} form={form} data={formData} customForm={props.customForm}></EpsForm>
      </Modal> 
    </>
  );
}

export default EpsFormButton;
