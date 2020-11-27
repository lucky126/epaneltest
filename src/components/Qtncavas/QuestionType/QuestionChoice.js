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

class QuestionChoice extends Component {
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
    const {opts,page,index} = this.props
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        optsList:opts,
        page:page,
        index
      }
    })
    Taro.navigateTo({url:'/pages/edit/editOpt'})
  }

  render() {
      const {opts} = this.props
    return (
      <View className='choice'>
          <View className='choice-edit'>
            <View className='choice-text'>
              {opts.disSeq + '.' + opts.text}
            </View>
            <View onClick={this.handelEditOpt}><AtIcon value='edit' size='18' color='#2d8cf0'></AtIcon></View>
          </View>
          {opts.selectType == 0 && (
                <View>
                {opts.opts.map((opt,index)=>(
                    <View className='choice-single'>
                    <Radio 
                        style={{transform: 'scale(0.8)'}}
                        value='选中' 
                    ></Radio>
                    <Text>{opt.label}</Text>
                    </View>
                ))}
                </View>
          )}
          {opts.selectType == 1 && (
               <View>
               {opts.opts.map((opt,index)=>(
                   <View className='choice-single'>
                     <Checkbox 
                          style={{transform: 'scale(0.8,0.8)'}}
                         value='选中' 
                     ></Checkbox>
                     <Text>{opt.label}</Text>
                   </View>
               ))}
           </View>
         )}
         
      </View>
    )
  }
}

export default QuestionChoice
