import React from 'react';
import { Drawer } from 'antd';
import style from './index.less';
import settings from '@/styles/assets/img/float-settings-img.png';
import cancel from '@/styles/assets/img/float-cancel-img.png';

class MyDrawer extends React.Component {
  state = {
    visible: false,
  };

  handleOpt = (type) => {
    if (type === 'open') {
      this.setState({ visible: true });
    } else if (type === 'close') {
      this.setState({ visible: false });
    }
  };

  render() {
    const { visible } = this.state;
    return (
      <>
        <div
          className={
            visible
              ? `${style['imgs-url']} ${style['imgs-url-o']}`
              : `${style['imgs-url']}`
          }
          onClick={this.handleOpt.bind(this, visible ? 'close' : 'open')}
        >
          <img src={visible ? cancel : settings} />
        </div>
        <Drawer
          title="标题"
          placement="right"
          closable={true}
          onClose={this.handleOpt.bind(this, 'close')}
          visible={visible}
          maskClosable={false}
        >
          <div className={`${style['content']}`}>Some contents...</div>
        </Drawer>
      </>
    );
  }
}
export default MyDrawer;
