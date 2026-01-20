/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#EC4899',
        success: '#10B981',
        warning: '#F59E0B',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#1E293B',
        'text-light': '#64748B',
        // Module-specific colors
        'module-1': '#3B82F6',
        'module-2': '#8B5CF6',
        'module-3': '#EC4899',
        'module-4': '#F59E0B',
        'module-5': '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
