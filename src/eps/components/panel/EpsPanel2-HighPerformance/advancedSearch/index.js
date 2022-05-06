import React, { useEffect, useState } from 'react';
import './index.less';
import { Form, Select, Input, Button, Row, Col } from 'antd';
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

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 4,
  },
};

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
          return children.map((item, index) => {
            return (
              <Col span={12} key={index}>
                {item}
              </Col>
            );
          });
        } else {
          return <></>;
        }
      }
    }
  }
};

function AdvancedSearch(props) {
  const [drawVisible, setDrawVisible] = useState(props.drawVisible);

  const data = {};
  const [form] = Form.useForm();

  useEffect(() => {
    setDrawVisible(props.drawVisible);
    if (props.drawVisible) {
      if (props.onClick) {
        props.onClick(form, props.tableStore);
      }
    }
  }, [props.drawVisible]);

  const cancel = () => {
    props.changeVisible(false);
  };

  const searchForm = props.searchForm;
  // const formItemLayout = {
  //   labelCol: {
  //       fixedspan: 10
  //   },
  //   wrapperCol: {
  //       span: 14
  //   }
  // };

  const handleSearch = () => {
    const tableStore = props.tableStore;

    form
      .validateFields()
      .then((data) => {
        const d = Object.assign(
          tableStore.params,
          props.initParams || {},
          data,
        );
        if (tableStore.page === 1) {
          tableStore.findByKey(
            tableStore.key,
            tableStore.page,
            tableStore.size,
            d,
          );
        } else {
          tableStore.params = d;
          tableStore.page = 1;
        }
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
        destroyOnClose
        zIndex={drawVisible ? 10 : -99}
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
            <Row>{makeForm(searchForm)}</Row>
            <div className="btns">
              <Button type="" onClick={() => form.resetFields()}>
                重置
              </Button>
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
