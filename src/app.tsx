import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  Text,
  TextInput,
  Title,
} from "@canva/app-ui-kit";
import React, { useState } from "react";
import styles from "styles/components.css";
import { useAppDispatch } from '../redux/hooks';
import { addOrUpdateShape } from '../redux/thunks';
import GPTResponse from "../utils/gpt/GPTResponse.js";
import { ShapeParams, shapeGenerators } from "../utils/shapes/shapeGenerators";


interface UIState {
  text: string;
  color: string;
  elementType: "TEXT" | "SHAPE";
  shapeType: string;
}

const initialState: UIState = {
  text: "Type anything",
  color: "#ff0099",
  elementType: "TEXT",
  shapeType: "circle",
  
};

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
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
      const shapeTypeRegex = /shapeType:\s(?:\["([^"]+)"\]|"([^"]+)")/;
      const shapeParamsRegex = /dimension:\s\[(\d+)(?:,\s*(\d+))?\]/;
  
      // Function to extract shapeType and dimensions
      const extractShapeInfo = response => {
        // Extract shapeType
        const shapeTypeMatch = response.match(shapeTypeRegex);
        const shapeType = shapeTypeMatch ? (shapeTypeMatch[1] || shapeTypeMatch[2]) : null;
        // Extract dimensions
        const dimensionMatch = response.match(shapeParamsRegex);
        const dimensions = dimensionMatch ? dimensionMatch.slice(1).filter(Number).map(Number) : null;
        return { shapeType, dimensions };
      };
      const { shapeType, dimensions } = extractShapeInfo(response);
      // Extract shapeParams
      let shapeParams = {
        width: 100,  // default width
        height: 100, // default height
        size: 10,
        fill: state.color // use the color from the state
      };
  
      if (dimensions) {
        const [width, height] = dimensions;
        shapeParams = { ...shapeParams, width, height: height || width };
      }
  
      // Call shape generators(shapeType, shapeParams) and return shapes
      if (shapeType && shapeType in shapeGenerators) {
        try {
          const shapeData = shapeGenerators[shapeType](shapeParams);
          dispatch(addOrUpdateShape(shapeType, shapeParams));
          console.log(`Shape generated: ${shapeType}`, shapeData);
        } catch (error) {
          console.error(`Error generating shape: ${shapeType}`, error);
        }
      } else {
        console.error(`Invalid or unsupported shape type: ${shapeType}`);
      }
    }).catch(error => {
      console.error("Error in GPT response or shape generation:", error);
    });
    setState(prevState => ({ ...prevState, text: "" }));
  };
  
    
     // Select shapes (return selected shapes)

     // Modify selected shapes


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