import Taro, { Component } from '@tarojs/taro'
import { View,Checkbox,Button } from '@tarojs/components'
import PropTypes from 'prop-types';
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction }  from 'taro-ui'
import './style/setting.scss'
import { connect } from '@tarojs/redux';

@connect(({edit,home, common }) => ({
  ...edit,
  ...home,
  ...common
}))
class QtnSet extends Component {
  constructor(props) {
      super(props)
      this.state = {
        qtnset_isopen: false
      }
      this.handleDelete = this.handleDelete.bind(this)
      this.handleRequired = this.handleRequired.bind(this)
      this.cancel = this.cancel.bind(this)
  }

  //删除题目
  handleDelete(){
    const {opts,isChange} = this.props
   
    let questionnaire = this.props.qtn
    let newQtlist = questionnaire.pageList.map((pg)=>{
      pg.qtList.filter((val)=> val.disSeq != opts.disSeq)
    })
    newQtlist.map((item,key)=>{
      item.disSeq = `Q${key+1}`
      item.mySeq = `Q${key+1}`
    })
    questionnaire.pageList.map((item)=>{
         item.qtList = newQtlist
    })
    this.props.dispatch({
        type: 'edit/save',
        payload: {
          questionnaire,
          isChange:!isChange
        }
      })
      this.cancel()
  }
  cancel() {
    this.setState({qtnset_isopen: false})
  }

  //必答设置
  handleRequired(required){
    const {questionnaire,opts,isChange} = this.props
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((val)=>{
      if(val.disSeq === opts.disSeq){
        val.required = !required
      }
    })
    })
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        questionnaire,
        isChange:!isChange
      }
    })
  }
  
  render() {
    const {opts} = this.props
    const {qtnset_isopen} = this.state
    return (
      <View className="qtset-con">
        <View className='qt-set'>
          <View><Checkbox value='选中' checked={opts.required} onClick={() => this.handleRequired(opts.required)}></Checkbox> 必填</View>
          <View onClick={() => this.setState({qtnset_isopen: true})}><AtIcon value='trash' size='25' color='#ccc'></AtIcon></View>
          
        </View>
        {qtnset_isopen && (
          <AtModal isOpened={qtnset_isopen} closeOnClickOverlay={false}>
            <AtModalHeader>提示</AtModalHeader>
            <AtModalContent>
              确认删除该项题目吗？
            </AtModalContent>
            <AtModalAction> <Button onClick={this.cancel}>取消</Button> <Button onClick={this.handleDelete}>确定</Button> </AtModalAction>
          </AtModal>
        )}
      </View>
    )
  }
}

export default QtnSet
