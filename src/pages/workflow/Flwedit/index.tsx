import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { history, useIntl } from 'umi';
import GGEditor, { Flow, withPropsAPI } from 'gg-editor';
import { Row, Col, message, Tooltip } from 'antd';
import { FlowItemPanel } from '../components/EditorItem';
import EditorMinimap from '../components/EditorMinimap';
import { FlowDetailPanel } from '../components/EditorDetailPanel';
import { FlowToolbar } from '../components/EditorToolbar';
import WfdefStore from '../../../stores/workflow/WfdefStore';
import SvgIcon from '@/components/SvgIcon';

GGEditor.setTrackable(false);

const useComponentWillMount = (func) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
    return () => {
      setHasRendered(false);
    };
  }, [hasRendered]);

  if (!hasRendered) {
    func();
  }
};

const Flwedit = observer((props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  useComponentWillMount(() => {
    WfdefStore.resetEditRecord(id || '');
  });

  const save = (data: any) => {
    const { nodes } = data;
    if (new Set(nodes.map((o: any) => o.code)).size < nodes.length) {
      message.info('不允许存在编号相同的节点');
      return;
    }
    WfdefStore.saveDefData(data);
  };

  return (
    <div className="file-transfer" style={{ overflow: true, height: '100%' }}>
      <div className="file-content" style={{ height: '100%' }}>
        <GGEditor style={{ height: '100%', width: '100%' }}>
          <Row style={{ width: '100%' }}>
            <Col span={24}>
              <FlowToolbar
                save={{ cmp: 'iconsave', action: (d) => save(d) }}
                otherCmp={
                  <div className="saveCommand" onClick={() => history.goBack()}>
                    <Tooltip
                      title="返回"
                      placement="bottom"
                      // overlayClassName={styles.tooltip}
                    >
                      <SvgIcon type={`iconreturn`} />
                    </Tooltip>
                  </div>
                }
              />
            </Col>
          </Row>
          <Row
            style={{
              width: '100%',
              minHeight: '400px',
              height: 'calc( 100% - 30px)',
            }}
          >
            <Col span={3}>
              <FlowItemPanel />
              <EditorMinimap />
            </Col>
            <Col span={11} style={{ overflow: true }}>
              <Flow
                style={{ width: '100%', minHeight: '400px', height: '100%' }}
                data={WfdefStore.defData}
              />
            </Col>
            <Col span={10} style={{ overflow: true }}>
              <FlowDetailPanel />
            </Col>
          </Row>
        </GGEditor>
      </div>
    </div>
  );
});

export default withPropsAPI(Flwedit as any);
