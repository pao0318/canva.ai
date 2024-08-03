import { initAppElement } from "@canva/design";
import { AppElementData } from '../redux/shapeSlice';

export const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [{ type: "SHAPE", top: 0, left: 0, ...data }];
  },
});