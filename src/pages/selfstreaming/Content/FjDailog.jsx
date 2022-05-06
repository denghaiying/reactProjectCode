import React from 'react'
import 'braft-editor/dist/index.css'
import ContentStore from '../../../stores/selfstreaming/content/Content';
import {Table, Button, Transfer, Dialog, Form ,Upload ,Pagination,Icon,Tree } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { observer } from 'mobx-react';
import ContainerTitle from '../../../components/ContainerTitle';
import IceNotification from '@icedesign/notification';
import { useIntl, FormattedMessage } from 'umi';



const FjDailog = observer(props => {
//  const { intl: { formatMessage } } = props;
const intl =  useIntl();
  const formatMessage=intl.formatMessage;

 const { Item: FormItem } = Form;
  const { fjdata, fjcolumns, fjloading, fjpageno, fjpagesize,channelData,updatefj,handleFileChange,treedata} = ContentStore;

  const savedata = ((values, errors) => {
    if (!errors) {
      ContentStore.updatefj(values);
    }
  });
  /**
   * 分页器，切换页数
   * @param {*} current
   */
  const onPaginationChange = ((current) => {
    ContentStore.setFJPageNo(current);
  });

    const saveUploaderRef = ((ref) => {
        this.uploaderRef = ref.getInstance();
    });

  /**
   * 分页器，每页显示记录数发生变化
   * @param {*} pageSize
   */
  const onPageSizeChange = ((fjpageSize) => {
    ContentStore.setFJPageSize(fjpageSize);
  });

  /**
   * 响应删除事件
   * @param {*} id
   */
  const onFjDeleteAction = (id) => {
    ContentStore.deleteFjData(id);
  };

  const onTableRowChange = (selectedRowKeys, records) => {
    ContentStore.setFjSelectRows(selectedRowKeys, records);
  };

  const treeselect = (keys, info) => {
    ContentStore.treeSelect(keys[0]);
  };
 
  const ondownfj = () => {
    if (!ContentStore.fjselectRowRecords || ContentStore.fjselectRowRecords.length < 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectNone' }) });
      return;
    }
    if (ContentStore.fjselectRowRecords.length > 1) {
      IceNotification.info({ message: formatMessage({ id: 'e9.info.info' }), description: formatMessage({ id: 'e9.info.selectOneOnly' }) });
      return;
    }
    ContentStore.downFj(ContentStore.fjselectRowRecords);
  };



  const renderTableCell = (value, index, record) => {
    return (
      <div>
        <a href="javascript:;" style={{ marginLeft: '5px' }} onClick={() => onFjDeleteAction(record.fileid)}><FormattedMessage id="e9.btn.delete" /></a>
      </div>);
  };


  
 
  return (
    <Dialog
      title={formatMessage({ id: 'e9.content.content.contentfj' })}
      visible={ContentStore.fjModalVisible}
      onClose={() => ContentStore.closeFjDailog(false)}
      onCancel={() => ContentStore.closeFjDailog(false)}
      footer={false}
    >
      <IceContainer style={{ padding: '0', height: '100%', width: '100%', marginBottom: '0' }}>
      <div style={{ padding: '20px' }}>
          <Form id="fileForm"  size="small"  inline labelAlign="left" labelTextAlign="right" >
            <FormItem label={`${formatMessage({ id: 'e9.content.content.contentfj' })}：`}>
              <input class="file" name="file" type="file" onChange={handleFileChange}/>
            </FormItem>
          </Form>
        <div style={{ marginBottom: '10px' }}>
          <Button.Group size="small" style={{ marginLeft: '10px' }}>
            <Button type="secondary" onClick={ondownfj}><Icon className="iconfont iconuser_role" /><FormattedMessage id="e9.content.content.contentfjxz" /></Button>
          </Button.Group>
        </div>
        </div>
        <div class="left">
        <Tree defaultExpandAll dataSource={treedata} onSelect={treeselect} />
        </div>
        <div class="right">
        <Table 
          maxBodyHeight={400}
          dataSource={fjdata.list}
          fixedHeader
          loading={fjloading}
          rowSelection={{ onChange: onTableRowChange }}
        >
          {fjcolumns.map(o => (
          <Table.Column alignHeader="center" key={o.dataIndex} {...o} title={formatMessage({ id: `${o.title}` })} />
        ))}
        <Table.Column cell={renderTableCell} width="100px" lock="right" />
        </Table>
        <Pagination
          current={fjpageno}
          pageSize={fjpagesize}
          total={fjdata.total}
          onChange={onPaginationChange}
          style={{ marginTop: '5px' }}
          shape="arrow-prev-only"
          pageSizeSelector="dropdown"
          pageSizePosition="end"
          onPageSizeChange={onPageSizeChange}
        />
     
      </div>
    </IceContainer >
    </Dialog >
    );

});


export default FjDailog;