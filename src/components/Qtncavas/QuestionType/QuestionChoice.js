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
  }

  handleChange(val){
    console.log(val)
  }

  

  render() {
      const {opts} = this.props
    return (
      <View className='choice'>
          <View className='choice-edit'>
            <View className='choice-text'>
              {opts.disSeq + '.' + opts.text.replace(/<\/?.+?>/g, "")}
            </View>
          </View>
          {opts.selectType == 0 && (
                <View>
                {opts.opts.map((opt,index)=>(
                    <View className='choice-single' key={index}>
                    <Radio 
                        style={{transform: 'scale(0.8)'}}
                        value='选中' 
                    ></Radio>
                    <Text>{opt.label.replace(/<\/?.+?>/g, "")}</Text>
                    </View>
                ))}
                </View>
          )}
          {opts.selectType == 1 && (
               <View>
               {opts.opts.map((opt,index)=>(
                   <View className='choice-single' key={index}>
                     <Checkbox 
                          style={{transform: 'scale(0.8,0.8)'}}
                         value='选中' 
                     ></Checkbox>
                     <Text>{opt.label.replace(/<\/?.+?>/g, "")}</Text>
                   </View>
               ))}
           </View>
         )}
         {(opts.selectType != 0 && opts.selectType !== 1) && (
            <View style={{lineHeight:'35px',color: '#b7b3b3'}}>
           此题不可编辑
         </View>
         )}
        
      </View>
    )
  }
}

export default QuestionChoice
