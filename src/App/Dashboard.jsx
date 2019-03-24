import React, { Component } from 'react'
import { Tabs, Table } from 'antd'
import ChartistGraph from 'react-chartist'
import AxisTitlesPlugin from 'chartist-plugin-axistitle'
import DataSet from '@antv/data-set'
import Moment from 'moment'
import '../Chartist.css'
import ResizeObserver from 'react-resize-observer'
Moment.locale('ru')
const TabPane = Tabs.TabPane

const data = {
  labels: Array(365).fill(0).map((_, index) => new Moment().subtract(index, 'day').format('dd-mm-YYYY')),
  series: [Array(365).fill(0).map((_, index) => Math.round(Math.random() * 3))]
}

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      size: {
        height: 0,
        width: 0
      },
      failedDeadlinesTimeDuration: 'week',
      tab: 'deadlines'
    }
  }
  render() {
    let max = 0
    for (let value of data.series[0])
      if (value > max)
        max = value
    if (max < 5)
      max = 5
    const barChartWidth = (window.innerWidth > 1000) ? (window.innerWidth - 350) : window.innerWidth
    const barChartConfigs = {
      high: max,
      low: 0,
      height: 200,
      color: '#37ad04',
      width: barChartWidth,
      plugins: [
        AxisTitlesPlugin({
          axisY: {
            axisTitle: 'Ожидаемые провалы',
            offset: {
              x: 0,
              y: -15
            },
            axisClass: "ct-axis-title"
          }
        })
      ],
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    }
    return (
      <React.Fragment>
        <Tabs activeKey={this.state.tab} onChange={tab => this.setState({ tab })}>
          <TabPane tab="Соблюдение дедлайнов" key="deadlines">
            <Tabs style={{ width: barChartWidth, display: 'inline-block' }} tabPosition="bottom" activeKey={this.state.failedDeadlinesTimeDuration} onChange={failedDeadlinesTimeDuration => this.setState({ failedDeadlinesTimeDuration })}>
              <TabPane tab="Неделя" key="week" forceRender={true}>
                <ChartistGraph data={{ labels: data.labels.slice(0, 7), series: [data.series[0].slice(0, 7)] }} options={barChartConfigs} type={'Bar'} />
              </TabPane>
              <TabPane tab="Месяц" key="month" forceRender={true}>
                <ChartistGraph data={{ labels: data.labels.slice(0, 30), series: [data.series[0].slice(0, 30)] }} options={barChartConfigs} type={'Bar'} />
              </TabPane>
              <TabPane tab="3 Месяца" key="3months" forceRender={true}>
                <ChartistGraph data={{ labels: data.labels.slice(0, 91), series: [data.series[0].slice(0, 91)] }} options={barChartConfigs} type={'Bar'} />
              </TabPane>
            </Tabs>
            <div className="pie-chart" style={barChartWidth === window.innerWidth ? { display: 'block' } : {}}>
              <ChartistGraph data={{ series: [10, 90] }} options={{
                donut: true,
                donutWidth: 60,
                height: 220,
                width: 220,
                donutSolid: true,
                startAngle: 270,
                showLabel: true
              }} type={'Pie'} />
              <p><strong>10%</strong> дедлайнов ожидают провала</p>
            </div>
            <br />
            <h3 style={{ textAlign: 'center' }}>Ожидаемые провалы дедлайнов</h3>
            <br />
            <Table
              locale={{
                filterConfirm: 'Ок',
                filterReset: 'Сбросить',
                emptyText: 'Нет данных, пусто'
              }}
              columns={[{
                title: '№ Заказа',
                dataIndex: 'order'
              }, {
                title: 'Дата дедлайна',
                dataIndex: 'date'
              }, {
                title: 'Рекомендации для предотвращения',
                dataIndex: 'prevent'
              }]}
              dataSource={[]}
            />
          </TabPane>
          <TabPane tab="Предотвращение нарушения дедлайнов" key="prevent">
            <h3 style={{ textAlign: 'center' }}>Чтобы предовтратить грядущие дедлайны вам следует выполнить следующее:</h3>
            <Table
              locale={{
                filterConfirm: 'Ок',
                filterReset: 'Сбросить',
                emptyText: 'Нет данных, пусто'
              }}
              columns={[{
                title: 'ID оборудования',
                dataIndex: 'order'
              }, {
                title: 'Наименование оборудования',
                dataIndex: 'date'
              }, {
                title: 'Действие',
                dataIndex: 'prevent'
              }]}
              dataSource={[]}
            />
          </TabPane>
          <TabPane tab="Поломки оборудования" key="facilities">
            <h3 style={{ textAlign: 'center' }}>График ожидаемых поломок</h3>
            <ChartistGraph data={{ labels: data.labels.slice(0, 20), series: [data.series[0].slice(0, 20)] }} options={(() => {
              const configs = Object.assign({}, barChartWidth)
              configs.width = window.innerWidth
              return configs
            })()} type={'Line'} />
            <h3 style={{ textAlign: 'center' }}>Список ожидаемых поломок:</h3>
            <Table
              locale={{
                filterConfirm: 'Ок',
                filterReset: 'Сбросить',
                emptyText: 'Нет данных, пусто'
              }}
              columns={[{
                title: 'ID оборудования',
                dataIndex: 'order'
              }, {
                title: 'Наименование оборудования',
                dataIndex: 'date'
              }, {
                title: 'Дата',
                dataIndex: 'prevent'
              }, {
                title: 'Возможная причина',
                dataIndex: 'prevent2'
              }]}
              dataSource={[]}
            />
          </TabPane>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default Dashboard