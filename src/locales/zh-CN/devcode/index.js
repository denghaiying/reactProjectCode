import devcodehome from './devcodehome';
import Read from './Read';
import usermanage from './usermanage';
import Branch from './branch';
import History from './History';

export default {
  ...Read,
  ...Branch,
  ...History,  
  ...usermanage,
  ...devcodehome,
};
