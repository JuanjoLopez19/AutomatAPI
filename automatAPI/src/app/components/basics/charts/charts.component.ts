import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ECharts, EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts'),
      },
    },
  ],
})
export class ChartsComponent implements OnInit {
  @Input() chartType: string = null;
  @Input() chartData: string[] = null;
  @Input() maxValue: number = null;
  echartsInstance: ECharts;
  chartOptions: EChartsOption;

  constructor(private translateService: TranslateService) {}

  onChartInit(event: { chart: echarts.ECharts }) {
    this.echartsInstance = event.chart;
  }

  ngOnInit(): void {
    this.mapChartOptions(this.chartType);
  }

  mapChartOptions(type: string): void {
    let aux: EChartsOption;
    this.translateService
      .get([
        'T_FLASK_STATS',
        'T_EXPRESS_STATS',
        'T_DJANGO_STATS',
        'T_SERVICES',
        'T_APP_WEB',
        'T_NUM_TEMPLATES',
      ])
      .subscribe((res) => {
        aux = {
          title: {
            text: res['T_' + type.toUpperCase() + '_STATS'],
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
              return (
                params[0].name +
                '<br/>' +
                params[0].seriesName +
                ': ' +
                params[0].value
              );
            },
          },
          xAxis: {
            type: 'category',
            data: [res['T_SERVICES'], res['T_APP_WEB']],
            axisPointer: {
              type: 'shadow',
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: 'value',
            name: res['T_NUM_TEMPLATES'],
            nameTextStyle: {
              align: 'left',
            },
            axisLabel: {
              formatter: '{value}',
            },
            max: this.maxValue,
          },
          series: [
            {
              name: res['T_' + type.toUpperCase() + '_STATS'],
              type: 'bar',
              data: [Number(this.chartData[0]), Number(this.chartData[1])],
              itemStyle: {
                color: function (params: any) {
                  const tech = params.seriesName.split(' ')[0].toLowerCase();
                  const index = params.dataIndex;
                  const flaskColors = ['#204FA1', 'rgba(40, 108, 225, 0.65)'];
                  const expressColors = ['#f9a826', '#FAB464'];
                  const djangoColors = ['#1c633a', 'rgba(0, 200, 83, 0.65)'];

                  switch (tech) {
                    case 'flask':
                      return flaskColors[index];
                    case 'express':
                      return expressColors[index];
                    case 'django':
                      return djangoColors[index];
                    default:
                      return '#000';
                  }
                },
              },
            },
          ],
        };
      })
      .add(() => {
        this.chartOptions = aux;
      });
  }

  chooseColor(params: any, type: string): string {
    console.log(params);
    switch (type) {
      case 'flask':
        return '#f7b733';
      case 'express':
        return '#e74c3c';
      case 'django':
        return '#3498db';
      default:
        return '#000';
    }
  }
}
