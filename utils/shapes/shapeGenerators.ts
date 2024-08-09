export type ShapeParams = {
  width: number;
  height: number;
  fill: string;
  size?: number; // For shapes like triangles that use 'size'
  [key: string]: any; // For additional shape-specific parameters
};
  
export const shapeGenerators: { 
  [key: string]: (params: ShapeParams) => { 
    d: string, 
    fill: { dropTarget: boolean, color: string } 
  } 
} = {
  circle: (params: ShapeParams) => {
    const { width, height, fill } = params;
    console.log('Circle params:', params);
    const radius = Math.min(width, height) / 2;
    const cx = width / 2;
    const cy = height / 2;
    console.log(`Circle: radius=${radius}, cx=${cx}, cy=${cy}`);
    return {
      d: `M ${cx},${cy-radius} A ${radius},${radius} 0 0 1 ${cx},${cy+radius} A ${radius},${radius} 0 0 1 ${cx},${cy-radius}`,
      fill: { dropTarget: false, color: fill },
    };
  },
  rectangle: (params: ShapeParams) => {
    const { width, height, fill } = params;
    console.log('Rectangle params:', params);
    return {
      d: `M 0,0 H ${width} V ${height} H 0 Z`,
      fill: { dropTarget: false, color: fill },
    };
  },
  square: (params: ShapeParams) => {
    const { width, fill } = params;
    console.log('Square params:', params);
    const size = width; // Use width as the size for consistency
    return {
      d: `M 0 0 H ${width} V ${width} H 0 L 0 0`,
      fill: { dropTarget: false, color: fill },
    };
  },
  triangle: (params: ShapeParams) => {
    const { width, height, fill } = params;
    console.log('Triangle params:', params);
    // Use width as base and height as height of the triangle
    return {
      d: `M 0,${height} L ${width / 2},0 L ${width},${height} Z`,
      fill: { dropTarget: false, color: fill },
    };
  }
};