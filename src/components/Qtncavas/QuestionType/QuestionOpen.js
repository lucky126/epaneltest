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
    this.handelEditOpt = this.handelEditOpt.bind(this)
  }

  handleChange(val){
    console.log(val)
  }

  handelEditOpt(){
    const {opts} = this.props
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        optsList:opts
      }
    })
    Taro.navigateTo({url:'/pages/edit/editOpt'})
  }

  render() {
      const {opts} = this.props
    return (
      <View className='open'>
          <View className='open-edit'>
            <View className='open-text'>
              {opts.disSeq + '.' + opts.text}
            </View>
            <View onClick={this.handelEditOpt}><AtIcon value='edit' size='18' color='#2d8cf0'></AtIcon></View>
          </View>
          {opts.opts.map((item)=>(
            <View className='open-height'>
              <Text className='open-label' style={{width: !!item.label ?'20%':'' }}>{item.label}</Text>
              <Input className='open-input' style={{width: !!item.label ?'80%':'100%' }}></Input>
          </View>
          ))}
          
      </View>
    )
  }
}

export default QuestionOpen
