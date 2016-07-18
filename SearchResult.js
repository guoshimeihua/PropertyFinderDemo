import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  ListView,
  NavigatorIOS
} from 'react-native';

import PropertyView from './PropertyView';

/**
  组件间的传递靠props来进行传递
  1、在构建不同的行时，我们使用箭头函数对不同的行进行识别。这个函数在ListView进行一致化
  的时候被调用，以便判断列表中的数据是否被改变。有点像cell的重用标识符一样。
  2、renderRow函数用于为每个行提供UI
  3、ListView的使用大概就像这样了。
*/
class SearchResult extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
  }

  rowPressed(rowID) {
    console.log('输出'+rowID);
    var property = this.props.listings[rowID];
    console.log(property);
    this.props.navigator.push({
      title: 'PropertyView',
      component: PropertyView,
      passProps: {property: property}
    });
  }

  /**
    rowContainer，textContainer里面的样式都是针对里面的元素进行布局的。
    title里面的样式是针对自己本身的。容器里面的样式和元素的样式，之间的作用要区分出来。
    在onPress函数里面再次使用了箭头函数，并将该行数据的guid作为传递参数。
  */
  renderRow(rowData, sectionID, rowID) {
    var price = rowData.price_formatted.split(' ')[0];
    return(
      <TouchableHighlight underlayColor='#dddddd' onPress={() => this.rowPressed(rowID)}>
        <View>
        <View style={styles.rowContainer}>
          <Image style={styles.thumb} source={{url: rowData.img_url}} />
          <View style={styles.textContainer}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.title} numberOfLines={1}>{rowData.title}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow.bind(this)}
    />
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

module.exports = SearchResult;
