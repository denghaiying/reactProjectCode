import { Button, message, Modal, Tooltip } from 'antd';
import React from 'react';
import {
  ExclamationCircleOutlined,
  FileSearchOutlined,
  UnlockOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import YhStore from '@/stores/system/YhStore';
import { EpsTableStore } from '@/eps/components/panel/EpsPanel';
import fetch from '@/utils/fetch';
import { history } from '@@/core/umiExports';
import wdscService from './wdscService';
import { runFunc } from '@/utils/menuUtils';

const { confirm } = Modal;

function HandleWdsc(text, record, index, store: EpsTableStore) {
  console.log('record====', record);
  console.log('store===', store);
  console.log('index====', index);

  async function showPopconfirm() {
    //history.push("/eps/control/main/yh");

    const uid = record.id;
    const rowIndex = index;

    const dakid = record.dakid;
    const tmid = record.tmid;
    //  const dak = Eps.asyncAjax("/eps/control/main/dak/queryForId", {id: dakid}, true);
    //  const dak=wdscService.queryDak(dakid);
    const dakres = await fetch.get(
      `/api/eps/control/main/dak/queryForId?id=` + dakid,
    );
    const dak = dakres.data;

    const mc = dak.mc;
    const bmc = dak.mbc;
    const dakzt = 4;
    const mbid = dak.mbid;
    const key = record.dh;
    const lx = dak.lx;
    const umname = mc + '【 利用 】';
    //  const tmzt=dak.tmzt;
    const params = { dakid, mbid, bmc, tmzt: dakzt, key, lx, umname };

    const paramsTz = {
      umid: record.umid,
      umname: umname,
      path: `/runRfunc/archManage/${dakid}/${dakzt}`,
      dakid,
      mbid,
      bmc,
      tmzt: dakzt,
      key,
      lx,
    };
    runFunc(paramsTz);

    //   history.push({ pathname: `/eps/dagl/archManage/${dakid}/${dakzt}`, query: params  });
  }

  return (
    <Tooltip title="查看">
      <Button
        size="small"
        style={{ fontSize: '12px' }}
        type={'primary'}
        shape="circle"
        icon={<FileSearchOutlined />}
        onClick={showPopconfirm}
      />
    </Tooltip>
  );
}

export default HandleWdsc;
