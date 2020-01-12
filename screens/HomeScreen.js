import React from 'react';
import {
  StyleSheet,
  View,
  FlatList, 
  Dimensions,
  StatusBar,
  Image,
  TouchableHighlight,
  Platform
} from 'react-native';

import ListItem from "../components/ListItem";
import * as ImagePicker from 'expo-image-picker';

const ITEM_WIDTH = Dimensions.get('window').width;

export default class HomeScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      images: [],
      columns: 2,
      key: 1  
    }
  }

  componentDidMount() {
    this.getImageData();
  }

  getImageData = () => {
    fetch("http://dev-test.depicture.io/api/files", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ images: [...responseJson]});
    })
  }

  openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true
    })
    let formdata = new FormData();
    formdata.append("file", {
      name: `${new Date().getTime()}.jpg`,
      type: "image/jpeg",
      uri: Platform.OS === "android" ? result.uri : result.uri.replace("file://", "")
    })
    
    fetch("http://dev-test.depicture.io/api/upload", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },  
      body: formdata
    })
    .then(() => {
      this.getImageData();
    })
  };
  
  _handleOnSaveUserPhotoPicker = async (photo) => {
    console.log(photo);
  }

  render() {
    const { columns, images, key } = this.state;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => this.openCamera()}
          style={{ ...styles.button }}
          underlayColor="#2E75B5">
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require("../assets/camera/cameraIcon.png")} />
          </View>
        </TouchableHighlight>
        <FlatList
          numColumns={columns}
          data={images}
          renderItem={({item, index}) => {
            if (item.path.includes(".") == false)
              return (<ListItem key={index} itemWidth={(ITEM_WIDTH-10*(columns))/columns} image={{uri: null}} />)
            return <ListItem key={index} itemWidth={(ITEM_WIDTH-10*(columns))/columns} image={{uri: item.path}} />
          }}
          keyExtractor={
            (item, index) => { return `${item.name + index}` }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: StatusBar.currentHeight
  },
  button: {
    backgroundColor: '#1D5D96',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 2,
    height: 48,
    width: 150, 
    margin: 10,
    borderRadius: 10
  },
  
});
