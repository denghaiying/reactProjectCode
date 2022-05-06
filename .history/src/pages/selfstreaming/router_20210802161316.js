import Loadable from '@loadable/component';

const Channel = Loadable(() => import('./Channel'));
const Content = Loadable(() => import('./Content'));
const Channeltype = Loadable(() => import('./Channeltype'));

export default [{
  path: '/selfchanneltype',
  component: Channeltype,
},{
  path: '/selfchannel',
  component: Channel,
},
{
  path: '/selfcontent',
  component: Content,
}];
