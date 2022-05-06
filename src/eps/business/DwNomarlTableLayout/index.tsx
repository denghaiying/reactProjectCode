import React, { forwardRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel2';
import { EpsProps } from '@/eps/commons/declare';
import DwService from './service/DwService';

export interface DwTableLayoutProps extends EpsProps {}

const DwTableLayout = forwardRef((props: DwTableLayoutProps, ref) => {
  return <EpsPanel treeService={DwService} {...props} ref={ref} />;
});

export default DwTableLayout;
