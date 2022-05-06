import React, {useState} from 'react';
import './edit.less'
import {
  Badge,
  Button,
  Form,
  Icon,
  Input,
  NumberPicker,
  Pagination,
  Radio,
  Search,
  Select,
  Table,
  Tree,
  Message
} from '@alifd/next';
import {FormattedMessage, injectIntl} from 'react-intl';
import {isMoment} from "moment";
import {observer} from "mobx-react";
import EditForm from "../../../components/EditForm";
import Store from "../../../stores/accessuse/RegistrationStore";
import E9Config from "../../../utils/e9config";

const {Group: RadioGroup} = Radio;
const { Option } = Select;
const TreeNode = Tree.Node;
const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const EditDialog = observer((props) => {
  const {
    intl: { formatMessage },
  } = props;
  const { Item: FormItem } = Form;
  const [field, setField] = useState(null);
  const savedata = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        const { whsj } = values;
        if (isMoment(whsj)) {
          values.whsj = whsj.format('YYYY-MM-DD HH:mm:ss');
        }
        Store.saveData(values);
        Store.setCdnrNum()
      }
    });
  });
  const closePage = (() => {
    Store.setRegistPage(false);
    Store.setCdnrNum()
  });
  const onSelect =((e,item) => {
    Store.onDakChanged(e,item);
  });
  const showSfz =(() => {
    Store.showSfz().then(() => { field.setValues(Store.filedvaule) });
  });
  const showCdrSfz =(() => {
    Store.showCdrSfz().then(() => { field.setValues(Store.bcdfiledvaule) });
  });
  const search =((value) => {
    if(Store.checkdakid==""){
      Message.warning('请选择档案库!');
      return;
    }
    Store.eqSearch(value);
  });
  const addDalydj =((value) => {

    Store.addDalydj(value);
  });
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    Store.setEsPageNo(current);
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    Store.setEsPageSize(pageSize);
  });
  const renderTableCell = (value, index, record) => {
    return (
        <div>
          <a href="javascript:;" onClick={() => addDalydj(record)} >添加</a>
        </div>);
  };
  const formItemLayout = {
    labelCol: {
      fixedSpan: 10
    },
    wrapperCol: {
      span: 14
    }
  };

  const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
              <TreeNode  key={item.id} label={<span><span style={{marginRight: 20}}>{item.mc}</span><span>{item.count ? `(${item.count})` : ''}</span></span>}>
                {loop(item.children)}
              </TreeNode>
          );
        }
        return <TreeNode key={item.id} label={item.mc}/>;
      });
  return (
      <div className="regist-page">
        <div className="top">
          <div className="title">
            <span className="title-name">查档人信息</span>
            <div className="btns">
              <Badge count={5}>
                <Button type="primary" className="btn"><img src={require('../../../styles/assets/img/file-transfer/icon_yjqd_white.png')}/>查档证明</Button>
              </Badge>
              <Badge count={Store.cdnrnub}>
                <Button type="primary" className="btn"><img src={require('../../../styles/assets/img/file-transfer/icon_yjqd_white.png')}/>查档内容</Button>
              </Badge>
            </div>
          </div>
          <div className="file-container">
            <div className="left">
              <div className="pic">
                <img  style={{width:'120px',height:'140px'}} src={Store.cdrbase64}/>
              </div>
              <Button  className="btn" onClick={showSfz} >身份证读取</Button>
            </div>
            <div className="right">
              <Form
                  value={Store.editRecord}
                  onChange={Store.onRecordChange}
                  {...formItemLayout}
                  saveField={(f) => {
                    setField(f);
                  }}
              >
                <div className="row">
                  <Form.Item label="查档人"  required name="cyrxm" className="form-item"><Input name="cyrxm" placeholder="输入查档人"/></Form.Item>
                  <Form.Item label="证件"  required name="zjmc" className="form-item">
                    <Select name="zjmc"   >
                      <Select.Option value=" " key="k0"> </Select.Option>
                      {Store.zj.map(item => <Select.Option value={item.id} key={item.id}>{item.mc}</Select.Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="证件号" className="form-item"><Input name="zjhm" placeholder="输入证件号"/><span onClick={showSfz} className="float-text">证件读取</span></Form.Item>
                  <Form.Item label="住址" className="form-item"><Input name="jtzz" placeholder="输入住址"/></Form.Item>
                </div>
                <div className="row">
                  <Form.Item label="性质" className="form-item">
                    <Select name="jyrxz" defaultValue="A">
                      <Option value="A">个人</Option>
                      <Option value="B">单位</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="电话" name="lxdh" className="form-item"><Input placeholder="输入电话"/></Form.Item>
                  <Form.Item label="单位" name="dw" className="form-item"><Input placeholder="输入单位"/></Form.Item>
                  <Form.Item label="备注"  name="bz" className="form-item"><Input placeholder="输入备注"/></Form.Item>
                </div>
                <div className="row">
                  <Form.Item label="利用方式"   className="form-item">
                    <Select  name="lyfs" placeholder="选择利用方式">
                      <Select.Option value=" " key="k0"> </Select.Option>
                      {Store.lyfs.map(item => <Select.Option value={item.bh} key={item.id}>{item.mc}</Select.Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="利用内容"  name="lydanr"  className="form-item"><Input placeholder="输入利用内容"/></Form.Item>
                  <Form.Item label="利用效果"  name="lydaxg"  className="form-item"><Input placeholder="输入利用效果"/></Form.Item>
                  <Form.Item label="利用目的"  required   className="form-item">
                    <Select name="lymd">
                      <Select.Option value=" " key="k0"> </Select.Option>
                      {Store.lymd.map(item => <Select.Option value={item.bh} key={item.id}>{item.mc}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </div>
                <div className="row">
                  <Form.Item label="被查档人" className="form-item"><Input name="wtrxm" placeholder="输入被查档人"/></Form.Item>
                  <Form.Item label="证件" className="form-item">
                    <Select name="wtrzjlx">
                      <Select.Option value=" " key="k0"> </Select.Option>
                      {Store.zj.map(item => <Select.Option value={item.id} key={item.id}>{item.mc}</Select.Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="证件号" className="form-item"><Input name="wtrzjhm" placeholder="输入证件号"/><span onClick={showCdrSfz} className="float-text">证件读取</span></Form.Item>
                  <Form.Item label="住址" className="form-item"><Input name="wtrjjwz" placeholder="输入住址"/></Form.Item>
                </div>
              </Form>
              <div className="bot-search">
                <Form inline>
                  <FormItem  label="">
                    <Search type="secondary" placeholder="请输入搜索内容"  onSearch={(val)=>search(val)} className="search"/>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="tree-content">
            <Tree defaultExpandAll={false} className="tree" onSelect={onSelect}>
              {loop(Store.treeData)}
            </Tree>
            <div className="tree-right">
              <Table bordered="true" dataSource={Store.esResult.results}
                     tableLayout="fixed"
                  // $work-context-heigth-41px, 41px为表头高度
                     maxBodyHeight="calc(100vh - 259px)"     loading={Store.esloading}isZebra={true} className="common-table" >
                {Store.dakKfields.map(col =>
                    <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
                )}
                <Table.Column cell={renderTableCell} width="100px" lock="left" />
              </Table>
              <Pagination shape="arrow-only" defaultCurrent={1}  className="paginate"
                          current={Store.espageno}
                          pageSize={Store.espagesize}
                          total={Store.esResult.total}
                          onChange={onPaginationChange}
                          shape={E9Config.Pagination.shape}
                          pageSizeSelector={E9Config.Pagination.pageSizeSelector}
                          pageSizePosition={E9Config.Pagination.pageSizePosition}
                          onPageSizeChange={onPageSizeChange}
                          popupProps={E9Config.Pagination.popupProps}
                          totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
              />
            </div>
          </div>
          <div className="control">
            <span className="title">查档信息</span>
            <span className="label">刻盘张数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
            <span className="label">调资料册数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
            <span className="label">出具证明数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
            <span className="label">打印页数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
            <span className="label">翻拍页数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
            <span className="label">下载文件数</span><NumberPicker alwaysShowTrigger min={0} defaultValue={0} className="num-picker"/>
          </div>
          <div className="btns-bottom">
            <Button type="primary" onClick={savedata} className="btn">保存</Button>
            <Button className="btn" onClick={closePage}>关闭</Button>
          </div>
        </div>
      </div>

  );
});

export default injectIntl(EditDialog);
