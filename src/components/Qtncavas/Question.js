import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui'
import { QuestionChoice } from "./QuestionType/QuestionChoice";
import { QuestionOpen } from "./QuestionType/QuestionOpen";
import { QuestionText } from "./QuestionType/QuestionText";

@connect(({ edit, home, common }) => ({
    ...edit,
    ...home,
    ...common
  }))

class Question extends Component {
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
    const {questions,page,index} = this.props
    console.log(page)
    console.log(index)
    this.props.dispatch({
      type: 'edit/saveQuestion',
      payload: {
        optsList:questions,
        pageIndex:page,
        index
      }
    }).then(()=>{
      Taro.navigateTo({url:'/pages/edit/editOpt'})
    })
  }

  render() {
      const {questions,page,index} = this.props
    return (
      <View className='question'>
        <View className='question-set'>
        <View onClick={this.handelEditOpt} className='question-edit'><AtIcon value='trash' size='18' color='#242425'></AtIcon></View>
        <View onClick={this.handelEditOpt} className='question-edit' style={{marginRight:'10px'}}><AtIcon value='edit' size='18' color='#242425'></AtIcon></View>
        </View>
       {questions.type === 6 && <QuestionText opts={questions} page={page} index={index} />}
       {questions.type === 1 && <QuestionChoice  opts={questions} page={page} index={index} />}
       {questions.type === 2 &&  <QuestionOpen opts={questions} page={page} index={index} />}
      </View>
    )
  }
}

export default Question
