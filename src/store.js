import create from 'zustand';

export const useStore = create((set) => ({
  theme: {
    name: 'default'
  },
  changeTheme: ({ name }) => {
    document.body.className = ''
    document.body.classList.add(name)
    return set(state => ({
      theme: { name }
    }))
  }
}))
