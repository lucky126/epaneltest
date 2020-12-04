import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtInput } from 'taro-ui'

@connect(({ edit, home, common }) => ({
    ...edit,
    ...home,
    ...common
  }))

class QtnHeader extends Component {
  static propTypes = {
    qtn: PropTypes.object
  };
  constructor(props) {
    super(props)
    this.state = {
        
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(val){
    let questionnaire = this.props.qtn
    questionnaire.title = val
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        qtn:questionnaire
      }
    })
  }

  render() {
      const {qtn} = this.props
    return (
      <View className='qtnheader'>
       <AtInput
         name='value'
         title=''
         type='text'
         placeholder='问卷标题'
         value={qtn.title}
         onChange={(val)=>this.handleChange(val)}
      />
      </View>
    )
  }
}

export default QtnHeader
