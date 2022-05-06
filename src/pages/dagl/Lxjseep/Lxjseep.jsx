import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
    Upload, Button, Icon, Grid,Message,
} from '@alifd/next';
import moment from 'moment';
import LxjseepStore from '@/stores/dagl/LxjseepStore'
import './index.less';
import LoginStore from '@/stores/system/LoginStore';

const Lxjseep = observer(props => {
    const { intl: { formatMessage }, params, callback, onChange } = props;
    const { uploadparams } = LxjseepStore;
    // const params = {
    //     cjdw: "DW201408191440170001",
    //     dakid: "DAK201810241634300008",
    //     eepjc: true,
    //     tmzt: 3,
    //     whr: "超级管理员",
    //     whrid: "YH201810180044580007",
    //     yhbh: "cjgly"
    // }
    const { Row, Col } = Grid;
    useEffect(() => {
        LxjseepStore.setUploadparams(params);
    }, []);
    
    const customRequest = (option) => {
        
        LxjseepStore.importEepInfo(option)
    };
    const beforeUpload = (info) => {
        
        if(info.name.substring(info.name.length-3)!="eep"){
            return Message.warning("非法文件！不是EEP格式！", 1.5);
        }
        console.log('beforeUpload : ', info);
    }
    const onDeleteFile = (f) => {
        onDeleteAction(f.fileid);
      };
    
      const onDeleteAction = (fileid, index, record) => {
        if (record && !record.filename) {
          const d = [].concat(datasource || []);
          const nd = d.splice(0, index);
          if (index + 1 < datasource.length) {
            nd.concat(d.splice(index + 1));
          }
        }
      };
    return (
            <div className="main-upload">
                <Row>
                    {/* <span style={{fontSize: '13px'}}>离线接收EEP包：</span> */}
                    <Upload
                        beforeUpload={beforeUpload}
                        listType="text"
                        limit={1}
                        value={[]}
                        data={uploadparams}
                        request={customRequest}
                        // onChange={() => { }}
                    // extraRender={renderDownloadTag}
                    >
                        <Button type="secondary" style={{ margin: '0 0 5px 0px' }}><Icon type="upload" />上传EEP</Button>
                    </Upload >

                </Row>
            </div>
    );
});

export default injectIntl(Lxjseep);
