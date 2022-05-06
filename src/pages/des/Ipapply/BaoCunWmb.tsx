import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Modal, Form, Input } from 'antd';
import IpapplyStore from '@/stores/des/IpapplyStore';
import { Message } from '@alifd/next';

const BaoCunWmb = observer(
  (props: { zlxvisible: any; setZlxvisible: any; tableStore: any }) => {
    const [form] = Form.useForm();
    const { zlxvisible, setZlxvisible, tableStore } = props;
    const [template, setTemplate] = useState(false);

    /**
     * 保存另存为模版的模版名称
     */
    const saveTemplName = (e) => {
      IpapplyStore.templName = e.target.value;
    };

    /**
     * 另存为模版
     */
    const saveAsTempl = () => {
      IpapplyStore.saveasModule(
        IpapplyStore.templName,
        IpapplyStore.editRecord.id,
      ).then((response) => {
        if(response){
          Message.show('保存成功！');
          setZlxvisible(false);
        }else{
          Message.error('保存失败');
        }
      }).catch(()=>{
        Message.error('服务器内部错误');
      });
    };
    return (
      <Modal
        visible={zlxvisible}
        onCancel={() => setZlxvisible(false)}
        onOk={saveAsTempl}
        style={{ width: 400 }}
        title="保存为模版"
        centered
      >
        <Row>
          <Col span="5" style={{ marginTop: '6px' }}>
            模版名称：
          </Col>
          <Col span="19">
            <Input
              name="jcsqSqdw"
              onChange={saveTemplName}
              style={{ width: '100%' }}
              placeholder={'请输入模版名称'}
            />
          </Col>
        </Row>
      </Modal>
    );
  },
);
export default BaoCunWmb;
