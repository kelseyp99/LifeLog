import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { addDiscussion, getLastOpenDiscussion } from '../services/databaseService';
import { analyzeActivity } from '../services/openaiAPI';
// Props for TextBox component
interface TextBoxProps {
  placeholder?: string; // Optional placeholder text
  value: string; // Input value, should be a string
  onChangeText: (text: string) => void; // Function to handle text changes
  onBlur?: () => void; // Optional event triggered when editing ends
}

// TextBox component
const TextBox: React.FC<TextBoxProps> = ({ placeholder, value, onChangeText, onBlur }) => {
  return (
    <TextInput
      style={{
        ...styles.input,
        color: 'white', // Set the font color to white
      }}
      placeholder={placeholder} // Use props instead of destructuring
      value={value} // `value` should be of type `string`
      onChangeText={onChangeText} // `onChangeText` expects a `string`
      onEndEditing={onBlur} // Use onEndEditing instead of onSubmitEditing
      multiline // Make the text input a multiline input field
      textAlignVertical="top"
    />
  );
};

// Styles for the TextBox component
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '90%',
    height: 150,
    color: 'black', // Default font color
  },
});

// Props for AskBox component
interface AskBoxProps {
  placeholder?: string; // Optional placeholder
  onChangeText: (value: string) => void; // Function to handle text input changes
}

// AskBox component
const AskBox: React.FC<AskBoxProps> = ({
  placeholder = '',
  onChangeText,
}) => {
  const [inputValue, setInputValue] = useState<string>(''); // State for user input

  /**
   * Handle text input changes
   *
   * @param text The new input value
   */
  const handleTextChange = (text: string) => {
    setInputValue(text); // Updates state
    onChangeText(text); // Notify parent
    //console.log('Input Value:', text);
  };

  /**
   * Handle the end of editing
   */
 const handleEndEditing = () => {
  // console.log('handleEndEditing was called');
//   console.debug('Input finished with value:', inputValue);
   if (addDiscussion) {
     addDiscussion(inputValue);
   } else {
     console.error('addDiscussion is not defined');
   }
 };

const handleButtonPressAI = async () => {
  try {
    const LastOpenDiscussion = await getLastOpenDiscussion();
    console.log('Last open discussion:', LastOpenDiscussion);
   // const activityAnalyze = analyzeActivity(LastOpenDiscussion);
   // console.log(activityAnalyze);
  } catch (error) {
    console.error('Error getting last open discussion:', error);
  }
};
 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter Meal Description:</Text>
      <TextBox
        placeholder={placeholder}
        value={inputValue} // `value` should be of type `string`
        onChangeText={handleTextChange} // Handler for text change
        //onEndEditing={handleEndEditing} // Detect when editing ends
        onBlur={handleEndEditing}
      />
      <Button
      title="Submit"
      onPress={handleButtonPressAI} // Handler for button press
    />
    </View>
  );
};

export default AskBox;