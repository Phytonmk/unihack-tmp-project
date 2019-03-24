import React, { Component } from 'react'
import { Button, Popover } from 'antd'
import Moment from 'moment'

const palette = [
  '#ffa39e',
  '#ff9c6e',
  '#ffc069',
  '#ffc069',
  '#fff566',
  '#d3f261',
  '#95de64',
  '#5cdbd3',
  '#69c0ff',
  '#69c0ff',
  '#b37feb',
  '#ff85c0',
  // '#a8071a',
  // '#ad2102',
  // '#ad4e00',
  // '#ad6800',
  // '#ad8b00',
  // '#5b8c00',
  // '#237804',
  // '#006d75',
  // '#0050b3',
  // '#10239e',
  // '#391085',
  // '#9e1068',
]

const randomFromString = (str) => {
  str = str.toString()
  let sum = 0
  for (let i = 0; i < str.length; i++)
    sum += str.charCodeAt(i)
  return Math.abs(Math.sin(sum ** 2))
}

const getBgColor = (title) => {
  const random = Math.floor(palette.length * randomFromString(title))
  return palette[random]
}
const getTextColor = (title) => {
  const random = Math.floor(palette.length * randomFromString(title))
  if (['#fff566', '#d3f261'].includes(palette[random]))
    return 'black'
  return 'white'
  // return random > palette.length / 2 ? 'white' : 'black'
}

class KebabsArea extends Component {
  constructor(props) {
    super(props)
    this.container = null
  }
  onScroll() {
    if (this.props.scrollFollower) {
      this.props.scrollFollower.scrollTop = this.container.scrollTop
    }
    this.forceUpdate()
  }
  setupRef(node) {
    if (!node)
      return
    if (!this.container) {
      this.container = node
      this.forceUpdate()
    } else {
      this.container = node
    }
  }
  render() {
    let width = 0
    let finish = this.props.start
    console.log(this.props.items)
    for (let line of this.props.items) {
      for (let column of line) {
        let offset = (column.finish - this.props.start) / (60 * 60 * 24) * this.props.unitWidth
        if (column.finish > finish)
          finish = column.finish
        if (offset > width)
          width = offset
      }
    }
    const dates = []
    if (this.props.start !== finish)
      for (let i = this.props.start; i <= finish; i += 1000 * 60) {
        dates.push(i)
      }
    return (
      <div ref={node => this.setupRef(node)} onScroll={ this.onScroll.bind(this) } className="kebabs-area cool-scrollbar" style={{ backgroundSize: `100% ${this.props.lineHeight}px` }}>
        <div className="scroll-expander" style={{ height: this.props.items.length * this.props.lineHeight + 20 }} />
        <ul className="dates-list">
          {dates.map(date => <li key={date} style={{ left: (date - this.props.start) / (60 * 60 * 24) * this.props.unitWidth}}>{Moment.unix(date).format("HH:mm MM/DD/YYYY")}</li>)}
        </ul>
        <ul className="line-list">
          {this.props.items.map((item, index) =>
            this.container &&
            index * this.props.lineHeight > this.container.scrollTop - 30 &&
            index * this.props.lineHeight < this.container.clientHeight + this.container.scrollTop + 30 &&
            <li className="line-el" key={index} style={{ top: index * this.props.lineHeight + 10 + 'px', height: this.props.lineHeight, lineHeight: this.props.lineHeight + 'px' }}>
              <div className="scroll-expander" style={{ width }} />
              <ul className="processing-list">
                {item.map((item, index) =>
                  this.container &&
                  ((item.finish - this.props.start) / (60 * 60 * 24)) * this.props.unitWidth > this.container.scrollLeft - 30 &&
                  ((item.start - this.props.start) / (60 * 60 * 24)) * this.props.unitWidth < this.container.clientWidth + this.container.scrollLeft + 30 &&
                  <li key={item.processing} className="processing-el" style={{
                    width: (item.finish - item.start) / (60 * 60 * 24) * this.props.unitWidth,
                    left: (item.start - this.props.start) / (60 * 60 * 24) * this.props.unitWidth,
                  }}>
                    <Popover content={`Заказ номер ${item.id}. Время работы: ${Moment.unix(item.start).format("HH:mm MM/DD/YYYY")} - ${Moment.unix(item.finish).format("HH:mm MM/DD/YYYY")}`}>
                      <Button type="primary" style={{
                        backgroundColor: getBgColor(item.id),
                        borderColor: getBgColor(item.id),
                        color: getTextColor(item.id),
                        width: (item.finish - item.start) / (60 * 60 * 24) * this.props.unitWidth
                      }}>{item.id}</Button>
                    </Popover>
                  </li>)}
              </ul>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default KebabsArea