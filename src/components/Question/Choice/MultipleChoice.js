import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import { AtRadio,AtInput, AtIcon  }  from 'taro-ui'
import './style/multi.scss'
import { connect } from '@tarojs/redux';

@connect(({ edit,home, common }) => ({
  ...edit,
  ...home,
  ...common
}))
class MultipleChoice extends Component {
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
    const {opts,isChange} = this.props
    if(value === ''){
      return
    }
    let newOptList = opts.opts.filter((val)=> val.mySeq === item.mySeq ? val.label = value :val)
    let questionnaire = this.props.qtn
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((item,key)=>{
        if(item.disSeq === opts.disSeq){
           item.opts = newOptList
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
    const {opts,isChange} = this.props
    if (opts.opts.length == 1) {
      const { opts, isChange } = this.props
      let questionnaire = this.props.qtn
      let newQtlist = questionnaire.pageList.map((pg)=>{
        pg.qtList.filter((val) => val.disSeq != opts.disSeq)
      })
      newQtlist.map((val, key) => {
        val.disSeq = `Q${key + 1}`
        val.mySeq = `Q${key + 1}`
      })
      questionnaire.pageList.map((val) => {
        val.qtList = newQtlist
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
    let questionnaire = this.props.qtn
    newOptList.map((val,key1)=>{
      val.mySeq = `A${key1+1}`
    })
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((val,key)=>{
        if(val.disSeq === opts.disSeq){
           val.opts = newOptList
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

export default MultipleChoice
