import { useEffect, useState, useRef } from 'react';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import DakService from '@/services/base/dak/DakService';
import DwService from '@/services/system/DwService';
import fetch from "@/utils/fetch";
import { observer, useLocalObservable } from 'mobx-react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel2';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { ProfileTwoTone } from "@ant-design/icons";
import { Button, Modal, message, Input, Table, Spin } from 'antd';
import { CopyFilled } from '@ant-design/icons';
import SysStore from '../../../stores/system/SysStore';
import AddDakfz from './addDakfz'
import UpdateDakfz from './updateDakfz'
import DeleteDakfz from './deleteDakfz'
import AddDak from './addDak'
import UpdateDak from './updateDak'
import DeleteDak from './deleteDak'
import FlowGroup from './flowGroup'
import Sy from './sy'
import Xy from './xy'

const dzwjzxDak = observer((props) => {
  /**
 * 获取单位名称
 * @param {*} val
 */
  const hasRight = (val) => {
    return true;
  };
  const _canAddDakfz = hasRight("JC011");
  const _canUpdDakfz = hasRight("JC011");
  const _canDelDakfz = hasRight("JC011");
  const _canCjDak = hasRight("JC035");
  const _canEdit = true;
  const _canAdd = true;
  const _canDelete = true;
  /**
   * childStore
   */
  const localStore = useLocalObservable(() => (
    {
      loading: false,
      params: {},
      dwTreeData: [],
      dwData: [],
      async queryTreeDwList() {
        if (!this.dwData || this.dwData.length === 0) {
          const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
          if (response.status === 200) {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id
                newKey.value = newKey.id
                newKey.label = newKey.mc
                newKey.title = newKey.mc
                sjData.push(newKey)
              }
              this.dwTreeData = sjData;
            }
            return;
          }
        }
      },

      noDakDwData: [],
      noDakDwTotal: 0,
      //默认当前用户所在单位
      ydw_id: SysStore.getCurrentCmp().id,
      //当前单位名称
      ydw_mc: SysStore.getCurrentCmp().mc,
      page_No: 1,
      page_Size: 50,
      dwbh: "",
      dwmc: "",
      async queryNoDakDw() {
        const response = await fetch.get(`/api/eps/control/main/dak/queryNoDakDw?ydwid=${this.ydw_id}&ydwmc=${this.ydw_mc}&dwbh=${this.dwbh}&dwmc=${this.dwmc}&pageIndex=${this.page_No - 1}&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${this.page_Size}`);
        if (response.status === 200) {
          if (response.data.total > 0) {
            var sjData = [];
            for (var i = 0; i < response.data.total; i++) {
              let newKey = {};
              newKey = response.data.results[i];
              newKey.key = newKey.id
              sjData.push(newKey)
            }
            this.noDakDwData = sjData;
            this.noDakDwTotal = response.data.total;
          }
          return;
        }
      }
    }
  ));


  const findByDataLx = (record, index, store) => {
    let res: Array<any> = []

    if (record.type === 'D') {
      if (_canAddDakfz) {
        res.push(<AddDakfz record={record} key={'addDakfz' + index} store={store} />)
      }
    } else if (record.type === 'F') {
      if (_canAddDakfz) {
        res.push(<AddDakfz record={record} key={'addDakfz' + index} store={store} />,)
      }
      if (_canUpdDakfz) {
        res.push(<UpdateDakfz record={record} key={'updateDakfz' + index} store={store} />,)
      }
      if (_canDelDakfz) {

        res.push(<DeleteDakfz record={record} key={'deleteDakfz' + index} store={store} />,)
      }
      if (_canAdd) {
        res.push(<AddDak record={record} key={'addDak' + index} store={store} />,)
      }

      res.push(<Sy record={record} key={'sy' + index} store={store} />)
      res.push(<Xy record={record} key={'xy' + index} store={store} />)

    } else {
      if (_canEdit) {
        res.push(<UpdateDak record={record} key={'updateDak' + index} store={store} />,)
      }
      if (_canDelete) {
        if (record.lx !== "0201" && record.lx !== "040101") {
          res.push(<DeleteDak record={record} key={'deleteDak' + index} store={store} />,)
        }
      }
      if (_canCjDak) {
        res.push(<EpsModalButton key={'referToDak' + index} isIcon={true} store={store}
          params={{
            id: record.id,
            dw: record.dw,
            mbid: record.mbid,
            bh: record.bh,
            fid: record.fid,
            mbc: record.mbc,
            edittype: record.edittype,
            mc: record.mc,
            whr: record.whr,
            whsj: record.whsj,
            xh: record.xh,
            tms: record.tms
          }} url='/base/dak/referToDak' title="参见档案库" width={1150} height={400} name="参见档案库" icon={<ProfileTwoTone />}>
        </EpsModalButton>)
      }
      res.push(<FlowGroup record={record} key={'flowGroup' + index} store={store} />,)
      res.push(<Sy record={record} key={'sy' + index} store={store} />,)
      res.push(<Xy record={record} key={'xy' + index} store={store} />)

    }
    return (
      res
    )
  }
  // 自定义表格行按钮
  const customTableAction = (text, record, index, store) => {
    return findByDataLx(record, index, store)
  }

  const tableProp: ITable = {
    tableSearch: false,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
    disableCopy: true,
    disableIndex: true,
    disablePagination:true,
  }

  const [initParams, setInitParams] = useState({})
  const ref = useRef();

  const [initKey, setInitKey] = useState('')

  useEffect(() => {
    localStore.queryTreeDwList();

  }, []);

  const source: EpsSource[] = [
    {
      title: '名称',
      code: 'label',
      width: '350px',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '档案库'
  }


  const columns = [
    {
      title: '序号',
      dataIndex: '',
      textWrap: 'word-break',
      ellipsis: true,
      align: 'center',
      width: 30,
      render: (_, __, index: number) => index + (localStore.page_No - 1) * localStore.page_Size + 1,
    },

    {
      title: '编码',
      dataIndex: 'dwbh',
      textWrap: 'word-break',
      align: 'center',
      width: 80,
    }, {
      title: '名称',
      dataIndex: 'mc',
      textWrap: 'word-break',
      align: 'center',
      width: 200,
    },

    // {
    //   title: '维护人',
    //   dataIndex: 'whr',
    //   textWrap: 'word-break',
    //   align: 'center',
    //   ellipsis: true,
    //   width: 50,
    // },
    // {
    //   title: '维护时间',
    //   dataIndex: 'whsj',
    //   textWrap: 'word-break',
    //   align: 'center',
    //   width: 80,

    // }
  ]

  /**
  * 获取单位编号
  * @param {*} val
  */
  const getDwbh = (val) => {
    localStore.dwbh = val.target.value;
  };

  /**
  * 获取单位名称
  * @param {*} val
  */
  const getDwmc = (val) => {
    localStore.dwmc = val.target.value;
  };

  var dwIds = [];
  const [selectionType] = useState<'checkbox'>('checkbox');
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {

      dwIds = selectedRowKeys;
      console.log("所选项：", selectedRowKeys.toString())
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const [add_visible, setAddVisible] = useState(false)

  /**
 * 调用后端复制方法
 */
  const onPut_Add = async () => {
    if (dwIds.length <= 0) {
      message.error("请至少选择一行数据!")
    } else {
      localStore.loading = true;
      const response = await fetch.get(`/api/eps/control/main/dak/copyDaks?srcdwid=${localStore.ydw_id}&desdws=${dwIds}`);
      if (response.data.success) {
        message.success('操作成功');
        localStore.loading = false;
      } else {
        console.log(response.data);
        message.error('操作失败,' + response.data.message, 3);
        localStore.loading = true;
      }
      localStore.queryNoDakDw();
      setAddVisible(true)
    }
  }
  //查询操作
  const OnSearch = () => {
    localStore.queryNoDakDw();
  };

  //点击事件
  const clickCopyDak = () => {
    localStore.queryNoDakDw();
    setAddVisible(true);
  }

  const customAction = () => {
    return (
      <>
        <Button type="primary" icon={<CopyFilled />} onClick={() => clickCopyDak()}> 复制档案库 </Button>
        <Modal title={<span className="m-title">复制档案库</span>}
          visible={add_visible}
          onOk={onPut_Add}
          onCancel={() => setAddVisible(false)}
          style={{ top: 50 }}
          width='1000px'
        >
          <div >
            源单位：<Input style={{ width: 180 }} disabled defaultValue={localStore.ydw_id}></Input>
            &nbsp; &nbsp; &nbsp;
            <Input style={{ width: 180 }} allowClear name="dwbh" placeholder="请输入单位编号"
              onChange={getDwbh}
            >
            </Input>
            &nbsp; &nbsp;
            <Input style={{ width: 180 }} allowClear name="dwmc" placeholder="请输入单位名称"
              onChange={getDwmc}
            >
            </Input>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="primary" onClick={() => OnSearch()}>查询</Button>

          </div>
          <div className="table">

            <Spin spinning={localStore.loading} tip="正在复制,请稍后......" size="large">
              <Table
                className="ant-table"
                rowSelection={{ type: selectionType, ...rowSelection, }}
                columns={columns}
                dataSource={localStore.noDakDwData}
                bordered
                size="middle"
                //loading={localStore.loading}
                scroll={{ x: 900, y: 320 }}
                style={{ marginTop: "15px" }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  defaultCurrent: 1,
                  defaultPageSize: 50,
                  showTotal: () => `共${localStore.noDakDwTotal}条`,
                  pageSize: localStore.page_Size,
                  current: localStore.page_No,
                  total: localStore.noDakDwTotal,
                  onChange: (current, pageSize = 50) => {
                    localStore.page_No = current;
                    localStore.page_Size = pageSize;
                    localStore.queryNoDakDw();
                  }
                }}
              />
            </Spin>

          </div>
        </Modal>
      </>
    )
  }

  return (
    <EpsPanel
      title={title} // 组件标题，必填
      treeService={DwService} // 左侧树 实现类，必填
      source={source} // 组件元数据，必填
      tableProp={tableProp} // 右侧表格设置属性，选填
      initKey={initKey}
      initParams={initParams}
      tableService={DakService} // 右侧表格实现类，必填
      ref={ref} // 获取组件实例，选填
      formWidth={1100}
      //tableRowClick={(record) => console.log('abcef', record)}
      //searchForm={searchFrom}
      customAction={customAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
      customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
     >
    </EpsPanel>
  );
})

export default dzwjzxDak;
