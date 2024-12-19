import React, { useEffect, useState } from 'react';
import { getDiscussions } from '../services/databaseService';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

interface Discussion {
  id: number;
  timestamp: Date;
  description: string;
  cleared: boolean;
}

interface ThProps {
  children: React.ReactNode;
}



const DiscussionTable = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const discussions = await getDiscussions();
        setDiscussions(discussions);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchDiscussions();
  }, []);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
},
  thContainer: {
    // Add styles for thContainer here
  },
  text: {  
    color: '#FFFFFF',
  },
});

// Now you can use the styles variable
return (
  <ScrollView style={styles.container}>
    <View style={styles.headerRow}>
      {/*  <View style={styles.thContainer}>
        <Text style={styles.text}>ID</Text>
      </View> */}
      {/*       <View style={styles.thContainer}>
        <Text style={styles.text}>Timestamp</Text>
      </View> */}
      <View style={styles.thContainer}>
      <Text style={[styles.text, { textDecorationLine: 'underline' }]} >Description</Text>
      </View>
      {/* <View style={styles.thContainer}>
        <Text style={styles.text}>Cleared</Text>
      </View> */}
    </View>
    {discussions && discussions.map((discussion) => (
      <View key={discussion.id} style={styles.row}>
        {/* <Text style={styles.text}>{discussion.id}</Text> */}
        {/*  <Text style={styles.text}>{discussion.timestamp.toLocaleString()}</Text> */}
        <Text style={[styles.text, { flexWrap: 'wrap' }]}>{discussion.description}</Text>
        {/* <Text style={styles.text}>{discussion.cleared ? 'Yes' : 'No'}</Text> */}
      </View>
    ))}
  </ScrollView>
);
};
export default DiscussionTable;