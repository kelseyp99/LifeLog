import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  SafeAreaView,
  Button, // Import SafeAreaView from react-native
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AskBox from './components/askTextBox.tsx';
import { addDiscussion } from './services/databaseService';
import DiscussionTable from './components/DiscussionTable';
import SwipeableComponent from './components/SwipeableTable.tsx';
import HelloWorld from './components/HelloWorld.tsx';


// Define types for Section component props
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

// Section component that displays title and children
const Section: React.FC<SectionProps> = ({ title, children }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[styles.sectionTitle, { color: isDarkMode ? Colors.white : Colors.black }]}
      >
        {title}
      </Text>
      <Text
        style={[styles.sectionDescription, { color: isDarkMode ? Colors.light : Colors.dark }]}
      >
        {children}
      </Text>
    </View>
  );
};

// Main App component with state and logic for handling input
const App: React.FC = () => {
  const [inputValue, setInputValue] = useState(''); // State for input value
  const [finalValue, setFinalValue] = useState(''); // State for the final submitted value

  // Handle text change (live updates)
  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

/*************  ✨ Codeium Command 🌟  *************/
  // Handle final text submission
  /**
   * Called when the user submits their input.
   * Saves the final value in state and sends it to the database.
   *
   * @param text The final input value submitted by the user.
   */
  const sendMealDescription = (text: string) => {
    //console.log('Final Input Submitted:', text);
    setFinalValue(text); // Save the submitted value
//    console.log('calling addDiscussion:', text);
    addDiscussion(text); // Send it to the database
  //  console.log('after calling addDiscussion:', text);
  };
/******  ca602c76-de8b-4722-a302-547cba02b90c  *******/


  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
         
          <Section title="Ask Janet!!!">
            Ask or tell me something, like what you last ate.
            <AskBox
              placeholder="Enter your text here"
              onChangeText={handleTextChange}
            />
            <Text style={styles.inputPreview}>Live Input: {inputValue}</Text>
            <Text style={styles.finalText}>
              Final Submission: {finalValue || 'Not Submitted Yet'}
            </Text>
          </Section>
        </View>
        <DiscussionTable /> 
      </ScrollView>
      {/* <HelloWorld />  */}
     
      {/* <SwipeableComponent />  */}
     
    </SafeAreaView>
  );
};



// Styles for components
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  inputPreview: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  finalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
  },
});

export default App;