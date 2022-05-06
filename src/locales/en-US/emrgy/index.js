import event from './event';
import restype from './restype';
import eventManagement from './eventManagement';
import plantype from './plantype';
import resourceku from './resourceku';
import handover from './handover';
import logbook from './logbook';
import plan from './plan';
import spedit from './spedit';
import firetop from './firetop';
import spplanedit from './spplanedit';
import unit from './unit';
import floodPreventionnit from './floodPrevention';
import special from './special';
import home from './home';
import artitype from './artitype';
import topictype from './topictype';
import eventtype from './eventtype';
import report from './report';

export default {
  ...event,
  ...restype,
  ...eventManagement,
  ...plantype,
  ...resourceku,
  ...handover,
  ...logbook,
  ...plan,
  ...spedit,
  ...firetop,
  ...spplanedit,
  ...unit,
  ...floodPreventionnit,
  ...special,
  ...home,
  ...artitype,
  ...topictype,
  ...eventtype,
  ...report,
};
