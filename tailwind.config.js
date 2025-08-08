/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './App.tsx',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // NcuScript 디자인 시스템 색상
        'primary-background': '#1A1A1A',
        'primary-surface': '#2C2C2C',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A9A9A9',
        'accent-blue': '#007BFF',
        'status-error': '#FF4D4F',
        'status-warning': '#FAAD14',
        'status-success': '#52C41A',
        
        // shadcn/ui 색상 토큰
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'primary': ['Pretendard', 'Noto Sans KR', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
        'heading': ['Pretendard', 'Noto Sans KR', 'sans-serif'],
        'body': ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      },
      
      // 8pt 그리드 시스템
      spacing: {
        '0.5': '2px',   // 0.5 * 4px
        '1': '4px',     // 1 * 4px
        '1.5': '6px',   // 1.5 * 4px
        '2': '8px',     // 2 * 4px = 1 grid unit
        '3': '12px',    // 3 * 4px
        '4': '16px',    // 4 * 4px = 2 grid units
        '5': '20px',    // 5 * 4px
        '6': '24px',    // 6 * 4px = 3 grid units
        '7': '28px',    // 7 * 4px
        '8': '32px',    // 8 * 4px = 4 grid units
        '9': '36px',    // 9 * 4px
        '10': '40px',   // 10 * 4px = 5 grid units
        '11': '44px',   // 11 * 4px
        '12': '48px',   // 12 * 4px = 6 grid units
        '14': '56px',   // 14 * 4px = 7 grid units
        '16': '64px',   // 16 * 4px = 8 grid units
        '20': '80px',   // 20 * 4px = 10 grid units
        '24': '96px',   // 24 * 4px = 12 grid units
        '28': '112px',  // 28 * 4px = 14 grid units
        '32': '128px',  // 32 * 4px = 16 grid units
        '36': '144px',  // 36 * 4px = 18 grid units
        '40': '160px',  // 40 * 4px = 20 grid units
        '44': '176px',  // 44 * 4px = 22 grid units
        '48': '192px',  // 48 * 4px = 24 grid units
        '52': '208px',  // 52 * 4px = 26 grid units
        '56': '224px',  // 56 * 4px = 28 grid units
        '60': '240px',  // 60 * 4px = 30 grid units
        '64': '256px',  // 64 * 4px = 32 grid units
        '72': '288px',  // 72 * 4px = 36 grid units
        '80': '320px',  // 80 * 4px = 40 grid units
        '96': '384px',  // 96 * 4px = 48 grid units
      },
      
      // 반응형 브레이크포인트 (8pt 기반)
      screens: {
        'xs': '480px',    // 60 grid units
        'sm': '640px',    // 80 grid units
        'md': '768px',    // 96 grid units
        'lg': '1024px',   // 128 grid units
        'xl': '1280px',   // 160 grid units
        '2xl': '1536px',  // 192 grid units
      },
      
      // 추가 타이포그래피 스케일
      fontSize: {
        'xs': ['10px', { lineHeight: '14px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '26px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['28px', { lineHeight: '36px' }],
        '5xl': ['36px', { lineHeight: '1' }],
        '6xl': ['48px', { lineHeight: '1' }],
        '7xl': ['60px', { lineHeight: '1' }],
        '8xl': ['72px', { lineHeight: '1' }],
        '9xl': ['96px', { lineHeight: '1' }],
      },
      
      // 그리드 시스템 확장
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      
      // 커스텀 애니메이션
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      
      // 박스 섀도우
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'hard': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    import("tailwindcss-animate"),
    // 8pt 그리드 시스템을 위한 커스텀 유틸리티
    function({ addUtilities }) {
      addUtilities({
        '.grid-8pt': {
          display: 'grid',
          gap: '8px', // 1 grid unit
        },
        '.grid-16pt': {
          display: 'grid',
          gap: '16px', // 2 grid units
        },
        '.grid-24pt': {
          display: 'grid',
          gap: '24px', // 3 grid units
        },
        '.grid-32pt': {
          display: 'grid',
          gap: '32px', // 4 grid units
        },
      });
    },
  ],
}