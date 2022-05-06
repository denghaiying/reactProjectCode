import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import loadable from '@loadable/component';
import util from '../../utils/util';

const Edialog = observer(props => {
  //  const [visible, isVisible] = useState(false);
  const { intl: { formatMessage } } = props;

  const divRef = useRef(null);
  const params=util.getLStorage("rparams");
  useEffect(() => {

    //window.openDialog = (dialogurl, params, callback, visible) => openDialog(dialogurl, params={}, callback, visible);
  }, []);




  //const openDialog = (dialogurl, params, callback, visible) => {

    if(params && params.key=="dayj"){
    const Comp = loadable((props) => import(`../../pages/dagl/${params.url}`));//动态获取import组件地址启动报错？
    return (
      <div ref={divRef}>

           <Comp  visiable={true} params={{...params.data}}/>
          </div>
    )
    // }else{
    //   const Comp = loadable((props) => import(`../dagl/Dagd/SelectDailogVisiable`));//动态获取import组件地址启动报错？
    //   return (
    //     <div ref={divRef}>
    //          <Comp  visiable={true} params={{...params.data}}/>
    //         </div>
    //   )
    }
    // const Clone = React.cloneElement(Comp, {
    //   onClose: () => {
    //     ReactDOM.unmountComponentAtNode(findDOMNode(divRef.current));
    //     setComp(null);
    //   }
    // });
    // const callback=()=>{alert(1)}
    // setComp(<Comp visiable={true} params={{}} callback={callback} />);
 // };


});


export default injectIntl(Edialog);
