import React from 'react';
import { Button, Select, Grid } from '@alifd/next';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import JcsqStore from '../../../stores/inspect/JcsqStore';
import EditForm from '../../../components/EditForm';
import { E9FormBinderWrapper, EFormBinder } from '../../../components/EFormBinder';

const { Row, Col } = Grid;
const formItemLayout = {
  labelCol: {
    fixedSpan: 3,
  },
  wrapperCol: {
    span: 21,
  },
};
const ZhuLX = observer(props => {
  const { intl: { formatMessage } } = props;
  const { opt, zhuluData, iptcfgData } = JcsqStore;
  const form = React.createRef();
  const saveData = (() => {
    const { validateFields } = form.current;
    validateFields((errors, values) => {
      JcsqStore.saveZhulu(values);
    })
  });
  return (
    <EditForm
      title={formatMessage({ id: 'Jcsq.importZhuLu' })}
      visible={JcsqStore.zhuluVisible}
      opt={opt}
      footer={<Button onClick={saveData} type="primary">{formatMessage({ id: 'e9.btn.save' })}</Button>}
      onClose={() => JcsqStore.closeZForm()}
      style={{ width: '45%' }}
    >
      <E9FormBinderWrapper formItemLayout={formItemLayout} refForm={form} bodyStyle={{ width: '85%' }}>
        <Row wrap>
          {zhuluData.map((item) => {
            return (
              <Col span={12}>
                <EFormBinder label={item.jcsqfieldsName} name={item.jcsqfieldsName}>
                  <Select
                    mode="multiple"
                    style={{ width: '110%' }}
                    dataSource={iptcfgData}
                  />
                </EFormBinder>
              </Col>
            );
          })
          }
        </Row>
      </E9FormBinderWrapper>
    </EditForm>
  );
});
export default injectIntl(ZhuLX);
