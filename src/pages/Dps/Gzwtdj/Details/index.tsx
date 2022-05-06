import fetch from '../../../../utils/fetch';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, List, message, Row, Comment, ConfigProvider } from 'antd';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import OptrightStore from '@/stores/user/OptrightStore';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

/**
 * 工作问题登记
 */
const Details = observer((props) => {
  //权限按钮
  const umid = 'DPS013';
  OptrightStore.getFuncRight(umid);
  useEffect(() => {
    DetailsStore.getQuestionData().then(() => {
      DetailsStore.findAnswerByQuestion(DetailsStore.lastPageQuestionId);
      DetailsStore.findAnswerY(DetailsStore.lastPageQuestionId);
    });
  }, []);

  //当前用户
  const currentUser = SysStore.getCurrentUser();

  //是否隐藏回复区域输入框
  // const [hiddenReply, setHiddenReply] = useState(true);

  //是否隐藏评论输入框
  const [hiddenComment, setHiddenConmmet] = useState(true);

  //获取回答表单实例
  const [formAnswer] = Form.useForm();
  const [yhmcReply, setYhmcReply] = useState('请输入');

  // const [isNone, setIsNone] = useState('none');

  const DetailsStore = useLocalObservable(() => ({
    //评论内容(回复主问题的)
    answerByQuestionData: [],
    // 标准答案
    answerDataY: [],
    //问题详情
    questionDataOne: [],
    lastPageQuestionId: '',
    async getQuestionData() {
      //如果是刷新页面则从缓存中获取questionId
      if (props.location.state === undefined) {
        this.lastPageQuestionId = window.sessionStorage.getItem('questionId');
      } else {
        this.lastPageQuestionId = props.location.state['questionId'];
        //第一次进入页面时,将id缓存到session
        window.sessionStorage.clear();
        window.sessionStorage.setItem('questionId', props.location.state['questionId']);
      }
      //获取页面的问题详情数据
      const response = await fetch.get(`/api/eps/dps/question/${this.lastPageQuestionId}`);
      if (response != null && response.status === 200) {
        if (response.data) {
          this.questionDataOne = response.data;
        }
      }
    },
    //根据问题id获取所有对主问题的回答,和对副评论的回复
    async findAnswerByQuestion(val) {
      const response = await fetch.get('/api/eps/dps/answer/comment', {
        params: { questionId: val },
      });

      if (response != null && response.status === 200) {
        if (response.data.length > 0) {
          this.answerByQuestionData = response.data;
        }
      }
    },
    //根据问题id查询为标准答案的数据
    async findAnswerY(val) {
      const params = {
        params: {
          questionId: val,
          standard: 'Y',
        },
      };
      const response = await fetch.get('/api/eps/dps/answer/list/', { params: params });
      if (response != null && response.status === 200) {
        if (response.data.length > 0) {
          this.answerDataY = response.data[0];
        }
      }
    },

    //新增回答(回复,评论,互动)
    async saveAnswer(values) {
      values['id'] = `${Math.random()}`;
      values['questionId'] = DetailsStore.lastPageQuestionId;
      values['yhId'] = currentUser.id;
      values['mc'] = currentUser.yhmc;
      values['astime'] = moment().format('YYYY-MM-DD HH:mm:ss');

      return await fetch.post('/api/eps/dps/answer/', values);
    },
    //删除评论
    async deleteAnswer(values) {
      return await fetch.delete('/api/eps/dps/answer/deleteanswer', { params: values });
    },
    async updateSetYById(values) {
      values['standard'] = 'Y';
      values['confirmerid'] = currentUser.id;
      values['confirmer'] = currentUser.yhmc;
      values['cfmtime'] = moment().format('YYYY-MM-DD HH:mm:ss');
      return await fetch.put(`/api/eps/dps/answer/${encodeURIComponent(values['id'])}`, values);
    },
  }));

  //设置为标准答案
  const onClickSetY = (values) => {
    DetailsStore.updateSetYById(values).then((response) => {
      if (response && response.status == 200) {
        message.success('设置成功');
        DetailsStore.findAnswerY(DetailsStore.lastPageQuestionId);
      } else {
        message.error('设置失败');
      }
    });
  };

  //点击删除
  const onClickDelete = (values) => {
    DetailsStore.deleteAnswer(values).then((response) => {
      if (response && response.status == 200) {
        message.success('删除成功');
        DetailsStore.findAnswerByQuestion(DetailsStore.lastPageQuestionId);
      } else {
        message.error('删除失败');
      }
    });
  };
  //点击评论
  const onClickSaveReply = (values) => {
    formAnswer
      .validateFields()
      .then((val) => {
        DetailsStore.saveAnswer(val).then((response) => {
          if (response && response.status == 201) {
            message.success('评论发表成功');
            DetailsStore.findAnswerByQuestion(DetailsStore.lastPageQuestionId);
            //重置表单
            formAnswer.resetFields();
          } else {
            message.error('评论发表失败');
          }
        });
      })
      .catch(() => {
        message.error('评论发表失败');
      });
  };

  return (
    <ConfigProvider>
      <Card style={{ height: window.innerHeight - 120 }} bordered>
        {OptrightStore.hasRight(umid, 'SYS110') &&
          <Link
            to={{
              pathname: `./Gzwtdj`,
            }}
          >
            <ArrowLeftOutlined
              style={{ fontSize: 25 }}
            />
          </Link>
        }
        <Card style={{ margin: '0 12' }}>
          <Col>
            <Row>
              <Col style={{ fontSize: 25 }} span={20}>
                <div style={{ display: 'inline-block', margin: 5 }}>
                  {DetailsStore.questionDataOne['title']}
                </div>
              </Col>
              <Col span={4}>
                {OptrightStore.hasRight(umid, 'SYS102') && (
                  <Button
                    type="default"
                    style={{ float: 'right', marginRight: 20 }}
                    onClick={() => {
                      setHiddenConmmet(false);
                      //设置隐藏评论区域所有输入框
                      var evenments = document.getElementsByClassName('reply_class');
                      for (var a = 0; a < evenments.length; a++) {
                        evenments[a].style.display = 'none';
                      }
                      formAnswer.resetFields();
                    }}
                  >
                    我要回答
                  </Button>
                )}
              </Col>
            </Row>
            <Row>
              <Col style={{ fontSize: 15 }} span={24}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {DetailsStore.questionDataOne['content']}
              </Col>
            </Row>
          </Col>
        </Card>

        <Card >
          <Card
            hidden={DetailsStore.answerDataY['content'] != null ? false : true}
            style={{
              backgroundColor: '#D8D8D8',
              padding: '5px 12px 5px 12px',
              borderTop: '2px solid	#00FFFF',
              borderBottom: '2px solid	#00FFFF',
              margin: '12 20 12 20',
            }}
          >
            <Col>
              <Row>
                <Col span={20} style={{ fontSize: 14, fontWeight: 3 }}>
                  <span>{DetailsStore.answerDataY['mc']}</span>
                  &nbsp;&nbsp;
                  <span>{DetailsStore.answerDataY['astime']}</span>
                </Col>
                <Col span={4}>
                  <Button
                    size="small"
                    type="default"
                    danger
                    style={{ float: 'right', border: '1 solid red' }}
                  >
                    标准答案
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={24}>{DetailsStore.answerDataY['content']}</Col>
              </Row>
            </Col>
          </Card>
          <Card>
            <List
              rowKey={'id'}
              pagination={{
                pageSize: 50,
                onChange: () => {
                  //设置隐藏评论区域所有回复内容
                  var evenments = document.getElementsByClassName('reply-div-pinglun');
                  for (var a = 0; a < evenments.length; a++) {
                    evenments[a].style.display = 'none';
                  }
                },
              }}
              dataSource={DetailsStore.answerByQuestionData}
              renderItem={(item) => (
                <List.Item style={{ paddingBottom: 5, paddingTop: 5 }}>
                  <div style={{ width: '100%', marginLeft: 20, marginRight: 20 }}>
                    <Col>
                      <Row>
                        <Col span={20} style={{ color: 'red' }}>
                          {item.mc}:
                        </Col>
                        <Col span={4}>
                          {OptrightStore.hasRight(umid, 'SYS104') &&
                            <Button
                              size="small"
                              type="default"
                              style={{ float: 'right' }}
                              onClick={() =>
                                onClickSetY({ id: item.id, questionId: item.questionId })
                              }
                            >
                              设置为标准答案
                            </Button>
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <span>{item.content}</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                          <span style={{ float: 'right' }}>
                            <span>{item.astime}</span>
                            <span>
                              {OptrightStore.hasRight(umid, 'SYS105') &&
                                <Button
                                  hidden={currentUser.id === item.yhId ? false : true}
                                  type="text"
                                  style={{ color: 'blue' }}
                                  onClick={() => onClickDelete({ index: item.index, id: null })}
                                >
                                  删除
                                </Button>
                              }
                              {OptrightStore.hasRight(umid, 'SYS106') &&

                                <Button
                                  type="text"
                                  style={{ color: 'blue' }}
                                  onClick={() => {
                                    formAnswer.resetFields();
                                    // setYhmcReply('请输入');
                                    formAnswer.setFieldsValue({ index: item.index, aswid: item.id });

                                    //点击主评论的回复(number),展开评论回复
                                    if (document.getElementById(item.id).style.display === 'none') {
                                      document.getElementById(item.id).style.display = 'inline-block';
                                      //设置隐藏所有输入框
                                      var evenments = document.getElementsByClassName('reply_class');
                                      for (var a = 0; a < evenments.length; a++) {
                                        evenments[a].style.display = 'none';
                                      }
                                      //展开当前的回复区域的输入框
                                      // document.getElementById('reply_' + item.id).style.display = 'block';
                                    } else {
                                      document.getElementById(item.id).style.display = 'none';
                                    }
                                  }}
                                >
                                  评论({item.replyList.length})
                                </Button>
                              }
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </Col>

                    <div
                      className="reply-div-pinglun"
                      id={item.id}
                      style={{
                        backgroundColor: 'rgb(248,248,248)',
                        display: 'none',
                        float: 'right',
                        clear: 'right',
                        width: '80%',
                        margin: 10,
                      }}
                    >
                      <List
                        rowKey={'id'}
                        dataSource={item.replyList}
                        renderItem={(reply) => (
                          <Col
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 5,
                              borderBottom: '2px solid 	#C8C8C8',
                            }}
                          >
                            <Row>
                              {OptrightStore.hasRight(umid, 'SYS109') &&
                                <Col span={20}>
                                  {reply.aswid === item.id ? (
                                    <span style={{ color: 'red' }}>{reply.mc}：</span>
                                  ) : (
                                    <span>
                                      <span style={{ color: 'red' }}>{reply.mc}</span>
                                      <span>
                                        &nbsp;回复&nbsp;&nbsp;
                                        <span style={{ color: 'red' }}>{reply.replyYhMc}：</span>
                                      </span>
                                    </span>
                                  )}
                                </Col>
                              }
                              <Col span={4}>
                                {OptrightStore.hasRight(umid, 'SYS104') &&
                                  <Button
                                    size="small"
                                    type="default"
                                    style={{ float: 'right' }}
                                    onClick={() =>
                                      onClickSetY({ id: reply.id, questionId: reply.questionId })
                                    }
                                  >
                                    设置为标准答案
                                  </Button>
                                }
                              </Col>
                            </Row>
                            <Row>
                              <Col span={24}>{reply.content}</Col>
                            </Row>
                            <Row>
                              <Col span={12}></Col>
                              <Col span={12}>
                                <span style={{ display: 'inline-block', float: 'right' }}>
                                  <span>{reply.astime} </span>
                                  {OptrightStore.hasRight(umid, 'SYS105') &&
                                    <Button
                                      hidden={currentUser.id === reply.yhId ? false : true}
                                      type="text"
                                      style={{ color: 'blue' }}
                                      onClick={() => onClickDelete({ index: null, id: reply.id })}
                                    >
                                      删除
                                    </Button>
                                  }
                                  {OptrightStore.hasRight(umid, 'SYS109') &&
                                    <Button
                                      type="text"
                                      style={{ color: 'blue' }}
                                      onClick={() => {
                                        formAnswer.resetFields();
                                        formAnswer.setFieldsValue({
                                          index: reply.index,
                                          aswid: reply.id,
                                        });
                                        setHiddenConmmet(true);
                                        var evenments =
                                          document.getElementsByClassName('reply_class');
                                        for (var a = 0; a < evenments.length; a++) {
                                          evenments[a].style.display = 'none';
                                        }
                                        document.getElementById('reply_' + item.id).style.display =
                                          'block';
                                        setYhmcReply(reply.mc);
                                      }}
                                    >
                                      回复
                                    </Button>
                                  }
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        )}
                        footer={
                          <div>
                            <div style={{ height: 32 }}>
                              <div style={{ display: 'inline-block', float: 'right' }}>
                                {OptrightStore.hasRight(umid, 'SYS108') &&
                                  <Button
                                    style={{ float: 'right', marginRight: 30 }}
                                    onClick={() => {
                                      formAnswer.resetFields();
                                      formAnswer.setFieldsValue({
                                        index: item.index,
                                        aswid: item.id,
                                      });

                                      setYhmcReply('请输入');
                                      setHiddenConmmet(true);
                                      var evenments = document.getElementsByClassName('reply_class');
                                      for (var a = 0; a < evenments.length; a++) {
                                        evenments[a].style.display = 'none';
                                      }
                                      document.getElementById('reply_' + item.id).style.display =
                                        'block';
                                    }}
                                    type="default"
                                  >
                                    我要评论
                                  </Button>
                                }
                              </div>
                            </div>
                            <div
                              id={'reply_' + item.id}
                              className="reply_class"
                              style={{ display: 'none', height: 'auto' }}
                            >
                              <Comment
                                style={{
                                  marginBottom: 0,
                                  marginRight: '15%',
                                  marginLeft: '15%',
                                  width: 700,
                                }}
                                content={
                                  <Form form={formAnswer} name="Formreply">
                                    <Col>
                                      <Row hidden>
                                        <Col>
                                          <Form.Item
                                            label="回答的id,回答的是哪条评论就取哪条评论的id"
                                            name="aswid"
                                          >
                                            <Input />
                                          </Form.Item>
                                        </Col>
                                        <Col>
                                          <Form.Item
                                            name="index"
                                          >
                                            <Input />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col>
                                          <Form.Item
                                            name="content"
                                            required
                                            rules={[
                                              {
                                                required: true,
                                                message: '请输入评论内容',
                                                whitespace: true,
                                              },
                                            ]}
                                          >
                                            <Input.TextArea
                                              style={{
                                                marginBottom: '5',
                                                border: '1px solid #cbe6ff',
                                                width: 700,
                                              }}
                                              autoSize={{ minRows: 4, maxRows: 4 }}
                                              placeholder={
                                                yhmcReply != '请输入'
                                                  ? '  回复  ' + yhmcReply + '：'
                                                  : '  ' + yhmcReply
                                              }
                                              onFocus={() => {
                                                if (
                                                  formAnswer.getFieldValue('aswid') === undefined
                                                ) {
                                                  formAnswer.setFieldsValue({
                                                    index: item.index,
                                                    aswid: item.id,
                                                  });
                                                }
                                              }}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col span={20}></Col>
                                        <Col span={4}>
                                          <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                                            {OptrightStore.hasRight(umid, 'SYS107') &&
                                              <Button type="primary" onClick={onClickSaveReply}>
                                                发表
                                              </Button>
                                            }
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Form>
                                }
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </List.Item>
              )}
              footer={
                <div hidden={hiddenComment}>
                  <Comment
                    style={{
                      marginBottom: 0,
                      marginRight: '15%',
                      marginLeft: '15%',
                      width: 700,
                    }}
                    content={
                      <Form form={formAnswer} name="Formreply">
                        <Col>
                          <Row hidden>
                            <Col>
                              <Form.Item
                                label="回答的id,回答的是哪条评论就取哪条评论的id"
                                name="aswid"
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item
                                name="index"
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Form.Item
                                name="content"
                                required
                                rules={[
                                  {
                                    required: true,
                                    message: '请输入评论内容',
                                    whitespace: true,
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  style={{
                                    marginBottom: '5',
                                    border: '1px solid #cbe6ff',
                                    width: 700,
                                  }}
                                  autoSize={{ minRows: 4, maxRows: 4 }}
                                  placeholder={'请输入...'}
                                  onFocus={() => {
                                    formAnswer.setFieldsValue({
                                      index:
                                        DetailsStore.answerByQuestionData.length === 0
                                          ? 1
                                          : DetailsStore.answerByQuestionData['lastItem']['index'] +
                                          1,
                                      aswid: null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={20}></Col>
                            <Col span={4}>
                              <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                                {OptrightStore.hasRight(umid, 'SYS107') &&
                                  <Button type="primary" onClick={onClickSaveReply}>
                                    发表
                                  </Button>
                                }
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Form>
                    }
                  />
                </div>
              }
            />
          </Card>
        </Card>
      </Card>
    </ConfigProvider>
  );
});

export default Details;
