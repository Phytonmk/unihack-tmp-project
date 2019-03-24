import React, { Component } from 'react'
import { PageHeader, Button, Icon, Avatar, Tabs, Popover, message, Spin } from 'antd'
import Moment from 'moment'
const TabPane = Tabs.TabPane
import axios from 'axios'

import LeftBar from './LeftBar.jsx'
import KebabsArea from './KebabsArea.jsx'
import FilesUploading from './FilesUploading.jsx'
import Printing from './Printing.jsx'
import Dashboard from './Dashboard.jsx'
import Auth from './Auth.jsx'

const lineHeight = 40

const randomEq = Array(30).fill(0).map((_, index) => ({
  title: Math.round(Math.random() * 1000000),
  id: 'item_' + index,
  disabled: false
}))
const start = new Moment(new Date('03-18-2019'))
const randomData = Array(30).fill(0).map((_, eq) => Array(Math.floor(30 * Math.random()) + 0).fill(0).map((_, processing) => {
  const start = processing + Math.round(30 * Math.random())
  return ({
    eq,
    id: Math.random(),
    start: new Moment().add(start, 'day').unix(),
    finish: new Moment().add(start + Math.round(Math.random() * 10), 'day').unix(),
  })
}))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: localStorage.getItem('biocad-tool-user') && JSON.parse(localStorage.getItem('biocad-tool-user')),
      scrollOrigin: 'left',
      equipment: [],
      equipmentNames: [],
      laoded: false,
      equipmentIds: [],
      data: [],
      notRefreshedChanges: false,
      filesModal: true,
      tab: 'timeline'
    }
  }
  leftBarRefHandler(node) {
    if (!node)
      return
    if (this.leftBarRef) {
      this.leftBarRef = node
    } else {
      this.leftBarRef = node
      this.forceUpdate()
    }
  }
  logOut() {
    localStorage.removeItem('biocad-tool-user')
    this.setState({
      user: null
    })
  }
  componentDidMount() {
    this.loadData()
  }
  syncEq() {
    const equipment = []
    console.log(this.state.equipmentIds, this.state.equipmentNames)
    for (let eq of this.state.equipmentNames) {
      if (this.state.equipmentIds.includes(eq.id))
        equipment[this.state.equipmentIds.indexOf(eq.id)] = {
          id: eq.id,
          title: eq.name,
          disabled: false
        }
    }
    console.log(equipment)
    this.setState({ equipment })
  }
  loadData() {
    if (!this.state.user)
      return
    this.setState({
      loaded: false,
    })
    axios.get('http://ec2-3-121-231-30.eu-central-1.compute.amazonaws.com:5000/get/table?table=equipment', {
      headers: {
        'X-Auth-user-login': this.state.user.username,
        'X-Auth-user-password': this.state.user.password
      }  
    }).then(res => {
      this.setState({
        equipmentNames: res.data.map(row => ({
          id: row[0],
          name: row[1]
        }))
      })
      this.syncEq()
    }).catch(console.log)
    axios.get('http://ec2-3-121-231-30.eu-central-1.compute.amazonaws.com:5000/get/schedule', {
      headers: {
        'X-Auth-user-login': this.state.user.username,
        'X-Auth-user-password': this.state.user.password
      }
    })
      .then(res => {
        console.log(res)
        res.data.length = 3000
        // const allEquipment = []
        const equipmentIds = []
        const data = []
        const lines = {}
        for (let i = 0; i < res.data.length; i++) {
          // if (!equipment.find(eq => eq === res.data[i].equipment_id))
          // allEquipment.push({
          //   title: res.data[i].equipment_id,
          //   id: res.data[i].equipment_id,
          //   disabled: false
          // })
          const chunk = ({
            eq: res.data[i].equipment_id,
            id: res.data[i].order_id,
            start: res.data[i].start_time - 60 * 60 * 3,
            finish: res.data[i].finish_time - 60 * 60 * 3,
          })//res.data[i]
          if (lines[res.data[i].equipment_id] === undefined)
            lines[res.data[i].equipment_id] = [chunk]
          else
            lines[res.data[i].equipment_id].push(chunk)
        }
        for (let line in lines) {
          equipmentIds.push(line)
          data.push(lines[line])
        }
        // for (let i = 0; i < allEquipment.length; i++) {
        //   if (allEquipment.findIndex(eq => eq.id === allEquipment[i].id) === i)
        //     equipment.push(allEquipment[i])
        // }
        console.log(data)
        this.setState({ data, equipmentIds, notRefreshedChanges: false, loaded: true })
        this.syncEq()
      })
      .catch(err => {
        console.log(err)
        message.error('Не удалось получить данные с сервера')
      })
  }
  toggleTab() {
    console.log(this.state.tab)
    this.setState({ tab: (this.state.tab === 'timeline') ? 'dashboard' : 'timeline' })
  }
  render() {
    if (!this.state.user)
      return <Auth reload={() => this.setState({ user: localStorage.getItem('biocad-tool-user') && JSON.parse(localStorage.getItem('biocad-tool-user')) })}/>
    
    return (
      <React.Fragment>
        <PageHeader
          title=""
          subTitle={
            <div className="top-bar">
              {this.state.notRefreshedChanges && <Button onClick={() => this.setState({ filesModal: true })}><Icon type="reload" />Обновить</Button>}
              <FilesUploading />
              <Button onClick={() => this.toggleTab()}><Icon type="dashboard" />Анализ данных</Button>
              <Printing />
              <Popover placement="bottomRight" content={<a href="#" onClick={() => this.logOut()}>Выйти из аккаунта</a>}>
                <Avatar style={{ verticalAlign: 'middle' }} size="small" icon="user" /> <span style={{ verticalAlign: 'middle' }}>{this.state.user.username}</span>
              </Popover>
            </div>
          }
        />
        <Tabs activeKey={this.state.tab} /* onChange={tab => this.setState({ tab })} */>
          <TabPane tab="timeline" key="timeline">
            {
              (!this.state.loaded) ? 
                (
                  <div className="loader">
                      <Spin size="large" />
                    </div>
                ) : (
                  <React.Fragment>
                    <LeftBar
                      items={this.state.equipment}
                      scroll={this.props.scrollOrigin !== 'left' && this.state.scroll}
                      onRefChange={node => this.leftBarRefHandler(node)}
                      lineHeight={lineHeight}
                      onChange={equipment => this.setState({ equipment, notRefreshedChanges: true })}
                    />
                    <KebabsArea
                      lineHeight={lineHeight}
                      unitWidth={1000}
                      scrollFollower={this.leftBarRef}
                      start={new Moment('03-18-2019').unix()}
                      items={this.state.data}
                    />
                  </React.Fragment>
                )
                }
          </TabPane>
          <TabPane tab="dashboard" key="dashboard" className="scrollable-tab">
            <Dashboard />
          </TabPane>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default App