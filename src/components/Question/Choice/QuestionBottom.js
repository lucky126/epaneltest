import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import { AtIcon }  from 'taro-ui'
import './style/question.scss'
import { connect } from '@tarojs/redux';

@connect(({ edit,home, common }) => ({
  ...edit,
  ...home,
  ...common
}))

class QuestionBottom extends Component {
  constructor(props) {
      super(props)
      this.state = {
          vaule:''
      }
      this.addOpt = this.addOpt.bind(this)
  }

  addOpt() {
    const {opts,isChange} = this.props
    const type = opts.type
    let questionnaire = this.props.qtn
    let conf = type === 2 ? {width: 20, height: 1} : {}
    const required = type === 2
    // fixSeq and mySeq will be modified in updater.addOpt
    let opt = {
      fixSeq: '',
      fmt: 'text',
      img: '',
      input: false,
      label:"新选项",
      mySeq: `A${opts.opts.length + 1}`,
      optQuote: false,
      position: 0,
      required,
      seq: opts.opts.length + 1,
      val: opts.opts.length + 1,
      value:opts.opts.length + 1,
      conf
    }

    const newOptList = opts.opts.concat(opt)
        questionnaire.pageList.map((pageList)=>{
          pageList.qtList.map((item,key)=>{
            if(item.disSeq === opts.disSeq){
              item.opts = newOptList
            } 
          })
        })       
        this.props.dispatch({
            type: 'edit/save',
            payload: {
              qtn:questionnaire,
              isChange:!isChange
            }
          })
  }
  
  render() {
    return (
      <View className='opt-add' onClick={this.addOpt}>
         <AtIcon value='add-circle' size='30' color='#71a0f7'></AtIcon>
         <View className='add'>添加选项</View>
      </View>
    )
  }
}

export default QuestionBottom
