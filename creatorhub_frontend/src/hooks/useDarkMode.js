import { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function useDarkMode() {
  /** Returns [isDark, toggleDark] */
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  const toggle = () => setDark(v => !v);
  return [dark, toggle];
}
