import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ViewPager, { ViewPagerOnPageSelectedEvent } from '@react-native-community/viewpager';

interface ActivityLog {
  id: number;
  timestamp: Date;
  description: string;
}

interface Discussions {
  id: number;
  timestamp: Date;
  description: string;
  cleared: boolean;
}

interface Parameters {
  parameterName: string;
  parameterValue: string;
}

const SwipeableComponent = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [discussions, setDiscussions] = useState<Discussions[]>([]);
  const [parameters, setParameters] = useState<Parameters[]>([]);

  const viewPager = React.createRef<ViewPager>();

const handlePageChange = (event: ViewPagerOnPageSelectedEvent) => {
  console.log('Page changed:', event.nativeEvent.position); // or event.nativeEvent.selectedPage
  // Handle page change logic here
};

  useEffect(() => {
    console.log('Component mounted');
    // Fetch data and set state here
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={styles.text}>SwipeableComponent is working!</Text>
      <ViewPager
        ref={viewPager}
        onPageSelected={handlePageChange}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <FlatList
            data={activityLogs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>
                Activity Log ID: {item.id} - Timestamp: {item.timestamp.toString()} - Description: {item.description}
              </Text>
            )}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <FlatList
            data={discussions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>
                Discussion ID: {item.id} - Timestamp: {item.timestamp.toString()} - Description: {item.description} - Cleared: {item.cleared}
              </Text>
            )}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <FlatList
            data={parameters}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text>
                Parameter Name: {item.parameterName} - Value: {item.parameterValue}
              </Text>
            )}
          />
        </View>
      </ViewPager>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});

export default SwipeableComponent;