import { EChartsOption } from 'echarts';
import { readablizeBytes } from '@/utils';

export default {
  height: '500px',
  tooltip: {
    trigger: 'item',
    formatter(params:any) {
      return `<strong>类型:</strong> ${params.name}<br /><strong>占用大小:</strong> ${readablizeBytes(params.value || 0)}`;
    },
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
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
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
} as EChartsOption;
