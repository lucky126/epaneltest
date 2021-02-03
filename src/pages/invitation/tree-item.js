import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtCheckbox } from 'taro-ui'
import { connect } from '@tarojs/redux';
import Tree from './tree.js'
import './tree.scss';

@connect(({ invitation, home, common }) => ({
    ...invitation,
    ...home,
    ...common
}))

class Treeitem extends Component {
    config = {
        navigationBarTitleText: '收集数据',
    };

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount() {
    };
    render() {
        const { data, depth, selectedList, index, oid } = this.props
        var children = null
        if (data.children && data.children.length > 0) {
            children = data.children.map((i, j) => (
                <Tree oid={data.id} index={j} key={i.userid} data={i} depth={depth + 1} change={this.props.change} selectedList={this.props.selectedList}></Tree>
            ))
        }
        var userList = null
        if (data.userList && data.userList.length > 0) {
            userList = data.userList.map((i, j) => (
                <Tree oid={data.id} index={j} key={i.userid} data={i} depth={depth + 1} change={this.props.change} selectedList={this.props.selectedList}></Tree>
            ))
        }
        var value = JSON.parse(JSON.stringify(data))
        value.str = data.id ? data.id : oid + '_' + index
        return (
            <View className='tree'>
                <View style={{ marginLeft: depth * 40 + 'rpx', overflow: 'hidden' }}>
                    <AtCheckbox
                        // options={[{ label: data.name, value: `${data.id ? data.id : oid + '_' + index}` }]}
                        options={[{ label: data.name, value: JSON.stringify(value) }]}
                        selectedList={selectedList}
                        onChange={(a) => this.props.change(a, value)}
                    />
                    {children}
                    {userList}
                </View>
            </View>
        )
    }
}

export default Treeitem;
