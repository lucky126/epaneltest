import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { connect } from '@tarojs/redux';
import { AtDivider  } from 'taro-ui'
import { Question } from "./Question";

@connect(({ edit, home, common }) => ({
    ...edit,
    ...home,
    ...common
  }))

class PageList extends Component {
  static propTypes = {
    qtn: PropTypes.object
  };

  static defaultProps = {
    qtn: '',
  };

 

  render() {
      const {qtn} = this.props
    return (
      <View className='pagelist'>
        {qtn.pageList && qtn.pageList.map((val,key)=>(
            <View className='page'>
                {val.qtList.map((qtList,qtIndex)=>(
                <View className='qtlist'>
                    <Question questions={qtList} page={key+1} index={qtIndex} qtApg={key+','+qtIndex} />
                </View>
                ))}
                <View className='pages'>
                   <AtDivider content={`第${key+1}页`} fontColor='#2d8cf0' lineColor='#ccc' /> 
                </View>
            </View>
        ))}
      </View>
    )
  }
}

export default PageList
