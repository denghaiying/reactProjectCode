import { observer } from 'mobx-react';
import './loginFormGSYTH.less';
import LoginFormComp from './loginFormComp.jsx';

const Gsyth = observer((props) => {
  const title = '鹤壁市档案馆馆际共享平台';
  //const backgroundUrl="/public/assets/img/bg_dianziyuelanshi.png";

  return <LoginFormComp title={title} location={props.location} />;
});

export default Gsyth;
