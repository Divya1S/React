// import { useState, useCallback, useEffect, useRef } from 'react'
// import './App.css'

// function App() {
//   const [length, setLength] = useState(8)
//   const [numberAllowed, setNumberAllowed] = useState(false)
//   const [charAllowed, setCharAllowed] = useState(false)
//   const [password, setPassword] = useState("")

//   // ref to the password field so we can select its text on copy
//   const passwordRef = useRef(null)

//   const passwordGenerator = useCallback(() => {
//     let pass = ""
//     let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
//     if (numberAllowed) str += "0123456789"
//     if (charAllowed) str += "!#$%&'()*+,-./:;<=>?@[]^_`{}~"

//     for (let i = 0; i < length; i++) {
//       const char = Math.floor(Math.random() * str.length)
//       pass += str.charAt(char)
//     }

//     setPassword(pass)
//   }, [length, numberAllowed, charAllowed])

//   const copyPasswordToClipboard = useCallback(() => {
//     passwordRef.current?.select()
//     window.navigator.clipboard.writeText(password)
//   }, [password])

//   // regenerate on first render and whenever the options change
//   useEffect(() => {
//     passwordGenerator()
//   }, [length, numberAllowed, charAllowed, passwordGenerator])

//   return (
//     <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
//       <h1 className="text-white! text-center my-3">Password Generator</h1>

//       <div className="flex shadow rounded-lg overflow-hidden mb-4">
//         <input
//           type="text"
//           value={password}
//           ref={passwordRef}
//           className="outline-none w-full py-1 px-3"
//           placeholder="Password"
//           readOnly
//         />
//         <button
//           onClick={copyPasswordToClipboard}
//           className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-blue-600"
//         >
//           copy
//         </button>
//       </div>

//       <div className="flex items-center gap-x-2 text-sm">
//         <div className="flex items-center gap-x-1">
//           <input
//             type="range"
//             min={6}
//             max={100}
//             value={length}
//             className="cursor-pointer"
//             onChange={(e) => setLength(Number(e.target.value))}
//           />
//           <label>Length: {length}</label>
//         </div>
//         <div className="flex items-center gap-x-1">
//           <input
//             type="checkbox"
//             checked={numberAllowed}
//             id="numberInput"
//             onChange={() => setNumberAllowed((prev) => !prev)}
//           />
//           <label htmlFor="numberInput">Numbers</label>
//         </div>
//         <div className="flex items-center gap-x-1">
//           <input
//             type="checkbox"
//             checked={charAllowed}
//             id="characterInput"
//             onChange={() => setCharAllowed((prev) => !prev)}
//           />
//           <label htmlFor="characterInput">Characters</label>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App


// ----------------------------------------------------------------------------
// Improved, production-quality Password Generator
// ----------------------------------------------------------------------------
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'

// Character sets used to build the password pool
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/~"
// Characters that are easy to confuse with one another (optionally excluded)
const AMBIGUOUS = new Set('O0oIl1|`'.split(''))

/**
 * Cryptographically secure integer in the range [0, max).
 * Uses crypto.getRandomValues with rejection sampling to avoid modulo bias.
 */
function secureRandomInt(max) {
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % max) // largest unbiased boundary
  const buf = new Uint32Array(1)
  let value
  do {
    crypto.getRandomValues(buf)
    value = buf[0]
  } while (value >= limit)
  return value % max
}

/** Small, dependency-free inline icons (keeps everything in one file). */
function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
function RefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

/** A single labelled checkbox option, styled as a selectable chip. */
function Option({ id, label, checked, disabled, onChange }) {
  return (
    <label
      htmlFor={id}
      className={[
        'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors select-none',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        checked
          ? 'border-indigo-500/60 bg-indigo-500/10 text-zinc-100'
          : 'border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-zinc-600',
      ].join(' ')}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 accent-indigo-500"
      />
      {label}
    </label>
  )
}

