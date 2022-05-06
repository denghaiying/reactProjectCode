import React, { useEffect } from 'react';
import { Table, Input, Icon, Pagination, Button, Switch, Grid, Tab, Field, Select } from '@alifd/next';
import { FormattedMessage, injectIntl } from 'react-intl';
import IceNotification from '@icedesign/notification';
import moment from 'moment';
import { observer } from 'mobx-react';
import EditDailog from './EditDailog';
import ContainerTitle from '../../../components/ContainerTitle';
import sxjcjcgzStore from '../../../stores/perfortest/sxjcjcgzStore';
import E9Config from '../../../utils/e9config';


const Jcgzx = observer(props => {
  const { intl: { formatMessage } } = props;
  const { dataSource, colums, loading, pageno, pagesize, mbdataSource ,jcData} = sxjcjcgzStore;
  const field = Field.useField({
    values: sxjcjcgzStore.queryKey,
    onChange: (name, value) => {
      if (name === 'sxjcjcgzhj') {
        const v = value;
        if (v) {
          let r = {};
          sxjcjcgzStore.jcData.some(it => {
            if (it.value === v) {
              r = it;
              return true;
            }
            return false;
          });
          field.setValue('sxjcjcgzhj', r.value);
        } else {
          field.setValue('sxjcjcgzhj', '');
        }
      }
      const values = field.getValues();
      sxjcjcgzStore.setParams(values, true);
      sxjcjcgzStore.queryData(values);
    },
  });
  useEffect(() => {
    sxjcjcgzStore.queyfindAllmb();
    sxjcjcgzStore.queryData();
  }, []);


  const doSearchAction = (() => {
    field.validate((errors, values) => {
      if (!errors) {
        sxjcjcgzStore.setParams(values);
      }
    });
  });

  
  /**
   * 分页器，切换页数
   * @param {*} current
   */
   const onPaginationChange = ((current) => {
    sxjcjcgzStore.setPageNo(current);
  });


  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSizes
   */
  const onPageSizeChange = ((pageSize) => {
    sxjcjcgzStore.setPageSize(pageSize);
  });

  /**
   * 最后一列操作列绘制修改 删除按钮
   * @param {*} value
   * @param {*} index
   * @param {*} record
   */
const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" onClick={() => onEditAction(record)}><FormattedMessage id="e9.btn.edit" /></a>
        <a href="javascript:;" style={{ marginLeft: "5px" }} onClick={() => onDeleteAction(record.id)}> <FormattedMessage id="e9.btn.delete" /> </a>
      </div>
    );
  };

    /**
   * Table的选择改变的时候触发的事件，注意: 其中records只会包含当前dataSource的数据，很可能会小于selectedRowKeys的长度。
   * @param {*} selectedRowKeys
   * @param {*} records
   */
  const onTableRowChange = (selectedRowKeys, records) => {
    sxjcjcgzStore.setSelectRows(selectedRowKeys, records);
  };


  /**
   * 点击新增按钮事件响应
   */
  const onAddAction = (() => {
     const json = { whsj: moment() };
    sxjcjcgzStore.showEditForm('add', json);
  });

  /**
   * 响应编辑事件
   * @param {*} record
   */
  const onEditAction = (record) => {
    edit(record);
  };

  const edit = ((record) => {
    
    const json = {};
    const { entries } = Object;
    entries(record).forEach(([key, value]) => {
      if (value) {
        json[key] = value;
      }
    });
    json.whsj = moment();
    if (json.sxjcjcgzstate == "开启") {
      json.sxjcjcgzstate = true
    } else {
      json.sxjcjcgzstate = false
    }
    if(json.sxjcjcgzcode!=""){
            for(var j=0;j<mbdataSource.length;j++){
              var b=mbdataSource[j];
              if(json.sxjcjcgzcode==b.label){
                json.sxjcjcgzcode=b.value
              }
            }
    }
    sxjcjcgzStore.showEditForm('edit', json);
  });

  const onDeleteAction = (id) => {
    deleteData(id);
  };

  const deleteData = (id) => {
    sxjcjcgzStore.delete(id);
  };

  // end **************

  return (
    <div className="workpage">
      <ContainerTitle
        title={formatMessage({ id: 'e9.perfortest.jcgz.title' })}
        mainroute="/"
        umid=""
        extra={
          <span>
            <Button.Group>
              <Button type="primary" ><Icon className="iconfont iconprint" /><FormattedMessage id="e9.btn.print" /></Button>
              <Button type="primary" ><Icon className="iconfont iconset" /><FormattedMessage id="e9.btn.reportset" /></Button>
            </Button.Group>
            <Button.Group style={{ marginLeft: '10px' }} >
              <Button type="primary" onClick={onAddAction}><Icon type="add" /><FormattedMessage id="e9.btn.add" /></Button>
            </Button.Group>
         
          </span>
        }
      />
       <div className="workcontain">
        {/* 如果需要左边区域，则把这段放开，并去除下面div的样式的rightmax部分，仅保留right
        <div className="left">左边区域按实际布局</div> */}
        <div className="right rightmax">
          <div className="toolbar">
              <Select 
              {...field.init('sxjcjcgzhj', {})} hasClear
              placeholder={formatMessage({ id: 'e9.perfortest.jcgz.sxjcjchj' })}
              style={{ marginRight: '20px',width: 200 }}
            >
              {sxjcjcgzStore.jcData.map(item => <Select.Option value={item.value} key={item.value} >{item.label}</Select.Option>)}
            </Select>
              <Input
              {...field.init('xysjlxbh', {})}
              maxLength={50}
              style={{ marginRight: '20px',width: 200 }}
              placeholder={formatMessage({ id: 'e9.perfortest.xysjlx.xysjlxbh' })}
              hasClear
              value={field.getValue('xysjlxbh')}
              onChange={xysjlxbh => field.setValue('xysjlxbh', xysjlxbh)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />
              <Input
              {...field.init('xysjlxmc', {})}
              maxLength={50}
              style={{ marginRight: '20px',width: 200 }}
              placeholder={formatMessage({ id: 'e9.perfortest.xysjlx.xysjlxmc' })}
              hasClear
              value={field.getValue('xysjlxmc')}
              onChange={xysjlxmc => field.setValue('xysjlxmc', xysjlxmc)}
              innerAfter={<Icon type="search" size="xs" onClick={doSearchAction} style={{ margin: 4 }} />}
            // addonAfter={<Button><FormattedMessage id="e9.btn.advsearch" /></Button>}
            />
   
            
          </div>
    

        <div className="workspace">
            <Table
              tableLayout="fixed"
              // $work-context-heigth-41px, 41px为表头高度
              maxBodyHeight="calc(100vh - 259px)"
              dataSource={dataSource.list}
              fixedHeader
              loading={loading}
              rowSelection={{ onChange: onTableRowChange, selectedRowKeys: sxjcjcgzStore.selectRowKeys }}
            >

              {colums.map(col =>
                  <Table.Column alignHeader="center" key={col.dataIndex} {...col} title={formatMessage({ id: `${col.title}` })} />
              )}
              <Table.Column cell={renderTableCell} width="100px"/>
            </Table>
           <Pagination
              className="footer"
              size={E9Config.Pagination.size}
              current={pageno}
              pageSize={pagesize}
              total={dataSource.total}
              onChange={onPaginationChange}
              shape={E9Config.Pagination.shape}
              pageSizeSelector={E9Config.Pagination.pageSizeSelector}
              pageSizePosition={E9Config.Pagination.pageSizePosition}
              onPageSizeChange={onPageSizeChange}
              popupProps={E9Config.Pagination.popupProps}
              totalRender={total => <span className="pagination-total"> {`${formatMessage({ id: 'e9.pub.total' })}：${total}`}</span>}
            />
          </div>
        </div>
      </div>
        <EditDailog />
      </div>
  );
});
export default injectIntl(Jcgzx);
