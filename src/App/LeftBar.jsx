import React, { Component } from 'react'
import { Checkbox } from 'antd'

class LeftBar extends Component {
  constructor(props) {
    super(props)
    this.container = null
  }
  handleChange(index, value) {
    const items = [...this.props.items]
    items[index].disabled = value
    this.props.onChange(items)
  }
  setupRef(node) {
    if (!node)
      return
    if (!this.container) {
      this.props.onRefChange(node)
      this.container = node
      this.forceUpdate()
    } else {
      this.props.onRefChange(node)
      this.container = node
    }
  }
  render() {
    return (
      <div ref={node => this.setupRef(node)} onScroll={() => this.forceUpdate()} className="left-bar">
        <div className="scroll-expander" style={{ height: this.props.items.length * this.props.lineHeight + 20 + 'px' }} />
        <ul>
          {this.props.items.map((item, index) =>
            this.container &&
            index * this.props.lineHeight > this.container.scrollTop - 30 &&
            index * this.props.lineHeight < this.container.offsetHeight + this.container.scrollTop + 30 &&
            <li key={item.id} style={{ top: index * this.props.lineHeight + 10 + 'px', height: this.props.lineHeight, lineHeight: this.props.lineHeight + 'px' }}>
              <Checkbox id={`equipment_checkbox_${item.id}`} onChange={({ target: { checked } }) => this.handleChange(index, !checked)} checked={!item.disabled} />
              <label className="equipment-title" htmlFor={`equipment_checkbox_${item.id}`} style={{ textDecoration: item.disabled ? 'line-through' : 'none' }}>{item.title}</label>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default LeftBar