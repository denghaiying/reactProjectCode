import { Link } from 'umi';
import { Result, Button } from 'antd';

export default () => (
  <Result
    status="error"
    title="系统错误"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, the server is reporting an error."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
