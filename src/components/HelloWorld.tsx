import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelloWorld = () => {
    return (
      <View>
        <Text style={styles.text}>Hello World!</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    text: {
      color: 'white',
    },
  });
  
  export default HelloWorld;