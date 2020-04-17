import Taro, { Component, Config, request } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtCheckbox, AtButton  } from 'taro-ui'

import './index.scss'

import Login from '../../components/login/index'

const status = {
  doing:{
    text:'加油',
    bgcolor:'#ffe18b',
  },
  right:{
    text:'正确',
    bgcolor:'#c8fd86',
  },
  error:{
    text:'失误',
    bgcolor:'#f69195',
  }
}
export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      answer:1,
      question:'',
      checkedList: ['list1'],
      checkboxOption : [],
      flag:status.doing
    }
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config = {
    navigationBarTitleText: '前端能力测试'
  }

  componentWillMount () { }

  componentDidMount () { 
    Taro.cloud
      .callFunction({
        name: "practices",
      })
      .then(res => {
        console.log('res: ', res.result.data[0].question)
        this.setState({
          checkboxOption:res.result.data[0].options,
          question:res.result.data[0].question,
          answer:res.result.data[0].answer
        })
      })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (value) {
    const newValue = value[value.length-1]
    this.setState({
      checkedList: [newValue],
      flag:this.state.answer === newValue?status.right:status.error
    })
  }

  render () {
    const {checkboxOption,checkedList,question,flag} = this.state;
    return (
      <View className='index'>
        <View className='question'>{question}</View>
        <AtCheckbox
        options={checkboxOption}
        selectedList={checkedList}
        onChange={this.handleChange.bind(this)}
        />
        <View className='button_box'>
          <AtButton type='primary' className='button on'>上一题</AtButton>
          <AtButton type='primary' className='button next'>下一题</AtButton>
        </View>
        <View className='circle' style={{background:flag.bgcolor}}>{flag.text}</View>
      </View>
    )
  }
}
