import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import { AtRadio,AtInput }  from 'taro-ui'
import './Open/open.scss'
import './Choice/style/open.scss'
import { connect } from '@tarojs/redux';

@connect(({ edit,home, common }) => ({
  ...edit,
  ...home,
  ...common
}))
class QuestionOpen extends Component {
  constructor(props) {
      super(props)
      this.state = {
          vaule:''
      }
      this.handleText = this.handleText.bind(this)
  }

  handleChange (value) {
    this.setState({
      value
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
  
  render() {
    const {opts} = this.props
    return (
      <View className='open'>
        <View className='open-width'>
          <AtInput
            name='value'
            title='题目标题'
            type='text'
            placeholder='请输入题目标题'
            value={opts.text}
            onChange={this.handleText}
         />
        </View>
      </View>
    )
  }
}

export default QuestionOpen
