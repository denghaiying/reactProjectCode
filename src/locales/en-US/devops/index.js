
import devopslog from './devopslog';
import failwarn from './failwarn';
import devopsHome from './devopshome';
import branch from './branch';

export default {
  ...devopslog,
  ...failwarn,
  ...devopsHome,
  ...branch,
};
