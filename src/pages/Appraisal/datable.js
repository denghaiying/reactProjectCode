import React, { useEffect, useState } from 'react';
import { Table, Pagination } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import DapubStore from '@/stores/dagl/DapubStore';
import E9Config from '@/utils/e9config';
import fetch from '@/utils/fetch';
import SvgIcon from '@/components/SvgIcon';
import FileList from '../dagl/FileList';
import "./AppraisaManage/officeChild/index.less";
import { useIntl } from 'umi';
const Datable = observer(props => {
  const { params, querykey,queryparams, tableprops, fileCol } = props;
  const [fileparams, setFileparams] = useState({});
  const [fileshow, setFileshow] = useState(false);
  const [pageno, setPageNo] = useState(1);
  const [pagesize, setPagesize] = useState(20);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  useEffect(() => {
    if (params.dakid) {
      DapubStore.getDaklist(params.dakid, params.tmzt).then(
        () => { queryData(); }
      );
    } else {
      setData({});
    }
  }, [params]);

  useEffect(() => {
    queryData();
  }, [querykey]);



  console.log(queryparams)
  console.log("querykey ",querykey)

  /**
   * 如果有传递参数，则调用传递的change事件，如果未传递，则调用store处理
  */
  const onSelectChange = (selectedRowKeys, records) => {
    if(props.selectedRowKeys){
      onSelectChange(ids,records);
    }

    DapubStore.setSelectRows(selectedRowKeys, records);
  };


  const showFile = (visible, params) => {
    setFileshow(visible);
    if (visible) {
      setFileparams(params);
    }
  };

  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    setPageNo(current);
    queryData();
  });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((pageSize) => {
    setPagesize(pageSize);
    queryData();
  });

  const rowSelection = {
    onChange: onSelectChange,
  };

  const queryData = async () => {
    setLoading(true);
    const ktable = DapubStore.ktables[params.dakid];
    const fd = new FormData();
    if (ktable && ktable.bmc) {
      fd.append("bmc", ktable.bmc);
      fd.append("mbid", ktable.mbid);
      fd.append("dakid", params.dakid);
      fd.append("tmzt", params.tmzt);
      fd.append("hszbz", "N");
      fd.append('page', pageno - 1);
      fd.append('limit', pagesize);
      if(querykey){
        fd.append('key',querykey)
      }

      if (queryparams) {
        for (const key in queryparams) {
          fd.append(key, queryparams[key]);
        }
      }
      const response = await fetch
        .post("/api/eps/control/main/dagl/queryForPage", fd, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
      if (response && response.status === 200 && response.data.success) {
        setData(response.data);
      }
    }
    setLoading(false);
  };
  console.log(DapubStore.columns)
  console.log(DapubStore.columns[`${params.dakid}-${params.tmzt}-${params.umid}`])
  return <div>
      <Table.StickyLock bordered="true" rowSelection={rowSelection}
       className="common-table"

       dataSource={data && data.results || []}
       emptyContent={<div><img src={require('@/styles/assets/img/table-empty.png')} style={{width: 150}}/></div>}>

      {fileCol &&
        <Table.Column
          title="操作"
          alignHeader="center"
          lock="left"
          width="80px"
          cell={
            (value, index, record) =>
              <span onClick={() => {
                if (record.fjs && record.fjs > 0) {
                  showFile(true, {
                    doctbl: `${DapubStore.ktables[params.dakid].bmc}_FJ`,
                    grptbl: `${DapubStore.ktables[params.dakid].bmc}_FJFZ`,
                    grpid: record.filegrpid,
                    daktmid: record.id
                  });
                }
              }}>
                <SvgIcon type="iconfujian" /><span>{record.fjs || ''}</span>
              </span>
          }
        />}
      {DapubStore.columns[`${params.dakid}-${params.tmzt}`] &&
        DapubStore.columns[`${params.dakid}-${params.tmzt}`]
          .filter(col => !["yjspzt", "yjspyy", "gdspzt", "gdspyy", "canedit"].includes(col.dataIndex))
          .map(col =>
            <Table.Column alignHeader="center" key={col.dataIndex} {...col} />
          )
      }
    </Table.StickyLock>
    <Pagination
     className="paginate"
      //   className="footer"
      size={E9Config.Pagination.size}
      current={pageno}
      pageSize={pagesize}
      total={data.total || 0}
      onChange={onPaginationChange}
      shape={E9Config.Pagination.shape}
      pageSizeSelector={E9Config.Pagination.pageSizeSelector}
      pageSizePosition={E9Config.Pagination.pageSizePosition}
      onPageSizeChange={onPageSizeChange}
      popupProps={E9Config.Pagination.popupProps}
      totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
    />
    <FileList visible={fileshow} callback={(visible, params) => { setFileshow(false) }} params={fileparams} />
  </div>

});

export default Datable;
