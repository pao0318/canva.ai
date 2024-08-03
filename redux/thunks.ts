import { AppDispatch, RootState } from './store';
import { setShape } from './shapeSlice';
import { ShapeParams } from '../utils/shapes/shapeGenerators';
import { appElementClient } from '../services/CanvaServices';

export const addOrUpdateShape = (shapeName: string, params: ShapeParams) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setShape({ shapeName, params }));
  const state = getState();
  appElementClient.addOrUpdateElement(state.shape);
};