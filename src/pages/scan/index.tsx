import { useEffect, useState } from 'react';
import useMib from '@/pages/home/hooks/useMib';
import * as echarts from 'echarts/core';
import { SearchOutlined } from '@ant-design/icons';
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import ReactECharts from 'echarts-for-react';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Button } from 'antd';
import { useSetState } from 'ahooks';
import chartDefaultOption from './option';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;
export default function Index() {
  const [isClick, setIsClick] = useState(false);
  const [chartOption, setChartOption] = useSetState<EChartsOption>(chartDefaultOption as EChartsOption);
  const [loading, setLoading] = useState(false);
  const [, u] = useMib();

  const enterLoading = async () => {
    setIsClick(true);
    setLoading(true);
    const instance = await u();
    await window.core.scan(instance.config.output);
  };

  useEffect(() => {
    window.core.scanDone((e, data) => {
      if (data.result) {
        Reflect.deleteProperty(data.result, 'all');
        const r = Object.values(data.result)
          .map((i) => ({
            ...i,
            value: i.size,
          }));
        console.log('扫描结束', r);
        setLoading(false);
        setChartOption({
          series: [{
            data: r,
          },
          ],
        });
      }
    });
  }, []);

  return (
    <div className={`w-${window.innerWidth} h-[500px] relative`}>
      <ReactECharts className={`w-${window.innerWidth} h-[500px]!`} showLoading={loading} option={chartOption} />
      {!isClick
        ? (
          <Button
            className="text-md absolute top-[230px] cursor-default"
            size="large"
            style={{ left: `${document.body.clientWidth / 2 - 70}px` }}
            icon={<SearchOutlined />}
            onClick={() => enterLoading()}
            type="text"
          >
            开始分析
          </Button>
        )
        : ''}
    </div>
  );
}
