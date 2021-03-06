import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtIcon, AtDivider } from 'taro-ui'
import { QuestionChoice } from "./QuestionType/QuestionChoice";
import { QuestionOpen } from "./QuestionType/QuestionOpen";
import { QuestionText } from "./QuestionType/QuestionText";
import { fromJS } from 'immutable'

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
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handelEditOpt = this.handelEditOpt.bind(this)
    this.handelDelete = this.handelDelete.bind(this)
  }

  handleChange(val) {
    console.log(val)
  }

  handelEditOpt() {
    const { questions, page, index, qtApg } = this.props
    const newPg = qtApg.split(',')
    this.props.dispatch({
      type: 'edit/saveQuestion',
      payload: {
        optsList: questions,
        pageIndex: parseInt(newPg[0]) + 1,
        index: parseInt(newPg[1])
      }
    }).then(() => {
      Taro.navigateTo({ url: '/pages/edit/editOpt' })
    })
  }

  handelDelete() {
    const { qtn, index, page, isChange } = this.props
    let nextPage = fromJS(qtn.pageList);
    let questionnaire = qtn
    nextPage = nextPage.deleteIn([page - 1, "qtList", index]);
    nextPage = nextPage.filter(pageItem => pageItem.get("qtList").size > 0)
    let newQt = []
    nextPage.toJS().map((val, key) => {
      newQt.push(JSON.parse(JSON.stringify(val)))
    })
    let seq = 1
    let deq = 1
    newQt.map((val) => {
      val.qtList.map((item, key) => {
        if (item.type == 6) {
          item.disSeq = `D${deq++}`
        } else {
          item.disSeq = `Q${seq++}`
        }
      })
    })
    questionnaire.pageList = newQt
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        qtn: questionnaire,
        isChange: !isChange
      }
    })
  }

  render() {
    const { questions, page, index } = this.props
    return (
      <View className='question'>
        <View className='question-set'>
          {((questions.type === 1 && (questions.selectType === 0 || questions.selectType === 1))
            || questions.type === 2 && (questions.selectType === 1) || questions.type === 6 && (questions.selectType === 0)) && (
              <View onClick={this.handelDelete} className='question-edit'><AtIcon value='trash' size='18' color='#242425'></AtIcon></View>
            )}
          {((questions.type === 1 && (questions.selectType === 0 || questions.selectType === 1))
            || questions.type === 2 && (questions.selectType === 1) || questions.type === 6 && (questions.selectType === 0)) && (
              <View onClick={this.handelEditOpt} className='question-edit' style={{ marginRight: '10px' }}><AtIcon value='edit' size='18' color='#242425'></AtIcon></View>
            )}
        </View>
        {questions.type === 6 && <QuestionText opts={questions} page={page} index={index} />}
        {questions.type === 1 && <QuestionChoice opts={questions} page={page} index={index} />}
        {questions.type === 2 && <QuestionOpen opts={questions} page={page} index={index} />}
        {questions.type !== 2 && questions.type !== 1 && questions.type !== 6 && (
          <View className='other-type'>
            <View className='other-text'>
              {questions.disSeq + '.' + questions.text.replace(/<\/?.+?>/g, "")}
            </View>
            <View className='other-mes'>此题不可编辑</View>
          </View>
        )}
      </View>
    )
  }
}

export default Question
