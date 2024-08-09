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
  elementType: "SHAPE",
  shapeType: "circle",
};

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<UIState>(initialState);
  const [shapeTypeState, setShapeTypeState] = useState("SHAPE");

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

  const extractShapeInfo = (response: string) => {
    const shapeTypeRegex = /shapeType:\s(?:\["([^"]+)"\]|"([^"]+)")/;
    const shapeParamsRegex = /dimension:\s\[(\d+)(?:,\s*(\d+))?\]/;
  
    const shapeTypeMatch = response.match(shapeTypeRegex);
    const shapeType = shapeTypeMatch ? (shapeTypeMatch[1] || shapeTypeMatch[2]) : null;
  
    const dimensionMatch = response.match(shapeParamsRegex);
    const dimensions = dimensionMatch ? dimensionMatch.slice(1).filter(Number).map(Number) : null;
  
    return { shapeType, dimensions };
  };

  const logShapeGeneration = (shapeType: string, params: ShapeParams, result: any) => {
  console.log(`Generating ${shapeType}:`);
  console.log('Input params:', params);
  console.log('Output:', result);
};

  const processGptResponseAndAddShape = async (text: string, color: string) => {
  try {
    const response = await handleGptResponse(text);
    const { shapeType, dimensions } = extractShapeInfo(response);

    let shapeParams: ShapeParams = {
      width: dimensions?.[0] || 0, 
      height: dimensions?.[1] || dimensions?.[0] || 0, 
      fill: color
    };

    if (shapeType && shapeType in shapeGenerators) {
      const shapeData = shapeGenerators[shapeType as keyof typeof shapeGenerators](shapeParams);
      logShapeGeneration(shapeType, shapeParams, shapeData);
      dispatch(addOrUpdateShape(shapeType, shapeParams));
      return { shapeType, shapeParams };
    } else {
      console.error(`Invalid or unsupported shape type: ${shapeType}`);
      return null;
    }
  } catch (error) {
    console.error("Error processing GPT response or generating shape:", error);
    return null;
  }
};
  
  const handleAddElement = async () => {
    const result = await processGptResponseAndAddShape(state.text, state.color);
    if (result) {
      const { shapeType, shapeParams } = result;
      setShapeTypeState(shapeType);
      setState(prevState => ({
        ...prevState,
        text: "",
        elementType: "SHAPE",
        shapeType: shapeType || prevState.shapeType
      }));
    }
  };


  const handleGptResponse = async (text: string) => {
    try {
      const response = await GPTResponse(text);
      console.log(response, 'gpt response');
      setState(prevState => ({ ...prevState, text: response }));
      console.log(state, 'state');
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
