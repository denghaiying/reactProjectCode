import React, { useEffect, useRef, useState } from 'react';
import loadable from '@loadable/component';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { routerData } from '../../routerConfig';
import EIFrame from '../EIFrame';

const ToTabContent = observer(props => {
  const { intl: { formatMessage } } = props;

  useEffect(() => {

  }, []);
  console.log(routerData)

  // const Login = Loadable(() => import('../Login'));
   
  
  const umid = props && props.item && props.item.umid || "";
  const href = props && props.item && props.item.href || "";

  if (props.item.openlx != "5") {
    const router = routerData.find(o => {
      return o.path == "/" + props.item.url
    })
    const MyComponent = loadable((props) => import(`../${props.item.url}`));
    return (
      <MyComponent match={{ params: { umid: umid } }} {...props} />
    )
  } else {
    return (
      <EIFrame match={{ params: { umid: umid,href:href } }} {...props.item} />
    )
  }
});
export default injectIntl(ToTabContent);
