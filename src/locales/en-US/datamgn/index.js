import Database from './database';
import Share from './share';
import Element from './element';
import Field from './field';
import Table from './table';
import Volume from './volume';

export default {
  ...Database,
  ...Share,
  ...Element,
  ...Field,
  ...Table,
  ...Volume,
};
