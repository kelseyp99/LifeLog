import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Props for TextBox component
interface TextBoxProps {
  placeholder?: string; // Optional placeholder text
  value: string; // Input value, should be a string
  onChangeText: (text: string) => void; // Function to handle text changes
  onEndEditing?: () => void; // Optional event triggered when editing ends
}

const TextBox: React.FC<TextBoxProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder} // Use props instead of destructuring
      value={props.value} // `value` should be of type `string`
      onChangeText={props.onChangeText} // `onChangeText` expects a `string`
      onEndEditing={props.onEndEditing} // Optional handler
      multiline
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
  },
});

// Props for AskBox component
interface AskBoxProps {
  placeholder?: string; // Optional placeholder
  onChangeText: (value: string) => void; // Function to handle text input changes
  sendMealDescription: (value: string) => void; // Function to handle sending the final description
}

const AskBox: React.FC<AskBoxProps> = ({
  placeholder = '',
  onChangeText,
  sendMealDescription,
}) => {
  const [inputValue, setInputValue] = useState<string>(''); // Explicitly typed as string

  const handleTextChange = (text: string) => {
    setInputValue(text); // Update state with text input
    onChangeText(text); // Notify parent component
  };

  const handleEndEditing = () => {
    console.debug('Input finished with value:', inputValue);
    sendMealDescription(inputValue); // Send the final input value
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter Meal Description:</Text>
      <TextBox
        placeholder={placeholder}
        value={inputValue} // `value` should be of type `string`
        onChangeText={handleTextChange} // Handler for text change
        onEndEditing={handleEndEditing} // Detect when editing ends
      />
    </View>
  );
};

export default AskBox;