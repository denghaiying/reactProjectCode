import eventtype from './eventtype';
import event from './event';
import restype from './restype';
import watch from './watch';
import plantype from './plantype';
import eventManagement from './eventManagement';
import schedu from './schedu';
import resourceku from './resourceku';
import unit from './unit';
import handover from './handover';
import logbook from './logbook';
import spedit from './spedit';
import plan from './plan';
import firetop from './firetop';
import spplanedit from './spplanedit';
import floodPrevention from './floodPrevention';
import special from './special';
import warning from './warning';
import evenTrack from './evenTrack';
import feedback from './feedback';
import home from './home';
import topictype from './topictype';
import artitype from './artitype';
import report from './report';
import topicLibrary from './topicLibrary';

export default {
  ...eventtype,
  ...event,
  ...plantype,
  ...restype,
  ...watch,
  ...eventManagement,
  ...schedu,
  ...resourceku,
  ...unit,
  ...handover,
  ...logbook,
  ...spedit,
  ...plan,
  ...firetop,
  ...spplanedit,
  ...floodPrevention,
  ...special,
  ...warning,
  ...evenTrack,
  ...feedback,
  ...home,
  ...topictype,
  ...artitype,
  ...report,
  ...topicLibrary,
};
