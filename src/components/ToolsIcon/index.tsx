import { Popover, List, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import fetch from '../../utils/fetch';
import SysStore from '@/stores/system/SysStore';
import { CreditCardOutlined, DownloadOutlined } from '@ant-design/icons';

function ToolsIcon() {
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState<string>();

  const [listData, setListData] = useState<Element[]>([]);
  const [xtgjList, setXtgjList] = useState([]);

  useEffect(() => {
    const queryList = async () => {
      const xtres = await fetch.post(
        `/api/eps/control/main/xt/queryForNoCheckReg`,
      );
      if (!xtres) {
        return;
      }
      const xt = xtres.data;
      const fileGrpid = xt?.filegrpid;
      if (fileGrpid) {
        const response = await fetch.post(
          `/api/eps/wdgl/attachdoc/queryForList?sfzxbb=1&ordersql=N&doctbl=ATTACHDOC&grptbl=DOCGROUP&grpid=${fileGrpid}`,
        );

        if (response.status === 200) {
          //  this.xtgjData = response.data;
          setXtgjList(response.data);
        }
      }
    };
    queryList();
  }, []);

  function cutString(str, len) {
    // length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
      return str;
    }
    let strlen = 0;
    let s = '';
    for (let i = 0; i < str.length; i++) {
      s = s + str.charAt(i);
      if (str.charCodeAt(i) > 128) {
        strlen = strlen + 2;
        if (strlen >= len) {
          return s.substring(0, s.length - 1) + '...';
        }
      } else {
        strlen = strlen + 1;
        if (strlen >= len) {
          return s.substring(0, s.length - 2) + '...';
        }
      }
    }
    return s;
  }

  const getxtgj = () => {
    const uo = xtgjList;
    const sjData = [];
    if (uo.length > 0) {
      for (let i = 0; i < uo.length; i++) {
        let newKey = {};
        newKey = uo[i];
        newKey.shortfilename = cutString(newKey.filename, 16);
        sjData.push(newKey);
      }
      setListData(sjData);
    }
  };

  useEffect(() => {
    console.log('in this ');
    console.log('RightStore.xtgjData', xtgjList);
    getxtgj();
  }, [xtgjList]);

  const downloadFj = (item) => {
    const url =
      '/api/eps/wdgl/attachdoc/download?fileid=' +
      item.fileid +
      '&grpid=' +
      item.grpid +
      '&doctbl= ATTACHDOC&grptbl=DOCGROUP&atdw=' +
      SysStore.getCurrentUser().dwid +
      '&umid=CONTROL0001&mkbh=' +
      null +
      '&downlx=01';
    window.open(url);
  };

  const content = (
    <List
      dataSource={listData}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <Tooltip title={item.filename}> {item.shortfilename}</Tooltip>
            }
          />
          <div>
            <a
              onClick={() => {
                downloadFj(item);
              }}
            >
              <DownloadOutlined />
            </a>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <>
      <Tooltip title="工具箱">
        <Popover content={content} title="工具名称" trigger="click">
          <a>
            <img
              src={require('../../styles/assets/img/icon_tool.png')}
              className="right-img"
              alt=""
            />
          </a>
        </Popover>
      </Tooltip>
    </>
  );
}
export default ToolsIcon;