function App() {
  // --- State -----------------------------------------------------------------
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const passwordRef = useRef(null) // lets us select the field's text on copy

  const noTypeSelected = !useUpper && !useLower && !useNumbers && !useSymbols

  // Total size of the character pool — used for the entropy calculation.
  const poolSize = useMemo(() => {
    const count = (set) =>
      excludeAmbiguous ? set.split('').filter((c) => !AMBIGUOUS.has(c)).length : set.length
    let n = 0
    if (useUpper) n += count(UPPERCASE)
    if (useLower) n += count(LOWERCASE)
    if (useNumbers) n += count(NUMBERS)
    if (useSymbols) n += count(SYMBOLS)
    return n
  }, [useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous])

  // --- Generation ------------------------------------------------------------
  const generatePassword = useCallback(() => {
    // Collect the selected sets, dropping ambiguous chars if requested.
    const sets = []
    if (useUpper) sets.push(UPPERCASE)
    if (useLower) sets.push(LOWERCASE)
    if (useNumbers) sets.push(NUMBERS)
    if (useSymbols) sets.push(SYMBOLS)

    const activeSets = sets
      .map((s) => (excludeAmbiguous ? s.split('').filter((c) => !AMBIGUOUS.has(c)).join('') : s))
      .filter((s) => s.length > 0)

    const pool = activeSets.join('')
    if (pool.length === 0) {
      setPassword('')
      return
    }

    // Guarantee at least one character from each selected set (when length allows).
    const chars = []
    for (const set of activeSets) {
      if (chars.length < length) chars.push(set[secureRandomInt(set.length)])
    }
    // Fill the remainder from the full pool.
    while (chars.length < length) {
      chars.push(pool[secureRandomInt(pool.length)])
    }
    // Fisher–Yates shuffle so the guaranteed chars aren't predictably placed.
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }

    setPassword(chars.slice(0, length).join(''))
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous])

  // Real-time regeneration: debounced so dragging the slider feels smooth.
  // Runs on mount and whenever any option changes.
  useEffect(() => {
    const id = setTimeout(generatePassword, 120)
    return () => clearTimeout(id)
  }, [generatePassword])

  // --- Copy to clipboard -----------------------------------------------------
  const copyToClipboard = useCallback(() => {
    if (!password) return
    passwordRef.current?.select()
    navigator.clipboard?.writeText(password)
    setCopied(true)
  }, [password])

  // Auto-dismiss the "Copied!" feedback.
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  // --- Strength (entropy based) ----------------------------------------------
  const strength = useMemo(() => {
    const entropy = password && poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0
    if (entropy === 0) return { score: 0, label: '—', bar: 'bg-zinc-600', text: 'text-zinc-500', entropy }
    if (entropy < 40) return { score: 1, label: 'Weak', bar: 'bg-red-500', text: 'text-red-400', entropy }
    if (entropy < 60) return { score: 2, label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-400', entropy }
    if (entropy < 80) return { score: 3, label: 'Strong', bar: 'bg-lime-500', text: 'text-lime-400', entropy }
    return { score: 4, label: 'Very Strong', bar: 'bg-emerald-500', text: 'text-emerald-400', entropy }
  }, [password, length, poolSize])

  // --- UI --------------------------------------------------------------------
  return (
    <div className="m-auto w-full max-w-xl p-4 text-left">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
        {/* Header — rendered as a div with role="heading" so the global h1
            styles in index.css don't override this card's layout. */}
        <div role="heading" aria-level={1} className="text-2xl font-semibold tracking-tight text-zinc-100">
          Password Generator
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Strong, cryptographically-secure passwords — generated right in your browser.
        </p>

        {/* Password display */}
        <div className="mt-6">
          <label htmlFor="password" className="sr-only">Generated password</label>
          <div className="flex items-stretch gap-2">
            <input
              id="password"
              ref={passwordRef}
              type="text"
              value={password}
              readOnly
              spellCheck={false}
              placeholder="Select at least one option…"
              aria-label="Generated password"
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 font-mono text-lg tracking-wide text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="button"
              onClick={generatePassword}
              title="Regenerate"
              aria-label="Regenerate password"
              className="grid w-12 shrink-0 place-items-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 active:scale-95"
            >
              <RefreshIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!password}
              aria-label="Copy password to clipboard"
              className={[
                'grid w-12 shrink-0 place-items-center rounded-xl border transition active:scale-95',
                copied
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-700',
                !password ? 'cursor-not-allowed opacity-40' : '',
              ].join(' ')}
            >
              {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Screen-reader + visual feedback for copy */}
          <p aria-live="polite" className="mt-2 h-4 text-xs font-medium text-emerald-400">
            {copied ? 'Copied to clipboard!' : ''}
          </p>
        </div>

        {/* Strength meter */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Strength</span>
            <span className={`font-semibold ${strength.text}`}>
              {strength.label}
              {strength.entropy > 0 && (
                <span className="ml-1 font-normal text-zinc-500">~{strength.entropy} bits</span>
              )}
            </span>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  seg <= strength.score ? strength.bar : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Length slider */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="length" className="text-sm font-medium text-zinc-300">
              Length
            </label>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-sm text-indigo-300">
              {length}
            </span>
          </div>
          <input
            id="length"
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            aria-valuetext={`${length} characters`}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-indigo-500"
          />
        </div>

        {/* Character-type options */}
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-medium text-zinc-300">Include</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Option id="opt-upper" label="ABC" checked={useUpper} onChange={() => setUseUpper((v) => !v)} />
            <Option id="opt-lower" label="abc" checked={useLower} onChange={() => setUseLower((v) => !v)} />
            <Option id="opt-numbers" label="123" checked={useNumbers} onChange={() => setUseNumbers((v) => !v)} />
            <Option id="opt-symbols" label="#$&" checked={useSymbols} onChange={() => setUseSymbols((v) => !v)} />
          </div>

          <div className="mt-2">
            <Option
              id="opt-ambiguous"
              label="Exclude look-alike characters (O/0, l/1/I)"
              checked={excludeAmbiguous}
              onChange={() => setExcludeAmbiguous((v) => !v)}
            />
          </div>
        </fieldset>

        {/* Helpful message when nothing is selected */}
        {noTypeSelected && (
          <p role="alert" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Select at least one character type to generate a password.
          </p>
        )}
      </div>
    </div>
  )
}

export default App
