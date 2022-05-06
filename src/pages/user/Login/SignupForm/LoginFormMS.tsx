import { observer } from 'mobx-react';
import LoginFormComp from './loginFormComp.jsx';
import './loginFormMS.less';
const Kfjd = observer((props) => {
  const title = '区域民生档案查询利用系统';
  //const backgroundUrl="/public/assets/img/bg_dianziyuelanshi.png";

  return <LoginFormComp title={title} location={props.location} />;
});

export default Kfjd;
