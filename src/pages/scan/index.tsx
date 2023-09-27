import { useState } from 'react';
import * as echarts from 'echarts/core';
import { SearchOutlined } from '@ant-design/icons';
import {
  LegendComponent, LegendComponentOption, TooltipComponent, TooltipComponentOption,
} from 'echarts/components';
import ReactECharts from 'echarts-for-react';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Button } from 'antd';
import { useMount, useSetState } from 'ahooks';
import { useRecoilState } from 'recoil';
import { ThemeType } from '@/lib/css/theme';
import { useTranslation } from 'react-i18next';
import chartDefaultOption from './option';
import { themeModeState } from '../../../state/themeState';
import darkTheme from './dark.json';

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
  const { t } = useTranslation();
  const [isClick, setIsClick] = useState(false);
  const [themeMode] = useRecoilState(themeModeState);
  const [chartOption, setChartOption] = useSetState<EChartsOption>(chartDefaultOption as EChartsOption);
  const [loading, setLoading] = useState(false);
  const [outputPath, setOutputPath] = useState('');
  const enterLoading = async () => {
    setIsClick(true);
    setLoading(true);
    const cfg = await window.core.instanceConfig();
    await window.core.scan(cfg.output);
  };
  const loadPath = async () => {
    const { output } = await window.core.instanceConfig();
    setOutputPath(output);
  };
  useMount(() => {
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

    loadPath();
  });
  return (
    <div className={`w-${window.innerWidth} h-[500px] relative`}>
      <ReactECharts className={`w-${window.innerWidth} h-[500px]!`} theme={themeMode === ThemeType.LIGHT ? 'default' : darkTheme} showLoading={loading} option={chartOption} />
      {!isClick
        ? (
          <Button
            className="text-md absolute top-[230px] cursor-default"
            size="large"
            style={{ left: `${document.body.clientWidth / 2 - 70}px` }}
            icon={<SearchOutlined />}
            onClick={() => enterLoading()}
            type="text"
            title={`scan path ${outputPath}`}
          >
            {t('scan.start')}
          </Button>
        )
        : ''}
    </div>
  );
}
