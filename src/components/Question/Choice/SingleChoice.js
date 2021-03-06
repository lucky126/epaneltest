import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import { AtInput, AtIcon  }  from 'taro-ui'
import './style/multi.scss'
import { connect } from '@tarojs/redux';

@connect(({ edit,home, common }) => ({
  ...edit,
  ...home,
  ...common
}))
class SingleChoice extends Component {
  constructor(props) {
      super(props)
      this.state = {
          vaule:''
      }
      this.handleText = this.handleText.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleDeleteOpt = this.handleDeleteOpt.bind(this)
  }

  handleChange (value,item) {
    if(value === ''){
      return
    }
    const {opts,isChange} = this.props
    let newOptList = opts.opts.filter((val)=> val.mySeq === item.mySeq ? val.label = value :val)
    let questionnaire = this.props.qtn
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((item,key)=>{
        if(item.disSeq === opts.disSeq){
           item.optlist = newOptList
        } 
      })
    })
    this.props.dispatch({
        type: 'edit/save',
        payload: {
          questionnaire,
          isChange:!isChange
        }
      })
  }

  handleText(value){
    const {opts,isChange} = this.props
    let questionnaire = this.props.qtn
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((item,key)=>{
        if(item.disSeq === opts.disSeq){
           item.text = value
        } 
      })
    })
    this.props.dispatch({
        type: 'edit/save',
        payload: {
          questionnaire,
          isChange:!isChange
        }
      })
  }
  

  //删除选项
  handleDeleteOpt(item,key){
    const { opts, isChange } = this.props
    if (opts.opts.length == 1) {
      const { opts, isChange } = this.props
      let questionnaire = this.props.qtn
      const pages = questionnaire.pageList.length
      let newQtlist = questionnaire.pageList.map((pg)=>{
        pg.qtList.filter((val) => val.disSeq != opts.disSeq)
      })
      newQtlist.map((item, key) => {
        item.disSeq = `Q${key + 1}`
        item.mySeq = `Q${key + 1}`
      })
      questionnaire.pageList.map((item) => {
        item.qtList = newQtlist
      })
      this.props.dispatch({
        type: 'edit/save',
        payload: {
          questionnaire,
          isChange: !isChange
        }
      })
      return
    }
    let newOptList = opts.opts.filter((val)=> val.mySeq !== item.mySeq)
    newOptList.map((val,key1)=>{
      val.mySeq = `A${key1+1}`
    })
    let questionnaire = this.props.qtn
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((qt,key)=>{
        if(qt.disSeq === opts.disSeq){
           qt.opts = newOptList
        } 
      })
    })
    console.log(questionnaire)
    this.props.dispatch({
        type: 'edit/save',
        payload: {
          questionnaire,
          isChange:!isChange
        }
      })
  }
  
  render() {
    const {opts} = this.props
    return (
      <View className='multi-choice'>
        <View className='multi-width'>
        <AtInput
          name='value'
          title='题目标题'
          type='text'
          placeholder='请输入题目标题'
          value={opts.text}
          onChange={this.handleText}
        />
          {opts.opts.map((item,key)=>(
            <View className='multi-opt' key={key}>
              <View className='multi-input'>
                <AtInput
                  border={false}
                  style={{width:'90%'}}
                  subtract
                  name='value'
                  title='选项'
                  type='text'
                  placeholder='选项'
                  value={item.label}
                  onChange={(val)=>this.handleChange(val,item)}
                />
              </View>
              <View className='multi-icon' onClick={(val)=>this.handleDeleteOpt(item,key)}>
                  <AtIcon value='subtract-circle' size='20' color='red'></AtIcon>
              </View>  
            </View>
          
          ))}
        </View> 
      </View>
    )
  }
}

export default SingleChoice
