import React, { useState } from "react";
import {
  Button,
  ColorSelector,
  FormField,
  Rows,
  Text,
  TextInput,
  Title,
  MultilineInput,
} from "@canva/app-ui-kit";
import { useAppDispatch } from '../redux/hooks';
import { addOrUpdateShape } from '../redux/thunks';
import GPTResponse from "../utils/gpt/GPTResponse.js";
import { ShapeParams, shapeGenerators } from "../utils/shapes/shapeGenerators";
import { requestExport } from "@canva/design";
import type { ExportResponse } from "@canva/design";

const initialState = {
  text: "Type anything",
  color: "#ff0099",
  elementType: "SHAPE",
  shapeType: "circle",
};
interface ExportBlob {
  url: string;
}

interface CustomExportResponse {
  exportBlobs: ExportBlob[];
  status: "COMPLETED" | "ABORTED" | "FAILED";
  title: string;
}

export const App = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState(initialState);
  const [shapeTypeState, setShapeTypeState] = useState("SHAPE");
  const [exportState, setExportState] = useState("idle");
  const [exportResponse, setExportResponse] = useState<ExportResponse | undefined>();

  const handleTextChange = (value) => {
    setState((prevState) => ({ ...prevState, text: value }));
  };

  const handleColorChange = (value) => {
    setState((prevState) => ({ ...prevState, color: value }));
  };

  const extractShapeInfo = (response) => {
    const shapeTypeRegex = /shapeType:\s(?:\["([^"]+)"\]|"([^"]+)")/;
    const shapeParamsRegex = /dimension:\s\[(\d+)(?:,\s*(\d+))?\]/;
  
    const shapeTypeMatch = response.match(shapeTypeRegex);
    const shapeType = shapeTypeMatch ? (shapeTypeMatch[1] || shapeTypeMatch[2]) : null;
  
    const dimensionMatch = response.match(shapeParamsRegex);
    const dimensions = dimensionMatch ? dimensionMatch.slice(1).filter(Number).map(Number) : null;
  
    return { shapeType, dimensions };
  };

  const processGptResponseAndAddShape = async (text, color) => {
    try {
      const response = await GPTResponse(text);
      const { shapeType, dimensions } = extractShapeInfo(response);

      let shapeParams = {
        width: dimensions?.[0] || 0, 
        height: dimensions?.[1] || dimensions?.[0] || 0, 
        fill: color
      };

      if (shapeType && shapeType in shapeGenerators) {
        const shapeData = shapeGenerators[shapeType](shapeParams);
        console.log(`Generating ${shapeType}:`, shapeParams, shapeData);
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
      const { shapeType } = result;
      setShapeTypeState(shapeType);
      setState(prevState => ({
        ...prevState,
        text: "",
        elementType: "SHAPE",
        shapeType: shapeType || prevState.shapeType
      }));
    }
  };

  const exportDocument = async () => {
    if (exportState === "exporting") return;
    try {
      setExportState("exporting");
      
      const response = await requestExport({
        acceptedFileTypes: [
          "PNG",
          "PDF_STANDARD",
          "JPG",
          "GIF",
          "SVG",
          "VIDEO",
          "PPTX",
        ],
      });
      setExportResponse(response);
      if (response.status === "COMPLETED" && response.exportBlobs && response.exportBlobs.length > 0) {
        downloadExportedFile(response);
        console.log(response,'exportRespone')
      } else if (response.status === "ABORTED") {
        console.log("Export was aborted");
      } else {
        console.log("Export failed or is in an unexpected state");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportState("idle");
    }
  };

  const downloadExportedFile = (response) => {
    if (response.exportBlobs.length > 0) {
      const exportUrl = response.exportBlobs[0].url;
      const fileName = `${response.title || "Untitled"}.${getFileExtension(exportUrl)}`;

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("No export blob available");
      
    }
  };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.([^.]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : 'png'; 
  };

  const isAddDisabled = !state.text.trim() || !state.color.trim();

  return (
    <div>
      <Rows spacing="3u">
        <Text>
          This app allows you to create shapes based on text input and export your design.
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
          disabled={isAddDisabled}
          stretch
        >
          Add element
        </Button>
        <Button
          variant="secondary"
          onClick={exportDocument}
          loading={exportState === "exporting"}
          stretch
        >
          Export
        </Button>
        {exportResponse && (
          <FormField
            label="Export response"
            value={JSON.stringify(exportResponse, null, 2)}
            control={(props) => (
              <MultilineInput {...props} maxRows={7} autoGrow readOnly />
            )}
          />
        )}
      </Rows>
    </div>
  );
};