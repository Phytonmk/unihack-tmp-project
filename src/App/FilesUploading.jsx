import React, { Component } from 'react'
import { Upload, Icon, message, Button, Modal, Tabs, Select, Table, Input, InputNumber, DatePicker  } from 'antd'
import locale from 'antd/lib/date-picker/locale/ru_RU';

const Dragger = Upload.Dragger
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const uploadingProps = {
  name: 'file',
  multiple: true,
  accept: '.xlsx',
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} успешно загружен.`);
    } else if (status === 'error') {
      message.error(`Ошибка при загрузке ${info.file.name}.`);
    }
  },
}

class FilesUploading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      tab: 'editing',
      tables: [{
        name: 'eq_hist_data',
        columns: [{
          type: 'number',
          title: 'day'
        }, {
          type: 'text',
          title: 'id',
          key: true
        }, {
          type: 'number',
          title: 'work'
        }, {
          type: 'number',
          title: 'maintenance'
        }, {
          type: 'number',
          title: 'idle'
        }, {
          type: 'text',
          title: 'class'
        }]
      }, {
        name: 'equipment',
        columns: [{
          type: 'text',
          title: 'id',
          key: true
        }, {
          type: 'text',
          title: 'class',
        }, {
          type: 'text',
          title: 'available_hours',
        }, {
          type: 'number',
          title: 'speed_per_hour',
        }]
      }, {
        name: 'product',
        columns: [{
          type: 'text',
          title: '_id',
          key: true
        }, {
          type: 'equipment',
          title: 'equipment_class'
        }]
      }, {
        name: 'order',
        columns: [{
          type: 'number',
          title: '_id',
          key: true
        }, {
          type: 'text',
          title: 'product_id'
        }, {
          type: 'number',
          title: 'amount'
        }, {
          type: 'date',
          title: 'deadline'
        }]
      }],
      tableData: [],
      selectedTable: null,
      selectedRowKeys: [],
      tableIsLoading: false,
      tablesChanges: [],
      insertedRows: []
    }
  }
  parseXlsx() {
    this.setState({
      loading: true
    })
    setTimeout(() => {
      this.setState({ visible: false, loading: false })
    }, 2000);
  }
  handleTableChange(key, index, column, value) {
    // console.log(key, index, column, value)
    const tableColumns = this.state.tables.find(table => table.name === this.state.selectedTable).columns
    const tableKey = tableColumns.find(column => column.key).title
    if (key || key === 0) {
      if (this.state.tablesChanges.find(change => 
        change.table === this.state.selectedTable && change.key === key && change.column === column
      )) {
        const tablesChanges = [...this.state.tablesChanges]
        const index = tablesChanges.findIndex(change => change.table === this.state.selectedTable && change.key === key && change.column === column)
        tablesChanges[index].value = value
        this.setState({ tablesChanges })
      } else {
        const tablesChanges = [...this.state.tablesChanges]
        let type = 'update'
        if (this.state.insertedRows.includes(index))
          type = 'insert'
        tablesChanges.push({
          key, index, column, value, type
        })
        this.setState({ tablesChanges })
      }
    } else {
      const tablesChanges = [...this.state.tablesChanges]
      const pos = tablesChanges.findIndex(change => change.index === index && change.column === column)
      if (pos >= 0) {
        tablesChanges[pos].value = value
      } else {
        let type = 'update'
        if (this.state.insertedRows.includes(index))
          type = 'insert'
        tablesChanges.push({
          key, index, column, value, type 
        })
      }
      this.setState({ tablesChanges })
    }
  }
  loadTable(selectedTable) {
    this.setState({ selectedTable, tableIsLoading: true, selectedRowKeys: [] })
    setTimeout(() => {
      const columns = this.state.tables.find(table => table.name === this.state.selectedTable).columns
      const tableData = Array(0).fill(0).map((_, index) => this.addRow(columns))
      this.setState({
        tableData, tableIsLoading: false, tablesChanges: [], insertedRows: [] })
    }, 500);
  }
  generateRow(columns, values={}) {
    const row = {}
    const key = columns.find(column => column.key).value
    for (let index in columns) {
      const column = columns[index]
      row[column.title] = {
        type: column.type,
        getValue: () => (this.state.tablesChanges.find(change => (change.key && change.key === key || change.index && change.index === index) && change.column === column.title) || values[column.title] || { value: column.type === 'equipment' ? [] : '' }).value,
        key,
        index
      }
    }
    return row
  }
  addRow(index) {
    const insertedRows = [...this.state.insertedRows]
    insertedRows.push(index)
    const tableData = [...this.state.tableData]
    const columns = this.state.tables.find(table => table.name === this.state.selectedTable).columns
    tableData.push(this.generateRow(columns))
    this.setState({ insertedRows, tableData })
  }
  sendDatabaseUpdate() {
    console.log(this.state.selectedTable, this.state.tablesChanges)
  }
  generateCells(row) {
    const result = []
    const allEquipment = ['УФ лампа', 'Система капиллярного электрофореза', 'Система очистки', 'Амплификатор', 'Система гель-документации', 'Термометр электронный', 'Микроскоп', 'Центрифуга', 'Денситометр']
    for (let title in row) {
      const value = row[title].getValue()
      if (row[title].type === 'number')
        result[title] = <InputNumber value={value} onChange={(value) => this.handleTableChange(row[title].key, row[title].index, title, value)} />
      else if (row[title].type === 'date')
        result[title] = <DatePicker value={value} onChange={(value) => this.handleTableChange(row[title].key, row[title].index, title, value)} locale={locale} />
      else if (row[title].type === 'equipment')
        result[title] = <Select value={value} onChange={(value) => this.handleTableChange(row[title].key, row[title].index, title, value)} style={{ width: '100%', maxWidth: 250 }} mode="tags" locale={locale}>{allEquipment.map(value => <Option key={value}>{value}</Option>)}</Select>
      else
        result[title] = <Input value={value} onChange={({ target: { value } }) => this.handleTableChange(row[title].key, row[title].index, title, value)} type="text" />
    }
    return result
  }
  render() {
    return (
      <React.Fragment>
        <Button onClick={() => this.setState({ visible: true })}><Icon type="edit" /> Изменить данные</Button>
        <Modal width={766} confirmLoading={this.state.loading} title={'Изменение данных'} okText="Ок" cancelText="Отмена" visible={this.state.visible}
          onOk={this.state.tab === 'uploading' ? () => this.parseXlsx() : () => this.sendDatabaseUpdate()} onCancel={() => this.setState({ visible: false })}>
          <Tabs activeKey={this.state.tab} onChange={tab => this.setState({ tab })}>
            <TabPane tab="Редактирование базы данных" key="editing">
              <Select defaultValue="Выберите таблицу для редактирования" style={{ minWidth: 300 }} onChange={(selectedTable) => this.loadTable(selectedTable)}>
                {this.state.tables.map(table =>
                  <Option value={table.name}>{table.name}</Option>
                )}
              </Select>
              {this.state.selectedTable && 
                <React.Fragment>
                  <br />
                  <br />
                  <Table
                    loading={this.state.tableIsLoading}
                    locale={{
                      filterConfirm: 'Ок',
                      filterReset: 'Сбросить',
                      emptyText: 'Нет данных, пусто'
                    }}
                    rowClassName={() => 'editable-row'}
                    bordered
                    rowSelection={{
                      selectedRowKeys: this.state.selectedRowKeys,
                      onChange: (selectedRowKeys) => this.setState({ selectedRowKeys })
                    }}
                    dataSource={this.state.tableData.map(row => this.generateCells(row))}
                    columns={this.state.tables.find(table => table.name === this.state.selectedTable).columns.map(column => ({
                      title: column.title,
                      dataIndex: column.title
                    }))}
                  />
                  <br />
                  <Button onClick={() => this.addRow()}><Icon type="plus" />Добавить строчку</Button>
                  <br />
                  <br />
                  {this.state.selectedRowKeys.length > 0 && <Button type="danger" onClick={() => this.removeRows()}><Icon type="plus" />Удалить выбранные ({this.state.selectedRowKeys.length})</Button>}
                </React.Fragment>
              }
            </TabPane>
            <TabPane tab="Импорт из MS Excel" key="uploading">
              <Dragger {...uploadingProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Нажмите или перетащите файл сюда</p>
              </Dragger>
            </TabPane>
          </Tabs>,
        </Modal>
      </React.Fragment>
    )
  }
}

export default FilesUploading