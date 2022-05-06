import React, { useEffect, useState } from 'react';
import { Table, Pagination } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import DapubStore from '@/stores/dagl/DapubStore';
import E9Config from '@/utils/e9config';
import fetch from '@/utils/fetch';
import SvgIcon from '@/components/SvgIcon';
import FileList from './FileList';
import { useIntl, FormattedMessage } from 'umi';

const Datable = observer(props => {
  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  const {  params, queryparams, tableprops, fileCol } = props;
  const [fileparams, setFileparams] = useState({});
  const [fileshow, setFileshow] = useState(false);
  const [pageno, setPageNo] = useState(1);
  const [pagesize, setPagesize] = useState(20);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.dakid) {
      DapubStore.getDaklist(params.dakid, params.tmzt).then(
        () => { queryData(); }
      );
    } else {
      setData({});
    }
  }, [params]);

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

  return <div>
    <Table
      {...(tableprops || {})}
      loading={loading}
      dataSource={data && data.results || []}
    >
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
    </Table>
    <Pagination
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
