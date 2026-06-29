import { useState } from "react"

// All colors live in ONE list. To add a color, just add a line here.
const colors = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Slate", value: "#1e293b" },
  { name: "White", value: "#ffffff" },
]

function App() {
  const [color, setColor] = useState("#3b82f6")

  // Pick a readable text color (dark text on light backgrounds, light on dark).
  const isLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Perceived brightness formula (0–255).
    return (r * 299 + g * 587 + b * 114) / 1000 > 150
  }

  const textColor = isLight(color) ? "#111827" : "#ffffff"

  const randomColor = () => {
    const next = colors[Math.floor(Math.random() * colors.length)]
    setColor(next.value)
  }

  return (
    <div
      className="w-full h-screen transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: color }}
    >
      {/* Heading + current color, centered */}
      <div
        className="flex flex-col items-center justify-center h-full gap-2 select-none"
        style={{ color: textColor }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Background Changer
        </h1>
        <p className="text-lg opacity-80">
          Current color:{" "}
          <span className="font-mono font-semibold">{color}</span>
        </p>
      </div>

      {/* Floating control bar */}
      <div className="fixed inset-x-0 bottom-10 flex flex-wrap justify-center px-3">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/95 px-5 py-3 shadow-2xl backdrop-blur">
          {colors.map((c) => {
            const active = color === c.value
            return (
              <button
                key={c.name}
                onClick={() => setColor(c.value)}
                aria-label={`Set background to ${c.name}`}
                title={c.name}
                className={`h-9 w-9 rounded-full border transition-transform duration-150 outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                  active
                    ? "scale-110 ring-2 ring-offset-2 ring-gray-900 border-transparent"
                    : "border-gray-200 hover:scale-110"
                }`}
                style={{ backgroundColor: c.value }}
              />
            )
          })}

          {/* Divider */}
          <span className="mx-1 h-7 w-px bg-gray-800" />

          {/* Random button */}
          <button
            onClick={randomColor}
            className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white shadow transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            Random
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
