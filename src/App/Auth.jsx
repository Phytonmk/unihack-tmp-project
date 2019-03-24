import React, { Component } from 'react'
import { Input, Button } from 'antd';

class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      loading: false
    }
  }
  login() {
    this.setState({
      loading: true
    })
    setTimeout(() => {
      localStorage.setItem('biocad-tool-user', JSON.stringify({
        username: this.state.login,
        password: this.state.password
      }))
      this.props.reload()
    }, 1000);
  }
  render() {
    return (
      <div className="auth-page">
        <Input placeholder="Логин" value={this.state.login} onChange={({ target: { value }}) => this.setState({ login: value})}/>
        <Input placeholder="Пароль" type="password" value={this.state.password} onChange={({ target: { value } }) => this.setState({ password: value})}/>
        <Button type="primary" loading={this.state.loading} onClick={() => this.login()}>Войти</Button>
      </div>
    )
  }
}

export default Auth