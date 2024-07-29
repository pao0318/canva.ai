import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import styles from "styles/components.css";

export const App = () => {
  const onClick = () => {
    addNativeElement({
      type: "TEXT",
      children: ["hEY"],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This is starter bro
        </Text>
        <Button variant="primary" onClick={onClick} stretch>
          Click here
        </Button>
      </Rows>
    </div>
  );
};
