import services from './services';
import servicedic from './servicedic';
import serviceinfo from './serviceinfo';
import approval from './approval';
import whitelist from './whitelist';
import basicsc from './basicsc';
import home from './home';
import statistics from './statistics';


export default {
  ...services,
  ...servicedic,
  ...serviceinfo,
  ...approval,
  ...whitelist,
  ...basicsc,
  ...statistics,
  ...home,
};
