import React, { useEffect, useState } from 'react';
import './index.less';
import { Form, Select, Input, Button } from 'antd';
import { Drawer } from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { EpsTableStore } from '..';
const { Option } = Select;
const FormItem = Form.Item;

const makeForm = (searchForm) => {
  if (searchForm) {
    const {
      props: { children },
    } = searchForm();
    if (children) {
      if (Object.prototype.toString.call(children) === '[object Object]') {
        return (
          <>
            <div className="row">{children}</div>
          </>
        );
      }
      if (Array.isArray(children)) {
        if (children && children.length > 0) {
          for (let i = 0; i < children.length; i += 2) {
            return (
              <div className="row" key={i}>
                {children[i] && children[i]}
                {children[i + 1] && children[i + 1]}
              </div>
            );
          }
        } else {
          return <></>;
        }
      }
    }
  }
};

function AdvancedSearch(props) {
  const [drawVisible, setDrawVisible] = useState(props.drawVisible);

  useEffect(() => {
    setDrawVisible(props.drawVisible);
  }, [props.drawVisible]);

  const cancel = () => {
    props.changeVisible(false);
  };

  const searchForm = props.searchForm;
  const data = {};
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      fixedSpan: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const handleSearch = () => {
    const tableStore = props.tableStore;
    form
      .validateFields()
      .then((data) => {
        tableStore.findByKey(
          tableStore.key,
          tableStore.page,
          tableStore.size,
          data,
        );
      })
      .catch((info) => {
        message.error('数据添加失败,' + info);
      })
      .finally(() => {
        props.changeVisible(false);
      });
  };

  return (
    <div className="drawer-page">
      <Drawer
        visible={drawVisible}
        placement="top"
        closable={false}
        destroyOnClose={true}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <div className="drawer">
          <Form
            name="searchForm"
            form={form}
            {...formItemLayout}
            initialValues={data}
          >
            {makeForm(searchForm)}
            <div className="btns">
              <Button
                type="primary"
                onClick={handleSearch}
                style={{ margin: '0 20px' }}
              >
                开始搜索
              </Button>
              {/* <Button style={{margin: '0 20px'}}>重置</Button> */}
              <Button onClick={cancel}>取消</Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
}

export default AdvancedSearch;
