import {create} from 'zustand';

const useUserStore = create((set) => ({
  currentUser: null, // Initial state for user is null (not logged in)
  userLoaded: false,
  // Action to set the user
  login: (user) => set(() => ({ currentUser:user })),

  // Action to clear the user (logout)
  logout: () => set(() => ({ currentUser: null })),

  setUserLoaded: (loaded) => set({ userLoaded: loaded }),
}));

export default useUserStore;