/* eslint-disable @typescript-eslint/no-unused-expressions */

import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Popconfirm,
} from 'antd';
import { useState } from 'react';
import { EpsTableStore } from '../../panel/EpsPanel2';
import ConditionStorage from './storage';

import './index.less';
import type ConditionCard from './ConditionCard';

const { Option } = Select;

export type ConditionSearchSource = {
  label: string;
  value: unknown;
  mc: string;
  ms: string;
  dakmc: string;
  lbkj: string;
  type: string;
  option: string;
};

export type ConditionSearchProps = {
  hidden: boolean;
  store: EpsTableStore;
  dakid: string;
  source: ConditionSearchSource[];
  info: KtableType;
};

function ConditionSearch(props: ConditionSearchProps) {
  const [searchModal, setSearchModal] = useState(false);
  const [form] = Form.useForm();
  const [saveForm] = Form.useForm();
  // 获取保存记录
  const [cards, setCards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState<ConditionCard>();
  const [storage, setStorage] = useState<ConditionStorage>();

  // 保存查询条件
  const saveSearch = (title: string) => {
    if (cards && cards.length >= 5) {
      message.error('保存失败,保存的记录数已达到5条');
      return;
    }
    form.validateFields().then((value) => {
      const result = storage?.addCard(value, title || '查询条件');
      setCards(result);
      if (result && result.length > 0) {
        setCurrentCard(result[result.length - 1]);
      }
      message.success(
        `保存成功，累计可保存5条记录, 还可保存${5 - result.length}条`,
      );
    });
  };

  // 移除保存的查询记录
  const removeCard = (value) => {
    const result = storage?.removeCard(value);
    setCards(result);
    setCurrentCard(result && result[0]);
    form.resetFields();
  };

  const getKfieldType = (value: string): string => {
    if (Array.isArray(props.source)) {
      const result = props.source.filter(
        (item) =>
          item.lbkj === 'Y' && `${props.info.bmc}_${item['mc']}` === value,
      );
      return result[0]?.lbkj || '';
    }
    return '';
  };

  const makeParams = (value: ConditionSearchSource[]) => {
    let sql = '';
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        index > 0 && (sql += ` ${item.option} `);
        // console.log('下拉框选项', item, getKfieldType(item.mc))
        if (item.type === 'co') {
          // 7
          item.value && (sql += ` ${item.mc} like '%${item.value}%' `);
        } else if (item.type === 'nco') {
          // 8
          item.value && (sql += ` ${item.mc} not like '%${item.value}%' `);
        } else if (item.type === 'cod') {
          // 9
          item.value && (sql += ` ${item.value} not like '%${item.mc}%' `);
        } else if (item.type === 'isnull') {
          // 10
          const type = getKfieldType(item.mc);
          if (type === 'd' || type === 'f') {
            sql += `${item.mc} is null`;
          } else {
            sql += `isnull(${item.mc},' ')=' '`;
          }
        } else if (item.type === 'notnull') {
          // 11
          const type = getKfieldType(item.mc);
          if (type === 'd' || type === 'f') {
            sql += `not (${item.mc} is null) `;
          } else {
            sql += `isnull(${item.mc},' ')<>' '`;
          }
        } else {
          // 1-6
          const type = getKfieldType(item.mc);
          if (type === 'd') {
            item.value &&
              (sql += ` ${item.mc} > convert(datetime, '${item.value}')`);
          } else {
            item.value && (sql += ` ${item.mc} ${item.type} '${item.value}'`);
          }
        }
      });
    }
    return ` (${sql}) `;
  };

  const renderOption = (arr: [], code: string, name: string) => {
    return Array.isArray(arr)
      ? arr
          .filter((item) => item.lbkj === 'Y')
          .map((item) => {
            return (
              <Option
                key={`${props.info.bmc}_${item[code]}`}
                value={`${props.info.bmc}_${item[code]}`}
              >
                {item[name]}
              </Option>
            );
          })
      : [];
  };

  // 执行查询
  const handleSearch = () => {
    form.validateFields().then((value) => {
      const result = storage?.modifyCardNum(currentCard);
      // setCards(result)
      setSearchModal(false);
      const store = props.store;
      store.findByKey(store.key, store.page, store.size, {
        ...store.params,
        telesql: makeParams(value && value.names),
      });
    });
  };

  return (
    <>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          if (props.dakid) {
            const st = new ConditionStorage(props.dakid);
            const cards = st.getCardsById() || [];
            setCards(cards);
            setStorage(st);
            if (cards.length > 0) {
              setCurrentCard(cards[0]);
              form.setFieldsValue(cards[0]?.data || {});
            } else {
              form.resetFields();
            }
          }
          setSearchModal(true);
        }}
        style={{ display: props?.hidden ? 'none' : 'block' }}
        // icon={<SearchOutlined />}
        type="primary"
      >
        高级查询
      </Button>
      <Modal
        title="高级查询"
        visible={searchModal}
        width={1000}
        onOk={() => setSearchModal(false)}
        onCancel={() => setSearchModal(false)}
        footer={
          <>
            <Button onClick={() => form.resetFields()}>重置</Button>
            <Button
              style={{ marginRight: '630px' }}
              onClick={() => {
                Modal.confirm({
                  title: '保存查询条件',
                  icon: <SaveOutlined />,
                  content: (
                    <Form form={saveForm} style={{ height: '20px' }}>
                      <Form.Item label="保存名称" name="saveName">
                        <Input />
                      </Form.Item>
                    </Form>
                  ),
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    saveSearch(saveForm.getFieldValue('saveName'));
                    saveForm.resetFields();
                  },
                });
              }}
            >
              保存查询条件
            </Button>
            <Button onClick={() => setSearchModal(false)}>关闭</Button>
            <Button type="primary" onClick={() => handleSearch()}>
              查询
            </Button>
          </>
        }
      >
        <div>
          <Row gutter={20}>
            <Col span={6} style={{ overflowY: 'auto', borderRight: '1px' }}>
              {cards.length <= 0 && (
                <Empty description={<span>暂无保存记录</span>} />
              )}
              {cards.length > 0 &&
                cards.map((item, index) => (
                  <Card
                    key={index}
                    title={<a style={{ color: '#096dd9' }}>{item.title}</a>}
                    extra={
                      <Popconfirm
                        title="确定要删除该条记录么？"
                        icon={
                          <QuestionCircleOutlined style={{ color: 'red' }} />
                        }
                        onConfirm={(event) => {
                          event.stopPropagation();
                          removeCard(item.title);
                        }}
                      >
                        <CloseCircleOutlined
                          style={{ fontSize: '18px', color: 'red' }}
                        />
                      </Popconfirm>
                    }
                    style={{ marginBottom: '5px', position: 'relative' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      const data = storage?.getCardByTitle(item.title);
                      setCurrentCard(data);
                      form.setFieldsValue(data.data || {});
                    }}
                  >
                    <a style={{ fontSize: '12px', color: 'black' }}>
                      创建时间： {item.create_time}
                    </a>
                    <br />
                    <a style={{ fontSize: '12px', color: 'black' }}>
                      使用次数: {item.num} 次
                    </a>
                  </Card>
                ))}
            </Col>
            <Col span={18} style={{ overflowY: 'auto' }}>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '16px',
                  marginBottom: '15px',
                }}
              >
                {currentCard?.title}
              </div>
              <Form
                form={form}
                autoComplete="off"
                initialValues={{
                  kind: 'and',
                  names: [{ mc: '', type: '=', value: '', option: 'and' }],
                }}
              >
                {/* <Form.Item label="过滤条件匹配" name="kind">
                    <Select>
                      <Option value="and">AND(所有条件都要求匹配)</Option>
                      <Option value="or">OR(条件中的任意一个匹配)</Option>
                    </Select>
                </Form.Item> */}
                <Form.List name="names">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                          <Form.Item
                            {...field}
                            label={null}
                            name={[field.name, 'option']}
                            fieldKey={[field.fieldKey, 'option']}
                          >
                            <Select style={{ width: 90 }}>
                              <Option value="and">并且</Option>
                              <Option value="or">或者</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label={null}
                                name={[field.name, 'mc']}
                                fieldKey={[field.fieldKey, 'mc']}
                              >
                                <Select style={{ width: 160 }}>
                                  {renderOption(props.source, 'mc', 'ms')}
                                </Select>
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label={null}
                            name={[field.name, 'type']}
                            fieldKey={[field.fieldKey, 'type']}
                          >
                            <Select style={{ width: 110 }}>
                              <Option value="=">等于</Option>
                              <Option value="<>">不等于</Option>
                              <Option value=">">大于</Option>
                              <Option value=">=">大于等于</Option>
                              <Option value="<">小于</Option>
                              <Option value="<=">小于等于</Option>
                              <Option value="co">包含</Option>
                              <Option value="nco">不包含</Option>
                              <Option value="cod">被包含</Option>
                              <Option value="isnull">为空</Option>
                              <Option value="notnull">不为空</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label={null}
                            name={[field.name, 'value']}
                            fieldKey={[field.fieldKey, 'value']}
                          >
                            <Input
                              style={{ width: 265 }}
                              placeholder="请输入检索值"
                            />
                          </Form.Item>
                          {/* <MinusCircleOutlined onClick={() => remove(field.name)} /> */}

                          {index > 0 && (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                            />
                          )}
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            const data = props.source.filter(
                              (item) => item.lbkj === 'Y',
                            );
                            return add({
                              mc:
                                (data &&
                                  data.length > 0 &&
                                  `${props.info.bmc}_${data[0]['mc']}`) ||
                                '',
                              type: '=',
                              value: '',
                              option: 'and',
                            });
                          }}
                          style={{ width: '60%', marginLeft: 160 }}
                          icon={<PlusOutlined />}
                        >
                          增加条件
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}

export default ConditionSearch;
