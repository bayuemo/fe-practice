import Taro, { Component, Config, cloud } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtCheckbox, AtButton, AtModal } from 'taro-ui'

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
      questionList:[],
      currentIndex:0,
      currentQuestion:{
        question:'',
        answer:null,
        options:[]
      },
      checkedList: [],
      flag:status.doing,
      isOpened:false
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
    const {currentIndex} = this.state;
    cloud
      .callFunction({
        name: "practices",
      })
      .then(res => {
        const list = res.result.data || [];
        list.sort(() => Math.random()-0.5)
        this.setState({
          questionList:list,
          currentQuestion:list[currentIndex]
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
      flag:this.state.currentQuestion.answer === newValue?status.right:status.error
    })
  }
  handleonpage = () => {
    const {currentIndex,questionList,checkedList} = this.state; 
    const index = currentIndex-1;
    // 存储当前题目选中值
    questionList[currentIndex].userAnswer = checkedList
    // 获取上一题的选中值
    const prevChecked = questionList[index].userAnswer || [];
    // 获取上一题的选中状态
    let prevFlag=status.doing;
    if(questionList[index].userAnswer&&questionList[index].userAnswer[0]) { // 上一题有选中值的情况
      if(questionList[index].userAnswer[0] === questionList[index].answer) {
        prevFlag=status.right;
      } else {
        prevFlag=status.error;
      }
    }
    this.setState({
      currentIndex:index,
      currentQuestion:questionList[index],
      checkedList:prevChecked,
      flag:prevFlag
    })
  }
  handlenextpage = () => { 
    const {currentIndex,questionList,checkedList} = this.state; 
    const index = currentIndex+1;
    if(index >= questionList.length){
      this.setState({
        isOpened:true
      })
      return;
    }
    // 存储当前题目选中值
    questionList[currentIndex].userAnswer = checkedList
    // 获取下一题的选中值
    const nextChecked = questionList[index].userAnswer || [];
    // 获取下一题的选中状态
    let nextFlag=status.doing;
    if(questionList[index].userAnswer&&questionList[index].userAnswer[0]) { // 下一题有选中值的情况
      if(questionList[index].userAnswer[0] === questionList[index].answer) {
        nextFlag=status.right;
      } else {
        nextFlag=status.error;
      }
    }
    this.setState({
      currentIndex:index,
      currentQuestion:questionList[index],
      checkedList: nextChecked,
      flag:nextFlag,
    })
  }
  handleClose = () => {
    this.setState({
      isOpened:false
    })
  }

  render () {
    const {checkedList,flag,currentQuestion,isOpened,currentIndex} = this.state;
    return (
      <View className='index'>
        <View className='question'>{currentQuestion.question}</View>
        <AtCheckbox
        options={currentQuestion.options}
        selectedList={checkedList}
        onChange={this.handleChange.bind(this)}
        />
        <View className='button_box'>
          <AtButton disabled={currentIndex===0} type='primary' className='button on' onClick={this.handleonpage}>上一题</AtButton>
          <AtButton type='primary' className='button next' onClick={this.handlenextpage}>下一题</AtButton>
        </View>
        <View className='circle' style={{background:flag.bgcolor}}>{flag.text}</View>
        <AtModal
          isOpened={isOpened}
          title='恭喜您'
          confirmText='朕知道了'
          onClose={this.handleClose}
          onConfirm={this.handleClose}
          content='您已通关啦！！！！'
        />
      </View>
    )
  }
}
