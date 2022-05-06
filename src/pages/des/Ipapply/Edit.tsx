import { observer } from 'mobx-react';
import React, { useEffect, useState, useRef } from 'react';
import {
  Steps,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  DatePicker,
  Upload,
  message,
  Table,
  TreeSelect,
  Checkbox,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import SysStore from '../../../stores/system/SysStore';
import IpapplyStore from '../../../stores/des/IpapplyStore';
import '@/eps/components/panel/EpsPanel3/index.less';
import './index.less';
import SetInfo from './SetInfo';
import JcsqService from './Service/JcsqService';
import ConditionSearch from '../component/search/ConditionSearch';

const FormLayOut = {
  labelCol: { span: 4 },
  // wrapperCol: { span: 14 },
};

const Edit = observer(() => {
  const [current, setCurrent] = useState(0);
  const [needPpgz, setNeedPpgz] = useState(true);
  const [aiForm] = Form.useForm();
  const { fieldcolumns } = IpapplyStore;
  const [filedsData, setFiledsData] = useState([]);
  const [values, setValues] = useState({});
  //注意:只刷新外部stroe变量,达不到刷新页面效果,此变量无实际用途
  const [jcsqtype, setJcsqType] = useState('');
  const [dakData, setDakData] = useState([]);
  const [searchVisable, setSearchVisable] = useState([]);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    IpapplyStore.findIptcfg({ types: "'101','303'" });
    IpapplyStore.findYuanwenIptcfg({
      types: "'201','202','203','204','301','302','303'",
    });
    IpapplyStore.setfieldcolumns([
      {
        title: '著录项名称',
        dataIndex: 'name1',
        width: 200,
      },
      {
        dataIndex: 'name2',
        width: 200,
      },
      {
        dataIndex: 'name3',
        width: 200,
      },
      {
        dataIndex: 'name4',
        width: 200,
      },
      {
        dataIndex: 'name5',
        width: 200,
      },
    ]);
    IpapplyStore.findDak().then((response) => {
      let data = response.data;
      IpapplyStore.updateData(data);
      setDakData(data);
    });
    IpapplyStore.findAllDak();

    if (IpapplyStore.sjly === 'd') {
      IpapplyStore.findmbzlxbydakid(IpapplyStore.dakid).then(() => {
        IpapplyStore.findDakmxByid(IpapplyStore.dakid).then(() => {
          //刷新数据
          setJcsqType(IpapplyStore.dakid);
        });
      });
    } else {
      IpapplyStore.queryFields().then((response) => {
        setFiledsData(IpapplyStore.filedsData);
      });
    }
  }, []);

  const onjcfwChange = (value) => {
    IpapplyStore.jcfw = value;
    IpapplyStore.jcfw = value;
    setJcsqType(value);
  };
  const onsjlyChange = (value) => {
    IpapplyStore.sjly = value;
    setJcsqType(value);
  };
  const ondakChange = (value) => {
    IpapplyStore.findmbzlxbydakid(value).then(() => {
      IpapplyStore.findDakmxByid(value).then(() => {
        IpapplyStore.dakid = value;
        setJcsqType(value);
      });
    });
  };
  const ljjcOnChange = (record) => {
    IpapplyStore.ljjc = record;
  };

  //展示的动态字段
  const renderApplyInfo = () => (
    <div style={{ height: 500 }}>
      <Form
        {...FormLayOut}
        form={aiForm}
        onValuesChange={(changedValues) => {
          if (changedValues.jcfw) {
            setNeedPpgz(changedValues.jcfw === 'A');
          }
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item
              name="sqrq"
              label="申请日期"
              rules={[{ required: true, message: '申请日期不允许为空!' }]}
              initialValue={moment(IpapplyStore.sqrq)}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sqr"
              label="申请人"
              initialValue={IpapplyStore.sqr}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sqdw"
              label="申请单位"
              rules={[{ required: true, message: '申请单位不允许为空!' }]}
              initialValue={IpapplyStore.sqdw}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <Form.Item
              name="jcrq"
              label="检测日期"
              initialValue={moment(IpapplyStore.jcrq)}
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="jcr"
              label="检测人"
              initialValue={IpapplyStore.jcr}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="jcdw"
              label="检测单位"
              initialValue={IpapplyStore.jcdw}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="数据来源"
              name="sjly"
              initialValue={IpapplyStore.sjly}
            >
              <Select onChange={onsjlyChange}>
                <Select.Option value="w">外部导入</Select.Option>
                <Select.Option value="d">档案系统</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="jcfw"
              label="检测范围"
              rules={[{ required: true, message: '检测范围不允许为空!' }]}
              initialValue={IpapplyStore.jcfw}
            >
              <Select onChange={onjcfwChange}>
                <Select.Option value="A">条目和原文</Select.Option>
                <Select.Option value="B">仅条目</Select.Option>
                <Select.Option value="C">仅原文</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {IpapplyStore.jcfw !== 'B' && IpapplyStore.sjly === 'w' && (
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: IpapplyStore.jcfw !== 'B',
                    message: '原文目录不允许为空!',
                  },
                ]}
                name="ywdir"
                label="原文目录"
                initialValue={IpapplyStore.ywdir}
              >
                <Input />
              </Form.Item>
            </Col>
          )}
          {IpapplyStore.sjly === 'd' && (
            <>
              <Col span={8}>
                <Form.Item
                  label="选择档案库"
                  name="dakid"
                  validateFirst
                  initialValue={IpapplyStore.dakid}
                  rules={[
                    { required: true, message: '请选择需要检测的档案库' },
                    {
                      async validator(_, value) {
                        let filterdak = [];
                        filterdak = IpapplyStore.dakData.filter(
                          (d) => d.id == value,
                        );
                        if (filterdak.length === 0) {
                          return Promise.reject(
                            new Error('请选择二级档案库名称'),
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <TreeSelect
                    // value={IpapplyStore.dakid}
                    treeNodeFilterProp="title"
                    showSearch
                    onChange={ondakChange}
                    treeData={dakData}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="条目状态"
                  name="tmzt"
                  rules={[{ required: true, message: '请条目状态必填' }]}
                  initialValue={IpapplyStore.tmzt}
                >
                  {/* 条目状态对应 -1:三段式文件中心,0:三段式文件分发,1:文件收集,2:文件整理,3:档案管理,4:档案利用,5:档案编研,7:借阅可见,8:档案鉴定,9:三段式收集,
                   *  10:档案分发,11:功能 12:业务指导,14:档案长期保存,15：划控鉴定 ;16：销毁鉴定;17：密级鉴定;17：档案销毁 ,19:档案开放。20:快速开发,-100电子文件中心 */}
                  <Select mode="multiple">
                    <Select.Option value="1">档案收集</Select.Option>
                    <Select.Option value="2">档案整理</Select.Option>
                    <Select.Option value="3">档案管理</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={8}>
            <Form.Item name="ljjc" label="立即检测">
              <Checkbox
                defaultChecked={IpapplyStore.ljjc}
                onChange={(record) => {
                  IpapplyStore.ljjc = record.target.checked;
                }}
              />
            </Form.Item>
          </Col>

          {IpapplyStore.sjly === 'd' && (
            <Col span={8}>
              <Form.Item name="telesql" label="附加条件">
                <ConditionSearch
                  dakid={IpapplyStore.dakid}
                  source={IpapplyStore.kfileds}
                  info={IpapplyStore.ktable}
                ></ConditionSearch>
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item
              name="sqsm"
              label="申请说明"
              initialValue={IpapplyStore.sqsm}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Col span={12} style={{ visibility: 'hidden' }}>
          <Form.Item
            name="ppgz"
            label="匹配规则"
            rules={[{ required: needPpgz, message: '匹配规则不允许为空!' }]}
            initialValue={IpapplyStore.defaultexpr}
          >
            <Select options={IpapplyStore.exprData} />
          </Form.Item>
        </Col>
      </Form>
    </div>
  );

  const customRequest = (options) => {
    const templist = fileList;
    templist[0].status = 'uploading';
    setFileList(templist);
    const filereader = new FileReader();
    filereader.onload = (event) => {
      IpapplyStore.excelUploadFile(options.file, 0)
        .then((response) => {
          if (response && response.status === 200) {
            IpapplyStore.queryFields().then(() => {
              templist[0].status = 'done';
              setFileList(templist);
              setFiledsData(IpapplyStore.filedsData);
              message.success('上传成功！');
            });
            IpapplyStore.resultrecord = true;
          } else {
            templist[0].status = 'uploading';
            setFileList(templist);
            IpapplyStore.resultrecord = false;
            message.error('上传失败！');
          }
        })
        .catch((err) => {
          templist[0].status = 'error';
          setFileList(templist);
          setJcsqType(options);
          IpapplyStore.resultrecord = false;
          message.error('服务器内部错误');
        });
    };
    filereader.readAsBinaryString(options.file);
  };

  const onUpLoadChange = (info) => {
    console.log(info);
    setFileList(info.fileList);
  };

  const renderTmInfo = () => (
    <div style={{ height: 500 }}>
      <Row>
        <Upload
          name="Fdata"
          maxCount={1}
          accept=".xlsx,.xls"
          fileList={fileList}
          customRequest={customRequest}
          onChange={onUpLoadChange}
        >
          <Button
            icon={<UploadOutlined />}
            type="primary"
            style={{ margin: '0 0 10px' }}
          >
            导入
          </Button>
        </Upload>
      </Row>
      <Row>
        <Table
          bordered
          rowKey="id"
          size="small"
          dataSource={filedsData}
          columns={fieldcolumns}
        />
      </Row>
    </div>
  );

  const renderSetInfo = () => (
    <div>
      <SetInfo values={values} />
    </div>
  );

  const doNext = () => {
    switch (current) {
      case 0:
        aiForm.setFieldsValue({
          telesql: IpapplyStore.telesql,
          ljjc: IpapplyStore.ljjc,
        });
        aiForm.validateFields().then((value) => {
          if (IpapplyStore.sjly === 'd') {
            value.tmzt = value.tmzt.toString();
          }

          setValues(value);
          switch (value.jcfw) {
            case 'A':
            case 'B':
              if (IpapplyStore.sjly === 'w') {
                setCurrent(current + 1);
              } else {
                IpapplyStore.daktmzlx(value)
                  .then((response) => {
                    if (response && response.status === 200) {
                      if (response.data) {
                        //查询著录项检测中的值
                        IpapplyStore.queryFields().then((response) => {
                          setCurrent(current + 2);
                        });
                      }
                    }
                  })
                  .catch(() => {
                    message.error('条目著录项获取失败');
                  });
              }

              break;
            case 'C':
              setCurrent(current + 2);
              break;
            default:
              break;
          }
        });
        break;
      default:
      case 1:
        aiForm.validateFields().then((values) => {
          if (filedsData.length === 0 || !IpapplyStore.resultrecord) {
            return message.error('请导入条目');
          }
          setCurrent(current + 1);
        });
        break;
      case 2:
        if (IpapplyStore.opt === 'edit') {
          values['id'] = IpapplyStore.editRecord.id;
          JcsqService.updateForTable(values)?.then((response) => {
            if (response.status == 200) {
              message.info('修改成功！');
              IpapplyStore.startInspect(IpapplyStore.editRecord.id);
              doClose();
              IpapplyStore.queryForPage();
            } else {
              message.info('修改失败！');
            }
          });
        } else {
          aiForm.validateFields().then(() => {
            IpapplyStore.saveIpapplyData({
              ...IpapplyStore.editRecord,
              ...values,
            }).then((response) => {
              if (response.status == 201) {
                message.info('新增成功！');
                IpapplyStore.startInspect(IpapplyStore.editRecord.id);
                doClose();
                IpapplyStore.queryForPage();
              } else {
                message.info('新增失败！');
              }
            });
          });
        }
    }
  };

  const doPrior = () => {
    IpapplyStore.jcfw === 'C' || IpapplyStore.sjly === 'd'
      ? setCurrent(current - 2)
      : setCurrent(current - 1);
  };

  const doClose = () => {
    IpapplyStore.closeEditForm();
    IpapplyStore.jcfw = 'A';
  };

  return (
    <div className="ipapply_edit">
      <Steps current={current}>
        <Steps.Step title="申请信息"></Steps.Step>
        <Steps.Step title="导入条目"></Steps.Step>
        <Steps.Step title="检测设置"></Steps.Step>
      </Steps>
      <div className="editContext">
        {current === 0 && renderApplyInfo()}
        {current === 1 && renderTmInfo()}
        {current === 2 && renderSetInfo()}
        <div className="footer">
          {current !== 0 && (
            <Button type="primary" onClick={() => doPrior()}>
              上一步
            </Button>
          )}
          {current !== 2 && (
            <Button
              type="primary"
              style={{ marginLeft: 20 }}
              onClick={() => {
                doNext();
              }}
            >
              下一步
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              style={{ marginLeft: 20 }}
              onClick={() => doNext()}
            >
              完成
            </Button>
          )}
          <Button style={{ marginLeft: 20 }} danger onClick={() => doClose()}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Edit;
