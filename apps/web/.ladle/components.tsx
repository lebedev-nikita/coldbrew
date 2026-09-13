import type { ReactNode } from "react";

import "../styles.css";
import "./ladle.css";

export const Provider = ({
  children,
  globalState,
}: {
  children: ReactNode;
  globalState: { theme: string };
}) => (
  <div className={globalState.theme === "dark" ? "dark h-full min-h-0" : "h-full min-h-0"}>
    {children}
  </div>
);
