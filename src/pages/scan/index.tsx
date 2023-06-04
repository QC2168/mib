import { useEffect, useRef, useState } from 'react';
import useMib from '@/pages/home/hooks/useMib';
import * as echarts from 'echarts/core';
import { SearchOutlined } from '@ant-design/icons';
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Button } from 'antd';

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

let reg: any = null;
let chartInstance: any = null;
export default function Index() {
  const [isClick, setIsClick] = useState(false);
  const [, u] = useMib();

  const enterLoading = async () => {
    setIsClick(true);
    const instance = await u();
    chartInstance.showLoading('default', {
      text: '正在分析中',
    });
    await window.core.scan(instance.config.output);
  };

  const pieRef = useRef<HTMLDivElement | null>(null);

  const initChart = () => {
    if (!pieRef.current) return;
    if (chartInstance !== null) return;
    chartInstance = echarts.init(pieRef.current);
  };
  const registerEvent = () => {
    let isRegister = false;
    return () => {
      if (isRegister) return;
      isRegister = true;
      window.core.scanDone((e, data) => {
        if (data.result) {
          Reflect.deleteProperty(data.result, 'all');
          const r = Object.values(data.result)
            .map((i) => ({
              ...i,
              value: i.size,
            }));
          console.log('扫描结束', r);

          chartInstance?.setOption({
            series: [
              {
                name: '数据分析',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: r,
              },

            ],
          });
          chartInstance.hideLoading();
          // createSuccessMessage(data.msg);
        } else {
          // createErrorMessage(data.msg);
        }
      });
    };
  };

  useEffect(() => {
    if (reg !== null) return;
    reg = registerEvent();
    reg();
  });

  useEffect(() => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [],
        },
      ],
    };
    if (!chartInstance) {
      initChart();
    }
    chartInstance.setOption(option);

    return () => {
      chartInstance = null;
    };
  });
  return (
    <div className={`w-${window.innerWidth} h-[500px] relative`}>
      <div className={`w-${window.innerWidth} h-[500px]`} ref={pieRef} />
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
