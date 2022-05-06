import React, { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  Space,
  Row,
  Col,
  Transfer,
  Select,
  Tag,
  Input,
  Modal,
  notification,
  Tabs,
  Skeleton,
  Menu,
} from 'antd';
import PropTypes from 'prop-types';
import SvgIcon from '@/components/SvgIcon';
import EmptyData from '@/components/EmptyData';
import qs from 'qs';
import fetch from '../../utils/fetch';
import WflwLog from './WflwLog';
import { useIntl } from 'umi';
import './WflwLog.less';

const allButtons = [
  'submit',
  'return',
  'retract',
  'transmit',
  'reject',
  'logview',
];
const WflwButtons = (props) => {
  const {
    wfid,
    wfinst,
    type,
    showmode,
    signcomment,
    onBeforeAction,
    onAfterAction,
    ...oprops
  } = props;
  const intl = useIntl();
  const formatMessage = intl.formatMessage;
  const baseurl = '/eps/workflow/wf';
  const [curWfdef, setCurWfdef] = useState(null);
  const [comment, setComment] = useState(signcomment);
  const [nprocs, setNprocs] = useState([]);
  const [curPro, setCurPro] = useState(null);
  const [curNUsrs, setCurNUsrs] = useState([]);
  const [curNUsrInfo, setCurNUsrInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dvisible, setDvisible] = useState(false);
  const [cBtn, setCBtn] = useState('submit');
  const [lvVisible, setLvVisible] = useState(false);

  useEffect(() => {
    if (wfid) {
      setComment(null);
      setCurNUsrs([]);
      setCurNUsrInfo(null);
      fetch
        .get(`/eps/workflow/wfdy/queryWfdefForId?${qs.stringify({ wfid })}`)
        .then((res) => {
          if (res.status === 200) {
            setCurWfdef(res.data);
          }
        });
    }
  }, [wfid]);

  useEffect(() => {
    setComment(signcomment);
  }, [signcomment]);

  const doBeforeAction = async (action) => {
    if (onBeforeAction) {
      if (!(await onBeforeAction(action))) {
        return false;
      }
    }
    if (action !== 'viewlog') {
      const canAction = await fetch.get(`${baseurl}/canaction/${wfinst}`, {
        params: { action },
      });

      return canAction && canAction.data;
    }
    return true;
  };

  const getNextProcs = (awfinst, action) => {
    fetch
      .get(`${baseurl}/nproc/${awfinst}`, { params: { action } })
      .then((res) => {
        if (res.status === 200) {
          setNprocs(res.data);
          if (res.data && res.data.length > 0) {
            setCurPro(res.data[0].code);
            const users = res.data[0].users;
            setCurNUsrs(users);
            if (users) {
              setCurNUsrInfo(
                users.filter((u) => u.mode === 'A' || u.mode === 'B'),
              );
            } else {
              setCurNUsrInfo(null);
            }
          } else {
            setCurPro(null);
            setCurNUsrs([]);
            setCurNUsrInfo(null);
          }
        }
      });
  };

  const doSelectProc = (v) => {
    setCurPro(v);
    nprocs.some((p) => {
      if (p.code === v) {
        setCurNUsrs(p.users);
        return true;
      }
      return false;
    });
  };

  const getAction = (bname) => {
    return `wf${bname
      .toLowerCase()
      .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;
  };
  const onButtonClick = (bname) => {
    if (!curWfdef) {
      return;
    }
    if (bname !== 'logview') {
      setCBtn(bname);
      setCurNUsrs([]);
      setCurNUsrInfo(null);
      const wfaction = getAction(bname);
      doBeforeAction(wfaction).then((r) => {
        if (r) {
          if (curWfdef && curWfdef.bdms !== 'Y') {
            getNextProcs(wfinst, wfaction);
            setLoading(false);
            setDvisible(true);
          } else {
            doSubmit(wfaction);
          }
        }
      });
    } else {
      doBeforeAction('viewlog').then((r) => {
        r && setLvVisible(true);
      });
    }
  };

  const doSubmit = async (action) => {
    if (!curWfdef) {
      return;
    }
    const p = { comment };
    if (!curWfdef.bdms || curWfdef.bdms !== 'Y') {
      const op = {
        nwpid: curPro,
        nusrids: curNUsrInfo ? curNUsrInfo.map((o) => o.id).join(',') : '',
        nusrnames: curNUsrInfo ? curNUsrInfo.map((o) => o.name).join(',') : '',
      };
      p.nextinfo = op;
    }
    const res = await fetch.patch(`${baseurl}/${wfinst}/${action}`, p);
    if (res.status === 201) {
      if (onAfterAction) {
        onAfterAction({ action, ...p });
        setComment(null);
        setCurNUsrs([]);
        setCurNUsrInfo(null);
      }
    }
  };

  let BTNS;
  switch (showmode) {
    case 'dropdown':
      BTNS = (
        <>
          {/* icon={<SvgIcon type={`iconwflw${t}`} />} */}
          <Button
            type="primary"
            onClick={() => onButtonClick('submit')}
            style={{ marginRight: 2 }}
          >
            提交
          </Button>
          <Dropdown.Button
            onClick={() => onButtonClick('return')}
            overlay={
              <Menu
                onClick={(item, key) => {
                  onButtonClick(item.key);
                }}
              >
                {allButtons
                  .filter((t) => t !== 'submit' && t !== 'return')
                  .map((t) => (
                    <Menu.Item key={t}>
                      {formatMessage({ id: `e9.wflw.btn.${t}` })}
                    </Menu.Item>
                  ))}
              </Menu>
            }
            {...oprops}
          >
            {formatMessage({ id: 'e9.wflw.btn.return' })}
          </Dropdown.Button>
        </>
      );
      break;
    case 'colopt':
      BTNS = (
        <div>
          {type.map((t) => (
            <a
              href="javascript:void(0)"
              style={{ paddingLeft: 2 }}
              key={t}
              type="primary"
              onClick={() => onButtonClick(t)}
            >
              {formatMessage({ id: `e9.wflw.btn.${t}` })}
            </a>
          ))}
        </div>
      );
      break;
    default:
      BTNS = (
        //
        <div>
          {type.map((t) => (
            <Button
              style={{ marginRight: 0 }}
              key={t}
              type="secondary"
              onClick={() => onButtonClick(t)}
            >
              {formatMessage({ id: `e9.wflw.btn.${t}` })}
            </Button>
          ))}
        </div>
      );
  }

  const getDataSource = (d) => {
    return d
      ? d.map((v) => {
          v.key = v.id;
          v.title = v.name;
          v.disabled = v.mode === 'B';
          return v;
        })
      : [];
  };

  const trfOnChange = (nextTargetKeys) => {
    if (!nextTargetKeys || nextTargetKeys.length < 1) {
      setCurNUsrInfo;
    }
    setCurNUsrInfo(curNUsrs.filter((item) => nextTargetKeys.includes(item.id)));
  };
  return (
    <span>
      {BTNS}
      <Modal
        centered
        //  ##zIndex={1009}
        title={
          <span>
            <SvgIcon
              type="iconinquiry"
              size="large"
              style={{ marginRight: '10px' }}
            />
            {`${formatMessage({ id: `e9.wflw.btn.${cBtn}` })}${formatMessage({
              id: 'e9.info.confirm',
            })}`}
          </span>
        }
        onOk={() => {
          if (!curPro) {
            notification.open({
              message: formatMessage({ id: 'e9.info.info' }),
              description: `${formatMessage({
                id: 'e9.wflw.btn.info.nextstep',
              })} ${formatMessage({ id: 'e9.info.data.mustsel' })}`,
              onClick: () => {},
            });
            return;
          }
          if (
            curPro !== 'ZZZZ' &&
            curPro !== 'ZZZY' &&
            (!curNUsrInfo || curNUsrInfo.length < 1)
          ) {
            notification.open({
              message: formatMessage({ id: 'e9.info.info' }),
              description: `${formatMessage({
                id: 'e9.wflw.btn.info.nextoptr',
              })} ${formatMessage({ id: 'e9.info.data.mustsel' })}`,
              onClick: () => {},
            });
            return;
          }
          setLoading(true);
          doSubmit(getAction(cBtn)).then(() => {
            setLoading(false);
            setDvisible(false);
          });
        }}
        width="75vw"
        // height='95vh'
        onCancel={() => {
          setDvisible(false);
        }}
        okProps={{ loading }}
        visible={dvisible}
      >
        <span role="grid">
          <Row>
            {/* <Col span={2} offset={1}>{formatMessage({ id: 'e9.wflw.btn.info.nextstep' })}</Col> */}
            <Col offset={1} span={23}>
              {formatMessage({ id: 'e9.wflw.btn.info.nextstep' })}{' '}
              <Select
                value={curPro}
                onChange={(v) => doSelectProc(v)}
                style={{ marginLeft: 20, maxWidth: '80%', width: '300px' }}
              >
                {nprocs &&
                  nprocs.map((d) => (
                    <Select.Option value={d.code} key={d.code}>
                      {d.label}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col span={2} offset={1}>
              {formatMessage({ id: 'e9.wflw.btn.info.nextoptr' })}
            </Col>
            <Col offset={1} span={20}>
              {curNUsrInfo &&
                curNUsrInfo.map((u) => (
                  <Tag color="blue" key={u.code}>
                    {u.name}
                  </Tag>
                ))}
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col offset={1} span={23}>
              <Transfer
                listStyle={{ width: '80%', height: '55vh' }}
                showSearch
                targetKeys={curNUsrInfo ? curNUsrInfo.map((v) => v.id) : []}
                dataSource={getDataSource(curNUsrs)}
                onChange={trfOnChange}
                render={(item) => item.title}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col offset={1}>
              {formatMessage({ id: 'e9.wflw.log.info.signature' })}
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col offset={1} span={23}>
              <Input.TextArea
                style={{ width: '100%' }}
                aria-label="TextArea"
                value={comment}
                onChange={(v) => {
                  const vv = v.target.value;
                  setComment(vv);
                }}
              />
            </Col>
          </Row>
        </span>
      </Modal>
      <Modal
        centered
        visible={lvVisible}
        footer={false}
        onCancel={() => setLvVisible(false)}
        width={1000}
      >
        <WflwLog
          wfid={wfid}
          wfinst={wfinst}
          type={['graph', 'status']}
          readonly
          tabprops={{ defaultActiveKey: 'status' }}
        />
      </Modal>
    </span>
  );
};

WflwButtons.prototype = {
  wfid: PropTypes.string,
  wfinst: PropTypes.string,
  type: PropTypes.arrayOf(allButtons), // 'batchsubmit'
  showmode: PropTypes.oneOf(['tile', 'dropdown', 'colopt']),
  signcomment: PropTypes.string,
  onBeforeAction: PropTypes.func,
  onAfterAction: PropTypes.func,
};
WflwButtons.defaultProps = {
  showmode: 'dropdown',
};

export default WflwButtons;
