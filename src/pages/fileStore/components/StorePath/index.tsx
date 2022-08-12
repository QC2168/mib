import { DriverType } from '@/types';
import { DesktopOutlined, MobileOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Input } from 'antd';
import classnames from 'classnames';
import styles from './index.module.less';

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
          <Button type="default" shape="circle" onClick={turnBack}><span className="i-akar-icons:arrow-back" /></Button>
          <Button type="default" shape="circle" onClick={reload}><span className="i-zondicons:reload" /></Button>
        </div>
        <Breadcrumb>
          {
          curDriType === DriverType.LOCAL
            ? localPathCollection.map((item, index) => (
              <Breadcrumb.Item key={item}>
                {
                  index === 0 ? (item.slice(0, -2)).toUpperCase() : item
                }
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
          <DesktopOutlined className={curDriType === DriverType.LOCAL ? 'text-indigo-600 mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.LOCAL)} />
          <MobileOutlined className={curDriType === DriverType.MOBILE ? 'text-indigo-600 mx-2' : ' mx-2'} onClick={() => handleDriverStatus(DriverType.MOBILE)} />
        </div>

        <Input
          placeholder="search files"
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
