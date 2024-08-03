export type ShapeParams = {
    width: number;
    height: number;
    fill: string;
    [key: string]: any; // For additional shape-specific parameters
  };
  
  export const shapeGenerators: { [key: string]: (params: ShapeParams) => { d: string, fill: { dropTarget: boolean, color: string } } } = {
    circle: (params: ShapeParams) => {
      const { width, height, fill } = params;
      const radius = Math.min(width, height) / 2;
      const cx = width / 2;
      const cy = height / 2;
      return {
        d: `M ${cx},${cy-radius} A ${radius},${radius} 0 0 1 ${cx},${cy+radius} A ${radius},${radius} 0 0 1 ${cx},${cy-radius}`,
        fill: { dropTarget: false, color: fill },
      };
    },
    rectangle: (params: ShapeParams) => {
      const { width, height, fill } = params;
      return {
        d: `M 0,0 H ${width} V ${height} H 0 Z`,
        fill: { dropTarget: false, color: fill },
      };
    },
    // Add more shape generators here
  };