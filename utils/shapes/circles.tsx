import {
    Button,
    ColorSelector,
    Column,
    Columns,
    FormField,
    MultilineInput,
    PlusIcon,
    Rows,
    Text,
    Title,
  } from "@canva/app-ui-kit";
  import { initAppElement } from "@canva/design";
  import { useEffect, useState } from "react";
  import styles from "styles/components.css";
  
  type AppElementData = {
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
  
  type UIState = AppElementData;
  
  const initialState: UIState = {
    paths: [
      {
        d: "M 50,10 A 40,40 0 0 1 50,90 A 40,40 0 0 1 50,10",
        fill: {
          dropTarget: false,
          color: "#2200FF",
        },
      },
    ],
    viewBox: {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
    },
    width: 100,
    height: 100,
    rotation: 0,
  };
  
  const appElementClient = initAppElement<AppElementData>({
    render: (data) => {
      return [{ type: "SHAPE", top: 0, left: 0, ...data }];
    },
  });
  
  export const App = () => {
    const [state, setState] = useState<UIState>(initialState);
    const { paths} = state;
    const disabled = paths.length < 1;
  
    useEffect(() => {
      appElementClient.registerOnElementChange((appElement) => {
        setState(appElement ? appElement.data : initialState);
      });
    }, []);
  
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="3u">
          <Text>
            This example demonstrates how apps can create shape elements inside
            app elements. This makes the element re-editable and lets apps control
            additional properties, such as the width and height.
          </Text>
          <Rows spacing="1u">
            <Columns spacing="0" alignY="center">
              <Column>
                <Title size="small">Paths</Title>
              </Column>
              <Column width="content">
                {paths.length < 7 && (
                  <Button
                    variant="tertiary"
                    icon={PlusIcon}
                    ariaLabel="Add a new path"
                    onClick={() => {
                      setState((prevState) => {
                        return {
                          ...prevState,
                          paths: [
                            ...prevState.paths,
                            {
                              d: "",
                              fill: {
                                dropTarget: false,
                                color: "#000000",
                              },
                            },
                          ],
                        };
                      });
                    }}
                  />
                )}
              </Column>
            </Columns>
            {paths.map((path, outerIndex) => {
              return (
                <Rows spacing="2u" key={outerIndex}>
                  <FormField
                    label="Line commands"
                    value={path.d}
                    control={(props) => (
                      <MultilineInput
                        {...props}
                        onChange={(value) => {
                          setState((prevState) => {
                            return {
                              ...prevState,
                              paths: prevState.paths.map((path, innerIndex) => {
                                if (outerIndex === innerIndex) {
                                  return {
                                    ...path,
                                    d: value,
                                  };
                                }
                                return path;
                              }),
                            };
                          });
                        }}
                      />
                    )}
                  />
                  <FormField
                    label="Color"
                    control={() => (
                      <ColorSelector
                        color={paths[outerIndex].fill.color}
                        onChange={(value) => {
                          setState((prevState) => {
                            return {
                              ...prevState,
                              paths: prevState.paths.map((path, innerIndex) => {
                                if (outerIndex === innerIndex) {
                                  return {
                                    ...path,
                                    fill: {
                                      ...path.fill,
                                      color: value,
                                    },
                                  };
                                }
                                return path;
                              }),
                            };
                          });
                        }}
                      />
                    )}
                  />
                </Rows>
              );
            })}
          </Rows>
          <Rows spacing="1u">
            <Button
              variant="secondary"
              onClick={() => {
                setState(initialState);
              }}
              stretch
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                appElementClient.addOrUpdateElement(state);
              }}
              disabled={disabled}
              stretch
            >
              Add or update shape
            </Button>
          </Rows>
        </Rows>
      </div>
    );
  };
  