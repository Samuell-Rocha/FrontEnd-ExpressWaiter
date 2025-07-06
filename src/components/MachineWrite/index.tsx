import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import styles from "./style.module.scss";

export function MachineWrite(props) {
  const [text, setText] = useState();
  const [showCursor, setshowCursor] = useState(false);

  const WriteScreen = (text, i = 0) => {
    if (i < text.length) {
        setshowCursor(true)

      setText(text.slice(0, i + 1));
      setTimeout(() => WriteScreen(text, i + 1), 100);
    } else if (i >= text.length && props?.hideCursor) {
      setshowCursor(false);
    }
  };

  useEffect(() => {
    setTimeout(() => WriteScreen(props.text), props?.delay ?? 200);
  }, []);

  return (
    <div>
      {text}
      {showCursor && (
        <span id={styles.cursor} className="animate-animar-cursor text-xl md:text-2xl ml-1 font-medium">|</span>
      )}
    </div>
  );
}
