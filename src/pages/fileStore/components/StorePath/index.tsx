import { DriverType } from '@/types';
import {
  DesktopOutlined, MobileOutlined, RetweetOutlined, RollbackOutlined, SearchOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb, Button, Input, Typography,
} from 'antd';
import classnames from 'classnames';
import styles from './index.module.less';

const { Text } = Typography;
interface PropsType{
  curDriType:DriverType;
  localPathCollection:string[];
  mobilePathCollection:string[];
  turnBack:()=>void;
  reload:()=>void;
  searchVal:string;
  search:(name:string)=>void;
  handleDriverStatus:(p:DriverType)=>void;
}
export default function StorePath({
  curDriType,
  localPathCollection,
  mobilePathCollection,
  turnBack,
  reload,
  searchVal,
  search,
  handleDriverStatus,
}:PropsType) {
  return (
    <div className={classnames('flex', 'mb-4', 'justify-between')}>
      <div className={classnames('flex', 'items-center')}>
        <div className={styles.operationGroup}>
          <Button shape="circle" onClick={turnBack} icon={<RollbackOutlined style={{ fontSize: '12px' }} />} />
          <Button shape="circle" onClick={reload} icon={<RetweetOutlined style={{ fontSize: '12px' }} />} />

        </div>
        <Breadcrumb>
          {
          curDriType === DriverType.LOCAL
            ? localPathCollection.map((item, index) => (
              <Breadcrumb.Item key={item}>
                <Text strong>
                  {
                  index === 0 ? (item.slice(0, -2)).toUpperCase() : item
                }
                </Text>

              </Breadcrumb.Item>
            ))
            : mobilePathCollection.map((item) => (
              <Breadcrumb.Item key={item}>
                {
                  item
                }
              </Breadcrumb.Item>
            ))
        }
        </Breadcrumb>
      </div>

      <div className="flex items-center">
        <div className="mx-4 text-xl">
          <DesktopOutlined className={curDriType === DriverType.LOCAL ? 'text-[#7d53b0] mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.LOCAL)} />
          <MobileOutlined className={curDriType === DriverType.MOBILE ? 'text-[#7d53b0] mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.MOBILE)} />
        </div>

        <Input
          placeholder="搜索文件名/文件夹名~"
          allowClear
          prefix={<SearchOutlined />}
          value={searchVal}
          onChange={(event) => search(event.target.value)}
          style={{ width: 304 }}
        />

      </div>

    </div>
  );
}
