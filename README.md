# Spin the Wheel

A customizable random choice spinner for games, life decisions, and live streams. Add your options, spin the wheel, and let fate decide.

## Features

- **Fully Customizable** - Add up to 20 items to your wheel
- **5 Color Themes** - Carnival, Ocean, Sunset, Forest, and Neon
- **Smooth Animations** - Satisfying spin physics powered by Framer Motion
- **Mobile Friendly** - Works great on phones, tablets, and desktops
- **Accessible** - Screen reader support, keyboard navigation, and reduced motion support
- **No Account Required** - Just open and spin

## Use Cases

- **Games** - Pick the next player, choose a challenge, or randomize teams
- **Live Streams** - Engage your audience with random giveaways or viewer choices
- **Decisions** - Can't decide where to eat? Let the wheel choose
- **Classroom** - Pick students for activities or randomize groups
- **Parties** - Truth or dare, who goes next, prize wheels

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/clesinski/spin-the-wheel.git
cd spin-the-wheel

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## How to Use

1. **Add Items** - Type your choices and press Enter or click Add
2. **Choose a Theme** - Pick a color scheme that fits your vibe
3. **Spin** - Click the center button and watch it go
4. **See Results** - The winner is announced with options to spin again or start fresh

## Themes

| Theme | Description |
|-------|-------------|
| Carnival | Classic red, orange, yellow, green, blue, purple |
| Ocean | Cool navy, teal, and cyan tones |
| Sunset | Warm orange, coral, pink, and magenta |
| Forest | Natural greens from dark to lime |
| Neon | Bright colors on a dark background |

## Accessibility

- Full keyboard navigation
- Screen reader announcements for spin results
- Respects `prefers-reduced-motion` for users sensitive to animations
- Focus indicators on all interactive elements
- ARIA labels and live regions

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Made with Next.js and Framer Motion
