import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'
import { AtCard, AtButton } from 'taro-ui';

class Link extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  copyUrl = () =>{
    Taro.setClipboardData({
      data: this.props.linkData.weblinkUrl,
      success: function () {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  render() {
    const { linkData } = this.props

    console.log(linkData)
    return (
      <View className='link-wrap'>
        <View className='linkInfoRow at-row'>
          <View className='at-col'>
            <AtCard title='问卷链接'>
              <View className='at-row'>
                <View className='linkText at-col'>{linkData.weblinkUrl}</View>
              </View>
              <View className='at-row at-row__justify--end copyRow'>
                <View className='at-col at-col-3'>
                  <AtButton circle type='primary' size='small' onClick={this.copyUrl}>复制</AtButton>
                </View>
              </View>
            </AtCard>
          </View>
        </View>

        <View className='linkInfoRow at-row'>
          <View className='at-col'>
           <AtCard title='二维码'>
              这也是内容区 可以随意定义功能
            </AtCard>
          </View>
        </View>
      </View>
    )
  }
}

export default Link
