import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui'

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
    return (
      <View className='open'>
          <View className='open-edit'>
            <View className='open-text'>
              {opts.disSeq + '.' + opts.text}
            </View>
          </View>
          {(opts.selectType == 1 || opts.selectType == 2) && opts.opts.map((item)=>(
            <View className='open-height'>
              <Text className='open-label' style={{width: !!item.label ?'20%':'' }}>{item.label}</Text>
              <Input className='open-input' style={{width: !!item.label ?'80%':'100%' }}></Input>
          </View>
          ))}
           {(opts.selectType != 1 && opts.selectType !== 2) && (
            <View style={{lineHeight:'35px'}}>
           此题不可编辑
         </View>
         )}
        
      </View>
    )
  }
}

export default QuestionOpen
