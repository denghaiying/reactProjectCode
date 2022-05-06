import services from './services';
import servicedic from './servicedic';
import serviceinfo from './serviceinfo';
import approval from './approval';
import statistics from './statistics';

export default {
  ...services,
  ...servicedic,
  ...serviceinfo,
  ...approval,
  ...statistics,
};
