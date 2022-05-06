import { useEffect, useState, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Pagination, Table, Form, Input, Button, message} from 'antd';
import { history } from 'umi';
import Header from '../components/header';
import Technology from '../components/technology';
import LeftMenu from '../components/leftMenu';
import style from './index.less';
import { runFunc } from '@/utils/menuUtils';
import fetch from '../../../utils/fetch';
import axios from 'axios';
import YjxxService from './YjxxService';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const Yjxx = observer((props) => {
  const store = useLocalStore(() => ({
    titlename: '',
    contentDesc: '',
  }));

  
  const onFinish = (data) => {
    YjxxService.saveByKey(data).then((res) => {
      message.success('提交成功！');
    })
    .catch((err) => message.error(err));;
  };

  useEffect(() => {

  }, []);

  const renderInfo = (
    <>
      <div className={`${style['box']}`}>
        {/* 中间输入框 */}
        <div className={`${style['boxinp']}`}>
          <Form {...layout} name="nest-messages" className={`${style['msform']}`} onFinish={onFinish}>
            <Form.Item name="mc" label="标题:" required rules={[{ required: true, message: '请输入标题' }]} >
              <Input className={`${style['formkdda']}`}/>
            </Form.Item>
            <Form.Item name="nrxx" label="内容:"   className={`${style['formkda']}`} required rules={[{ required: true, message: '请输入内容' }]}>
              <Input.TextArea  rows={30}/>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11 }} className={`${style['subBox']}`}>
              <Button className={`${style['sub']}`} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );

  return (
    <div className={`${style['list-content']}`}>
        <Header />
        <div className={`${style['list-body']}`}>
          <div className={`${style['list-table']}`}>
            <div className={`${style['title']}`}>意见</div>
            <div className={`${style['info']}`}>{renderInfo}</div>
          </div>
        </div>
        <Technology />
      </div>
  );
});
export default Yjxx;
