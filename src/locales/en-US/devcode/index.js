import Read from './Read';
import Branch from './branch';
import History from './History';
import usermanage from './usermanage';
import devcodehome from './devcodehome';

export default {
  ...Read,
  ...Branch,
  ...usermanage,
  ...History,
  ...devcodehome,
};
