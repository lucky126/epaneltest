import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtInput } from 'taro-ui'
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
  }

  handleChange(val){
    console.log(val)
  }

  render() {
      const {questions} = this.props
    return (
      <View className='question'>
       {questions.type === 6 && <QuestionText opts={questions} />}
       {questions.type === 1 && <QuestionChoice  opts={questions} />}
       {questions.type === 2 &&  <QuestionOpen opts={questions} />}
      </View>
    )
  }
}

export default Question
