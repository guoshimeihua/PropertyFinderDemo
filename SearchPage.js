import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import SearchResult from './SearchResult';
//解构赋值，可以将多个对象属性一次性赋给多个变量。这样在后面的代码中，我们就可以省略掉React的前缀，比如用StyleSheet来代替React.StyleSheet。
//解构赋值对于数组操作来说尤其方便

/**
  这个函数不依赖于SearchPage类，因此被定义为函数而不是方法
*/
function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london', //理解成一个键值对象即可
      isLoading: false,
      message: ''
    };
  }

  onSearchTextChanged(event) {
    this.setState({searchString: event.nativeEvent.text});
  }

  _handleResponse(response) {
    this.setState({isLoading: false, message: ''});
    console.log(response);
    if (response.application_response_code.substr(0, 1) === '1') {
      //console.log('Properties found: ' + response.listings.length);
      this.props.navigator.push({
        title: 'Result',
        component: SearchResult,
        passProps: {listings: response.listings}
      });
    }else {
       this.setState({message: 'Location not recognized; please try again'});
    }
  }

  //javaScript类没有访问器，因此也就没有私有的概念。因此我们会在方法名前面加一个下划线，以表示该方法
  //同为私有方法。
  /**
    fetch函数在Fetch API中定义，它在XMLHttpRequest的基础上进行了极大的改进。结果是异步返回的，
    同时使用了promise规范，如果response中包含有效地JSON对象则将JSON对象的response成员
    传到_handleResponse方法。
   */
   _executeQuery(query) {
    console.log(query);
    this.setState({isLoading: true, message: ''});
    fetch(query, {method: 'GET'})
      .then((response) => response.json())
      .then((json) => this._handleResponse(json.response))
      .catch(error => {
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error.stack
        });
      });
  }

  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  onLocationPressed() {
    console.log('定位开始');
    navigator.geolocation.getCurrentPosition(
     location => {
       var search = location.coords.latitude + ',' + location.coords.longitude;
       this.setState({ searchString: search });
       var query = urlForQueryAndPage('centre_point', search, 1);
       this._executeQuery(query);
     },
     error => {
       this.setState({
         message: 'There was a problem with obtaining your location: ' + error
       });
   });
  }

  render() {
    // 如果isLoading为true，显示一个网络指示器，否则显示一个空的view。
    var spinner = this.state.isLoading ? (<ActivityIndicator size='large' hidden='true'/>) : (<View />);
    return(
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>

        <View style={styles.flowRight}>
          <TextInput style={styles.searchInput} value={this.state.searchString} onChange={this.onSearchTextChanged.bind(this)} placeholder='Search via name or postcode' />
          <TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onLocationPressed.bind(this)}>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>

        <Image style={styles.image} source={require('./image/house.png')} />
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

//view的padding和searchInput的padding是不一样的。//指的是search via name or postcode 与框之间的距离。
//View的padding是相对于父视图的左右距离。input的padding相当于是里面的文字相距边界的距离
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 65,
    alignItems: 'center'
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  image: {
    width: 217,
    height: 138
  }
});

//flex中所占的份额分别为4和1，也就是说，它们的宽度在整个宽度（屏幕宽度）中所占的份额分别为4何1.

// 使SearchPage类可被其他js文件引用
module.exports = SearchPage;
