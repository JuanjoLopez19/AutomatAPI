import { Component } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  echartsInstance: ECharts;
  chartOptions: EChartsOption;

  onChartInit(event: { chart: echarts.ECharts }) {
    this.echartsInstance = event.chart;
  }
}
