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
      const {opts} = this.props
      console.log(opts)
    return (
      <View className='open'>
          <View className='open-text'>
              {opts.disSeq + '.' + opts.text}
          </View>
          {opts.opts.map((item)=>(
            <View className='open-height'>
              <Text className='open-label'>{item.label}</Text>
              <Input className='open-input'></Input>
          </View>
          ))}
          
      </View>
    )
  }
}

export default QuestionOpen
