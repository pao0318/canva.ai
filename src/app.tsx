import React, { useState } from "react";
import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";
import GPTResponse from "../utils/gpt/GPTResponse.js"
import { shapeGenerators, ShapeParams } from "../utils/shapes/shapeGenerators";


interface UIState {
  text: string;
  color: string;
  elementType: "TEXT" | "SHAPE";
  shapeType: string;
}

const initialState: UIState = {
  text: "Hello world",
  color: "#ff0099",
  elementType: "TEXT",
  shapeType: "circle",
  
};

export const App: React.FC = () => {
  const [state, setState] = useState<UIState>(initialState);

  const handleTextChange = (value: string) => {
    setState((prevState) => ({ ...prevState, text: value }));
  };

  const handleColorChange = (value: string) => {
    setState((prevState) => ({ ...prevState, color: value }));
  };
  const handleElementTypeChange = (value: "TEXT" | "SHAPE") => {
    setState((prevState) => ({ ...prevState, elementType: value }));
    
  };
  const handleShapeTypeChange = (value: string) => {
    setState((prevState) => ({ ...prevState, shapeType: value }));
  };

  const handleAddElement = () => {
    handleGptResponse(state.text).then(response => {
        // Regex patterns
        const shapeTypeRegex = /shapeType:\s*\["([^"]+)"\]/;
        const shapeParamsRegex = /dimension:\s*\[(\d+)(?:,\s*(\d+))?\]/;

        // Extract shapeType
        const shapeTypeMatch = response.match(shapeTypeRegex);
        const shapeType = shapeTypeMatch ? shapeTypeMatch[1] : null;

        // Extract shapeParams
        const shapeParamsMatch = response.match(shapeParamsRegex);
        let shapeParams = {};

        if (shapeParamsMatch) {
            const width = parseInt(shapeParamsMatch[1], 10);
            const height = shapeParamsMatch[2] ? parseInt(shapeParamsMatch[2], 10) : width;
            shapeParams = { width, height };
        }
        
        
    });
};


  const handleGptResponse = async(text: string) =>{
    try {
      const response = await GPTResponse(text);
      setState(prevState => ({ ...prevState, text: response }));
      return response;
    } catch (error) {
      console.error("Error getting GPT response:", error);
      return "Error: Couldn't get a response";
    }
  };

  const isDisabled = !state.text.trim() || !state.color.trim();

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create text elements as native
          elements.
        </Text>
        <FormField
          label="Text"
          value={state.text}
          control={(props) => (
            <TextInput {...props} onChange={handleTextChange} />
          )}
        />
        <Title size="small">Custom options</Title>
        <FormField
          label="Color"
          control={() => (
            <ColorSelector
              color={state.color}
              onChange={handleColorChange}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={handleAddElement}
          disabled={isDisabled}
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};