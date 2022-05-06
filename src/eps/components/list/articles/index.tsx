import {
  CloseOutlined,
  LikeOutlined,
  LoadingOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Affix,
  Button,
  Card,
  Col,
  Form,
  List,
  message,
  Row,
  Select,
  Tag,
} from 'antd';
import { runInAction } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import { FC, useEffect } from 'react';
import React from 'react';
import TagSelect from './components/TagSelect';
import DakcartService from './DakcartService';
import styles from './style.less';
import ArticleListContent from '@/pages/account/center/components/ArticleListContent';
import { ListItemDataType } from '@/pages/account/center/data';

const { Option } = Select;
const FormItem = Form.Item;

import AppraisaApplySelStore from '@/stores/appraisa/AppraisaApplySelStore';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
const SelectDialStore = new AppraisaApplySelStore(``, true, true);

const Articles = observer((props) => {
  const {
    params,
    callback,
    closeModal,
    umid = 'DAGL023',
    extendParams = {},
  } = props;
  const [form] = Form.useForm();

  const store = useLocalStore(() => ({
    dakid: '',
    tmzt: '',
    ids: '',
    list: [],
    async initCarts(params) {
      const res = await DakcartService.findDakcarts(params);
      debugger;
      runInAction(() => {
        if (res.success) this.list = res.results;
      });
    },
    async remove(params) {
      const res = await DakcartService.deleteDakCarts(params);
      if (res) {
        this.initCarts(params);
        props.refreshPage();
      }
    },

    async clear() {
      const keys = {};
      keys['dakid'] = extendParams.dakid;
      keys['tmzt'] = extendParams.tmzt;
      keys['lx'] = extendParams.lx;
      keys['bmc'] = extendParams.bmc;

      keys['ids'] = store.list.map((item) => item.TMID).join(',');

      const res = await DakcartService.clearDakCarts(keys);
      if (res) {
        this.initCarts(params);
        props.refreshPage();
      }
    },

    // begin ******************** 以下是事件响应
    async doSubmit(autosubmit: boolean) {
      //  const { ...keys } = params;
      let keys = {};
      const curdate = moment();
      debugger;
      // keys["remark"] = SelectDialStore.saveParams.remark || '';
      keys['autosubmit'] = autosubmit || false;
      keys['dwid'] = SysStore.getCurrentCmp().id;
      keys['bmid'] = SysStore.getCurrentUser().bmid;
      keys['title'] = `${extendParams.spName}申请单-${
        extendParams.mc
      }-${curdate.format('YYYY')}${curdate.format('MM')}${curdate.format(
        'DD',
      )}`;
      keys['dakid'] = extendParams.dakid;
      keys['tmzt'] = extendParams.tmzt;
      keys['lx'] = extendParams.lx;
      keys['bmc'] = extendParams.bmc;

      keys['ids'] = store.list.map((item) => item.TMID).join(',');
      keys[extendParams.spCode] = '审批中';
      SelectDialStore.addTm(keys).then((res) => {
        if (res && (res.success || res.wfid)) {
          callback && callback(res);
          message.info({
            type: 'success',
            content: `${extendParams.spName}申请单提交成功`,
          });
          this.clear();
          //props.closeModal()
        }
      });
    },
  }));

  useEffect(() => {
    if (extendParams && extendParams.dakid) {
      SelectDialStore.setUrl(`/eps/control/main/${extendParams.spUrl}`);
      store.initCarts(extendParams);
    }
  }, [extendParams.dakid]);

  return (
    <>
      <Card
        style={{ marginTop: 0 }}
        bordered={false}
        bodyStyle={{ padding: '5px' }}
      >
        <List<ListItemDataType>
          size="large"
          //  loading={loading}
          rowKey="id"
          itemLayout="vertical"
          //   loadMore={loadMoreDom}
          dataSource={store.list}
          renderItem={(item) => (
            <List.Item
              key={item.TMID}
              actions={[
                <span style={{ color: '#ff4d4f' }}>
                  <CloseOutlined
                    twoToneColor="#eb2f96"
                    onClick={() =>
                      store.remove({
                        tmid: item.TMID,
                        dakid: item.DAKID,
                        tmzt: item.TMZT,
                        bmc: item.BMC,
                      })
                    }
                    style={{ color: '#ff4d4f', marginRight: 8 }}
                  />
                  移除
                </span>,
              ]}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    【题名】：{item.TM}
                  </a>
                }
                description={
                  <span>
                    <Tag>【档号】：{item.DH}</Tag>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      <Affix style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
        <Button type="primary" onClick={store.doSubmit}>
          提交
        </Button>
        <Button onClick={store.clear}>清空</Button>
      </Affix>
    </>
  );
});

export default Articles;
