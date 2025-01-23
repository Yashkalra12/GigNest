import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDarkMode = create(
  persist(
    (set) => ({
      dark: false,
      toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
    }),
    {
      name: 'dark-mode', // Name of the item in local storage
    }
  )
);

export default useDarkMode;