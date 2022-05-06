import React, { useEffect, useState, useRef } from 'react';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import { observer, useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
// import EpsModalButton from "@/eps/components/buttons/EpsModalButton";

const httpRequest = new HttpRequest('/api/eps/control/main');
import Arch from './index';
import update from 'immutability-helper';

import {
  Affix,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Tag,
} from 'antd';
import { ImportOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import TableService from '@/pages/dagl/Dagl/AppraisaManage/TableService';

const span = 12;
const _width = 300;

const SearchFilter = observer((props) => {
  // eslint-disable-next-line prefer-destructuring

  const location: locationType = props.location;
  const archParams: ArchParams = location ? location.query : props.params;
  // 是否案卷
  const isRecords =
    archParams.lx != '01' &&
    archParams.lx != '0201' &&
    archParams.lx != '0301' &&
    archParams.lx != '040101' &&
    archParams.lx != '04';
  // 是否工程案卷
  const isProject = archParams.lx == '04';

  const store = useLocalStore(() => ({
    params: archParams,
    childParams: {},
    ktable: {},
    childKtable: {},
    dakid: archParams.dakid,
    childDakid: '',
    tagsData: [],
    selectedTags: [],
    // 点击的主表的id，子表查询传递fid参数
    mainRowId: '',
    async search(e) {
      const response = await TableService.searcGjc({ kword: e.target.value });
      runInAction(() => {
        if (response.results) {
          this.tagsData = response.results;
        }
      });
    },
    setSelectTags(checked, tag) {
      runInAction(() => {
        debugger;

        if (checked) {
          this.selectedTags.push(tag);
        } else {
          this.selectedTags = this.selectedTags.filter((o) => {
            return o != tag;
          });
        }
      });
    },
  }));
  const tagsData = ['Movies', 'Books', 'Music', 'Sports'];
  useEffect(() => {
    // if (archParams.dakid) {
    //store.initKtable();
    //   }
  }, []);
  const onCancel = () => {
    props.closeModal();
  };

  const doOk = () => {
    props.onClose(store.selectedTags);
  };
  return (
    <div style={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
      <Form
        name="xtform"
        style={{ height: '420px', padding: '5px' }}
        //   form={form}
        // initialValues={XtStore.xtData}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // onFinish={onFinish}
      >
        <div className="ant-form">
          <Divider orientation="left" plain>
            已选关键词
          </Divider>
          <Row gutter={20}>
            <Col span={span}>
              {store.selectedTags.map((tag) => (
                <Tag closable onClose={() => store.setSelectTags(false, tag)}>
                  {tag}
                </Tag>
              ))}
            </Col>
          </Row>
          <Divider orientation="left" plain>
            可选关键词
          </Divider>
          <Row gutter={20}>
            <Col span={span}>
              <Form.Item label="请输入关键词检索" name="dwmc">
                <Input
                  onChange={store.search}
                  style={{ width: _width }}
                  className="ant-input"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={span} style={{ height: 52 }}>
              {store.tagsData.map((tag) => (
                <CheckableTag
                  key={tag.kword}
                  checked={store.selectedTags.indexOf(tag.kword) > -1}
                  onChange={(checked) =>
                    store.setSelectTags(checked, tag.kword)
                  }
                >
                  {tag.kword}
                </CheckableTag>
              ))}
            </Col>
          </Row>
        </div>
      </Form>
      <Space style={{ float: 'right' }}>
        <Button type="primary" onClick={doOk}>
          提交
        </Button>
        <Button onClick={onCancel}>关闭</Button>
      </Space>
    </div>
  );
});

export default SearchFilter;
