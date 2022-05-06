import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import { AlignCenterOutlined, UnderlineOutlined } from '@ant-design/icons';
import { EpsTableStore } from '../../panel/EpsPanel2';
import { ButtonType } from 'antd/lib/button';

import './index.less';
import EpsComponentLoader from '@/components/loader';
import qs from 'qs';

export interface ModalFormProps {
  width?: number // 正则规则   (/./xxx/xx/):xx
}

const getUrl = (url:string = '' ) =>{
  return `/#/runRfunc${url}`
}
export interface EpsModalButtonProps {
    name: string;              // 按钮文字
    store?: EpsTableStore;          // tableStore
    title: ReactNode;              // 对话框标题
    url?: string;                // 组件的路由地址
    type?: ButtonType;                // 按钮类型
    icon?: React.ReactNode;       // 按钮图标，一般为antd的icon
    isIcon?: boolean;             // 是否是图标按钮
    params?: object;              // 页面参数，传递给url对应的组件
    hidden?: boolean;             // 组件是否隐藏
    width?: number;               // 弹框宽度
    height?: number;              // 弹框高度
    useIframe?: boolean;         // 使用iframe
    noFoot?: boolean;             // 隐藏底部按钮区
    beforeOpen?: (value) => boolean;   // 打开窗口前判断
    onFinish?: (values, tableStore: EpsTableStore)=>Promise<void>  // 弹框确定按钮事件
}



// 正则规则   (/./xxx/xx/):xx

function EpsModalButton(props: EpsModalButtonProps) {

  const [modalVisit, setModalVisit] = useState(false);
  const [width, setWidth] = useState(0);


  const [params, setParams]= useState({});
  const [modalHeight, setModalHeight] = useState(0);

  // eslint-disable-next-line no-nested-ternary
  const url = props.useIframe ? (props.params ? (`${props.url  }?${  qs.stringify(props.params)}`) : props.url) : `@/components/${props.url}`;

  const ComponentsMap={
    "/sys/params/systemConf":`@/components/sys/params/systemConf`
  }



  const closeModal = (value) => {
    setModalVisit(value)
  }

  useEffect(() => {
    setWidth(props.width || 800)
    params['modalVisit'] = modalVisit
    // setParams(params)
    setModalHeight(window.innerHeight - 300)
    return () => {
      setParams({})
    }
  }, [])


  useEffect(() => {
    setParams(props.params)
  }, [props.params])


  return (
    <>
      {!props.isIcon ?
        <Button
          type={props.type || 'primary'}
          icon={props.icon  || <AlignCenterOutlined />}
          style={{display: props.hidden ? 'none': ''}}
          onClick={(e) => {
            // e.nativeEvent.stopImmediatePropagation()
            // if(props.url && !props.useIframe){
            //   const Component = dynamic({
            //     async loader () {
            //       // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
            //       const { default: Comp1 } = await import(url);
            //       return Comp1;
            //     },
            //   })
            //   setComp(Component)
            // }
            if(props.beforeOpen){
              debugger
                setModalVisit(props.beforeOpen(props.params));
            }else{
              debugger
              setModalVisit(false);
            }
          }}
        >
          {props.name}
        </Button> :
        <Tooltip title={props.name}>
          <Button size="small" style={{fontSize: '12px',display: props.hidden ? 'none': ''}} type={props.type || 'primary'} shape="circle" icon={props.icon || <AlignCenterOutlined />} onClick={() => {
            // if(props.url && !props.useIframe){
            //   const Component = dynamic({
            //     async loader () {
            //       // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
            //       const { default: Comp1 } = await import(url);
            //       return Comp1;
            //     },
            //   })
            //   setComp(Component)
            // }
            console.log('eps modal button click ')
            if(props.beforeOpen){
                setModalVisit(props.beforeOpen(props.params));
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
        <div style={{maxHeight:  (props.height || modalHeight) + 'px', height: ( props.height || modalHeight) + 'px', width: (width - 48) + 'px'}}>{props.useIframe ? <iframe id="auxLcsp" name="auxLcsp" style={{width:(props.width || width )-48, height: (props.height || modalHeight) + 'px',border:"solid 1px #f4f4f4"}}
            src={url} ></iframe> :<EpsComponentLoader params={params} store={props.store} url={props.url} modalVisit={modalVisit}/>}</div>
      </Modal>
    </>
  );
}

export default EpsModalButton;
