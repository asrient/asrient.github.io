import { useState, useEffect } from "react";

const DarkModeToggle = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, [])

  const toggleTheme = () => {
    (window as any).updateMode(isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
  }

  return (
    <button type="button" onClick={toggleTheme} className="flex items-center justify-center w-[1.85rem] h-[1.85rem] m-0 ml-5 p-3 text-[0.7rem] rounded-full bg-neutral-400 dark:bg-neutral-700 bg-opacity-20 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500" aria-pressed="false" aria-labelledby="toggleLabel">
      {
        isDarkMode ? 
         '🌙'
         : '☀️'
      }
    </button>
  )
}

export default DarkModeToggle
