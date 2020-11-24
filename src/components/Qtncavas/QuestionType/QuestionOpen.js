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

class QuestionOpen extends Component {
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
    console.log(val)
  }

  render() {
      const {qtn} = this.props
    return (
      <View className='qtnheader'>
       填空
      </View>
    )
  }
}

export default QuestionOpen
