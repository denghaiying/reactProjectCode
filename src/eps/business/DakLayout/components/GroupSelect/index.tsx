/* eslint-disable @typescript-eslint/no-unused-expressions */
import EpsTreeStore from '@/eps/components/panel/EpsPanel2/EpsTreeStore';
import dakoptService from '@/pages/dagl/Dagl/AppraisaManage/dakoptService';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip, Form } from 'antd';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';

export interface GroupSelectProps {
  archParams: Record<string, unknown>;
  archStore: Record<string, unknown>;
  loadData: (params) => void;
  ktable: Record<string, unknown>;
  yhid: string;
}

// DAK0052   自定义分组设置

const GroupSelect = observer((props: GroupSelectProps) => {
  const getFzlx = (data: string) => {
    let treeBt = '';
    switch (data) {
      case 'DAK0007': // 自定义分组
        treeBt = 'Z';
        break;
      case 'DAK0008': // 固定分组
        treeBt = 'G';
        break; // 归档部门分组
      case 'DAK0032':
        treeBt = 'B';
        break;
      case 'DAK0034': // 盒号分组
        treeBt = 'H';
        break;
      case 'DAK0033': // 实体分类分组
        treeBt = 'F';
        break;
      case 'DAK0036': // 归档分组
        treeBt = 'D';
        break;
      case 'TMZTFZ01': // 鉴定分组
        treeBt = 'T';
        break;
      case 'DAK0107': // 导入分组
        treeBt = 'R';
        break;
      default:
        treeBt = 'F'; // 分组
    }
    return treeBt;
  };

  const gsStore = useLocalObservable(() => ({
    options: [],
    optValue: '',
    mbid: '',
    defaultValue: '',
    async getData() {
      const dakopt = props.archParams.tmzt
        ? await dakoptService.findAll({
            tmzt: props.archParams.tmzt,
            isadd: 'N',
            fz: 'DAKFZ001',
            dakid: props.archParams.dakid,
            daklx: '01',
            fid: '1',
          })
        : [];
      const listData = Array.isArray(dakopt)
        ? dakopt.map((item) => ({ label: item.name, value: item.optcode }))
        : [];
      const defVal = localStorage.getItem(
        `STORAGE_FZLX-${window.btoa(props.archParams?.dakid)}-${window.btoa(
          props.archParams?.tmzt,
        )}`,
      );
      runInAction(() => {
        this.options = listData;
        this.defaultValue = defVal ? window.atob(defVal) : listData[0];
      });
    },
  }));

  useEffect(() => {
    gsStore.getData();
    const optValue = localStorage.getItem(
      `STORAGE_FZLX-${window.btoa(props.archParams?.dakid)}-${window.btoa(
        props.archParams?.tmzt,
      )}`,
    );
    const mbid = localStorage.getItem(
      `STORAGE_FZLX_MBID-${window.btoa(props.archParams?.dakid)}-${window.btoa(
        props.archParams?.tmzt,
      )}`,
    );
    optValue &&
      runInAction(() => {
        gsStore.optValue = window.atob(optValue);
        gsStore.mbid = window.atob(mbid);
      });
  }, []);

  useEffect(() => {
    props.loadData({
      _key: 'root',
      pageIndex: 0,
      pageSize: 999,
      sortField: '',
      sortOrder: '',
      psql: '((1=1))',
      dakid: props.archParams?.dakid,
      tmzt: props.archParams?.tmzt,
      lx: props.archParams?.tmzt,
      bmc: props.archParams?.bmc,
      mbid: props.ktable?.mbid || gsStore.mbid,
      fzlx: getFzlx(gsStore.optValue),
      // node: 'root',
      yhid: props.yhid,
    });
    gsStore.optValue &&
      localStorage.setItem(
        `STORAGE_FZLX-${window.btoa(props.archParams?.dakid)}-${window.btoa(
          props.archParams?.tmzt,
        )}`,
        window.btoa(gsStore.optValue),
      );
    props.ktable?.mbid &&
      localStorage.setItem(
        `STORAGE_FZLX_MBID-${window.btoa(
          props.archParams?.dakid,
        )}-${window.btoa(props.archParams?.tmzt)}`,
        window.btoa(props.ktable?.mbid),
      );
  }, [gsStore.optValue]);

  const defVal = localStorage.getItem(
    `STORAGE_FZLX-${window.btoa(props.archParams?.dakid)}-${window.btoa(
      props.archParams?.tmzt,
    )}`,
  );

  return (
    <>
      <Form
        initialValues={{ groupSelect: defVal ? window.atob(defVal) : '' }}
        layout="inline"
        style={{ minWidth: '220px' }}
      >
        <Form.Item
          name="groupSelect"
          style={{
            width: gsStore.optValue === 'DAK0007' ? '172px' : '208px',
            marginRight: '1px',
          }}
        >
          <Select
            // labelInValue
            // defaultValue={gsStore.optValue}
            options={gsStore.options}
            style={{ width: '100%' }}
            onChange={(val: string) => {
              runInAction(() => {
                gsStore.optValue = val;
              });
            }}
          ></Select>
        </Form.Item>
        <Form.Item
          style={{
            width: gsStore.optValue === 'DAK0007' ? '32px' : '0',
            marginRight: gsStore.optValue === 'DAK0007' ? '5px' : '0px',
          }}
        >
          <Tooltip placement="bottom" title={'自定义分组设置'}>
            <Button
              icon={<SettingOutlined />}
              style={{
                // height: '31px',
                display: gsStore.optValue === 'DAK0007' ? 'block' : 'none',
              }}
              onClick={() => {
                props.archStore.doArchAction({ optcode: 'DAK0052' });
              }}
            />
          </Tooltip>
        </Form.Item>
      </Form>
    </>
  );
});

export default GroupSelect;
