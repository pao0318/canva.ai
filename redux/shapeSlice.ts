import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShapeParams, shapeGenerators } from '../utils/shapes/shapeGenerators';

export type AppElementData = {
  paths: {
    d: string;
    fill: {
      dropTarget: boolean;
      color: string;
    };
  }[];
  viewBox: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  width: number;
  height: number;
  rotation: number;
};

const initialState: AppElementData = {
  paths: [],
  viewBox: { width: 0, height: 0, top: 0, left: 0 },
  width: 0,
  height: 0,
  rotation: 0,
};

export const shapeSlice = createSlice({
  name: 'shape',
  initialState,
  reducers: {
    setShape: (state, action: PayloadAction<{ shapeName: string; params: ShapeParams }>) => {
      const { shapeName, params } = action.payload;
      const generator = shapeGenerators[shapeName];
      if (!generator) {
        throw new Error(`Shape "${shapeName}" is not supported.`);
      }
      const { width, height } = params;
      const path = generator(params);
      return {
        paths: [path],
        viewBox: { width, height, top: 0, left: 0 },
        width,
        height,
        rotation: 0,
      };
    },
  },
});

export const { setShape } = shapeSlice.actions;

export default shapeSlice.reducer;