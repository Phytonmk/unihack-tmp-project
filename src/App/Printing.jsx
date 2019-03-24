import React, { Component } from 'react'
import { Upload, Icon, message, List, Modal, Button } from 'antd'
const Dragger = Upload.Dragger

class Printing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  parseXlsx() {
    this.setState({ visible: false })
  }
  render() {
    const data = Array(6).fill(0).map((_, index) => ({
      id: index,
      title: 'Некоторый документ ' + index,
    }))
    return (
      <React.Fragment>
        <Button onClick={() => this.setState({ visible: true })}><Icon type="file-text" />Печать документов</Button>
        <Modal title="Документы, доступные для печати" okText="Ок" cancelText="Отмена" visible={this.state.visible} onOk={() => this.parseXlsx()} onCancel={() => this.setState({ visible: false })}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item key={data.id}>
                <List.Item.Meta
                  avatar={<Icon type="file-text" />}
                  title={item.title}
                  description={<a href="https://google.com/">Скачать</a>}
                />
              </List.Item>
            )}
          />
        </Modal>
      </React.Fragment>
    )
  }
}

export default Printing