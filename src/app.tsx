import { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

import '@nutui/nutui-react-taro/dist/style.css'
import './assets/font/iconfont.css'
import './app.scss'

import React from 'react'

class App extends Component<PropsWithChildren> {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}
export default App
