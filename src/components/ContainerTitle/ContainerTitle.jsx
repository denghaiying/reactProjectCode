import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Grid, Dropdown, Menu, Icon } from '@alifd/next';
import { Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'umi';


const { Row, Col } = Grid;
const ContainerTitle = ({ title, extra, style, subTitle, mainroute, menulist, ...props }) => {

  const intl =  useIntl();
  const formatMessage=intl.formatMessage;
  
  return (
    <Row style={{ ...styles.context }}>
      <Col span="10" >
        {subTitle && <span style={{ ...styles.subTitle }}>{subTitle}</span>}
        <Breadcrumb {...props} component="div" style={{ ...styles.title, ...style }}>
          <Breadcrumb.Item><Link to={mainroute ? `/run${mainroute}` : '/sys'}><FormattedMessage id="e9.desktop" /></Link></Breadcrumb.Item>
          <Breadcrumb.Item > {title}</Breadcrumb.Item>
        </Breadcrumb>

      </Col>
      <Col span="13" style={{ ...styles.extra }}>
        {extra}
      </Col>
      <Col span="1" style={{ ...styles.menu }}>
        <Dropdown trigger={<Icon className="iconfont iconlist" />} triggerType="click" offset={[0, -16]}>
          <Menu>
            <Menu.Item><Icon size="small" className="iconfont iconcustom-help" style={{ marginRight: 4 }} /><FormattedMessage id="e9.btn.help" /></Menu.Item>
          </Menu>
        </Dropdown>
      </Col>
    </Row >
  );
};

const styles = {
  context: {
    borderBottom: '1px solid #f0f0f0',
    margin: '0',
    //  padding: '15px 0',
    lineHeight: '50px',
    height: '50px',
    fonSize: '12px',
    color: '#84848',
    // color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '400',
  },
  title: {
    lineHeight: '50px',
    display: 'inline-block',
    paddingLeft: '14px',
    verticalAlign: 'middle',
  },
  subTitle: {
    lineHeight: '50px',
    display: 'inline-block',
    paddingLeft: '14px',
    verticalAlign: 'middle',
    fontSize: '18px',
    //  float: 'right',
  },
  extra: {
    display: 'inline-block',
    //   paddingRight: '14px',
    textAlign: 'right',
    verticalAlign: 'middle',
  },
  menu: {
    display: 'inline-block',
    paddingRight: '14px',
    textAlign: 'right',
    verticalAlign: 'middle',
  },
};

ContainerTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ContainerTitle;
