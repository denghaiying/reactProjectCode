import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'EPS智慧档案管理系统',
  });

  return (
    <DefaultFooter
      copyright={`2020 ${defaultMessage}`}
      links={[
        
      ]}
    />
  );
};
