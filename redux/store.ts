
import { configureStore } from '@reduxjs/toolkit';
import shapeReducer from './shapeSlice';

export const store = configureStore({
  reducer: {
    shape: shapeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;