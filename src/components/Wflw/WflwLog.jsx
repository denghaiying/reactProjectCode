import React, { useEffect, useState } from 'react';
import { Tabs, Collapse, Input, Row, Col, Avatar, List, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import fetch from '../../utils/fetch';
import { useIntl } from 'umi';
import ArrowTopPng from '@/styles/assets/img/arrow-top-color.png';
import UserLogo from '@/styles/img/user-logo.png';
import {
  wflog_remark_div,
  loglist,
  graphlist,
  statuslist,
} from './WflwLog.less';

const WflwLog = (props) => {
  const {
    wfid,
    wfinst,
    type,
    readonly,
    value,
    onChange,
    tabAddBefore,
    tabAddAfter,
    tabprops = {},
    ...oprops
  } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const [logs, setLogs] = useState([]);
  const [sv, setSv] = useState(value);

  useEffect(() => {
    fetch.get(`/eps/workflow/wf/logs/${wfinst}`).then((res) => {
      if (res.status === 200) {
        // const ld = (res.data || []).sort((a, b) => (a.wpid > b.wpid ? -1 : 1));
        // console.log(ld);
        setLogs(res.data || []);
      }
    });
  }, [wfinst]);

  useEffect(() => {
    setSv(value);
  }, [value]);

  const onSvChange = (v) => {
    const vv = v.target.value;
    setSv(vv);
    if (onChange) {
      onChange(vv);
    }
  };

  // eslint-disable-next-line consistent-return
  const getStateName = (state) => {
    // (log.state === '0' && '新建') || (log.state === '1' && '提交') || (log.state === '2' && '撤回') || (log.state === '3' && '退回')
    switch (state) {
      case '0':
        return '新建';
      case '1':
        return '提交';
      case '2':
        return '撤回';
      case '3':
        return '退回';
      case '4':
        return '转交';
      case '5':
        return '会签';
      case '90':
        return '否决';
      case '91':
        return '完成';
      default:
    }
  };

  return (
    <span {...oprops}>
      {!readonly && (
        <Collapse className={wflog_remark_div}>
          <Collapse.Panel
            header={
              <span style={{ color: 'rgb(160, 160, 160)' }}>
                {formatMessage({ id: 'e9.wflw.log.info.signature' })}
              </span>
            }
          >
            <Input.TextArea
              style={{ width: '100%' }}
              aria-label="TextArea"
              value={sv}
              onChange={onSvChange}
            />
          </Collapse.Panel>
        </Collapse>
      )}
      <Tabs {...tabprops}>
        {tabAddBefore}
        {type.includes('comment') && (
          <Tabs.TabPane
            tab={formatMessage({ id: 'e9.wflw.log.info.comment' })}
            key="comment"
          >
            <List
              dataSource={(logs || []).filter((l) => l.wpid !== '0000')}
              renderItem={(log) => (
                <List.Item key={log.logno || log.wfinst}>
                  <List.Item.Meta
                    avatar={<Avatar size={64} src={UserLogo} />}
                    title={log.title}
                    description={
                      <div>
                        {!log.aend &&
                          log.wpid !== 'ZZZZ' &&
                          log.wpid !== 'ZZZY' && (
                            <p style={{ margin: '12px 0' }}>{`${formatMessage({
                              id: 'e9.wflw.log.info.waiter',
                            })}: ${log.awaiter}`}</p>
                          )}
                        {log.aend && (
                          <p style={{ margin: '12px 0' }}>{`${formatMessage({
                            id: 'e9.wflw.log.info.receiver',
                          })}: ${log.ahandler}`}</p>
                        )}
                        {log.lcyj && (
                          <p style={{ margin: '12px 0' }}>
                            {(log.lcyj !== 'null' && log.lcyj) || ''}
                          </p>
                        )}
                        <p style={{ margin: '12px 0' }}>
                          {log.aend ||
                            (log.wpid !== 'ZZZZ' && log.wpid !== 'ZZZY' && (
                              <Spin indicator={<LoadingOutlined spin />} />
                            )) ||
                            ''}{' '}
                          {` ${log.wpname}`}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>
        )}
        {type.includes('graph') && (
          <Tabs.TabPane
            tab={formatMessage({ id: 'e9.wflw.log.info.graph' })}
            key="graph"
          >
            <div className={graphlist}>
              <div className="graphlist_title">
                <span className="graphlist_label"></span>
                <span>流程：</span>
              </div>
              <div className="graphlist_intro">
                {/* <Button type="normal"><Icon type="set" />智能预测</Button> */}
                <span
                  className="graphlist_node-icon"
                  style={{ background: '#148577' }}
                />
                已经过节点
                <span
                  className="graphlist_node-icon"
                  style={{ background: '#8DDE04' }}
                />
                当前节点
                <span
                  className="graphlist_node-icon"
                  style={{ background: '#30B0D5' }}
                />
                未经过节点
                <span
                  className="iconfont icon-arrowtop graphlist_right-arrow"
                  style={{ color: '#8DDE04' }}
                />
                已经过出口
                <span
                  className="iconfont icon-arrowtop graphlist_right-arrow"
                  style={{ color: '#DCDCDC' }}
                />
                未经过出口
              </div>
              <div className="graphlist_chart-container">
                <div className="graphlist_group">
                  {logs &&
                    []
                      .concat(logs)
                      .reverse()
                      .map((log, index) => (
                        <div
                          className={`graphlist_cell ${
                            ((log.wpid === '0000' ||
                              log.wpid === 'ZZZZ' ||
                              log.wpid === 'ZZZY' ||
                              index === 0) &&
                              'graphlist_round graphlist_done') ||
                            (log.ahandler && 'graphlist_done') ||
                            'graphlist_doing' ||
                            ''
                          } `}
                          key={log.wpid}
                          style={
                            (log.wpid === 'ZZZZ' && {
                              background: 'rgba(213,139,48,.8)',
                            }) ||
                            (log.wpid === 'ZZZY' && {
                              background: 'rgba(157,56,56,.5)',
                            }) ||
                            {}
                          }
                          title={
                            (log.lcyj &&
                              log.lcyj !== 'null' &&
                              `流程意见：${log.lcyj}`) ||
                            ''
                          }
                        >
                          <div className="graphlist_inner">
                            <span
                              className="iconfont icon-user"
                              style={
                                (log.wpid !== '0000' &&
                                  log.wpid !== 'ZZZZ' &&
                                  log.wpid !== 'ZZZY' && {
                                    color: 'rgba(20, 133, 119, .5)',
                                  }) ||
                                {}
                              }
                            ></span>
                            <span className="graphlist_user">
                              {log.ahandler || log.awaiter}
                            </span>
                            <span
                              className={
                                (log.wpid !== '0000' &&
                                  log.wpid !== 'ZZZZ' &&
                                  log.wpid !== 'ZZZY' &&
                                  'graphlist_job') ||
                                ''
                              }
                            >
                              {log.wpname}
                            </span>
                            {index != logs.length - 1 && (
                              <img
                                src={ArrowTopPng}
                                className="graphlist_arrow"
                                alt=""
                              ></img>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        )}
        {type.includes('status') && (
          <Tabs.TabPane
            tab={formatMessage({ id: 'e9.wflw.log.info.status' })}
            key="status"
          >
            <div className={statuslist}>
              <div className="custom-table">
                <div className="head">
                  <div className="item">
                    <li className="cell"></li>
                    <li className="cell">序号</li>
                    <li className="cell">流程步骤</li>
                    <li className="cell">操作人</li>
                    <li className="cell">操作状态</li>
                    <li className="cell">接收时间</li>
                    <li className="cell">操作时间</li>
                    <li className="cell">流程意见</li>
                  </div>
                </div>
                <div className="body">
                  {logs &&
                    logs.map((log, index) => (
                      <div className="item" key={index}>
                        <li className="cell">
                          <span
                            className="iconfont icon-user"
                            style={{ color: '#999', fontSize: 14 }}
                          ></span>
                        </li>
                        <li className="cell">{index + 1}</li>
                        <li className="cell">{log.wpname}</li>
                        <li className="cell">{log.ahandler || log.awaiter}</li>
                        <li className="cell">{getStateName(log.state)}</li>
                        <li className="cell">{log.pbegin}</li>
                        <li className="cell">{log.aend || ''}</li>
                        <li className="cell">
                          {(log.lcyj !== 'null' && log.lcyj) || ''}
                        </li>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        )}
        {tabAddAfter}
      </Tabs>
    </span>
  );
};

WflwLog.prototype = {
  wfid: PropTypes.string,
  wfinst: PropTypes.string,
  type: PropTypes.arrayOf(['comment', 'graph', 'status']), // 'batchsubmit'
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  tabprops: PropTypes.any,
  tabAddBefore: PropTypes.array,
  tabAddAfter: PropTypes.array,
};
WflwLog.defaultProps = {
  type: ['comment'],
  readonly: true,
};

export default WflwLog;
