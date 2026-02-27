# TypeScript Migration Guide

This guide will help you gradually migrate the memorial project from JavaScript to TypeScript.

## What's Been Set Up

✅ TypeScript configuration files (`tsconfig.json`, `tsconfig.node.json`)
✅ Vite config converted to TypeScript
✅ Project accepts both `.js`/`.jsx` and `.ts`/`.tsx` files

## Installation

Before proceeding, install TypeScript and type definitions:

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node --legacy-peer-deps
```

Additional type definitions you may need:
```bash
npm install --save-dev --legacy-peer-deps \
  @types/luxon \
  @types/mapbox-gl \
  @types/react-helmet \
  @types/three
```

## Migration Strategy

### Recommended Order

1. **Start with utility files** - Pure logic with no JSX (files in `src/logic/`, `src/hooks/`)
2. **Move to simple components** - Components with few props
3. **Tackle complex components** - Components with many dependencies
4. **Convert pages last** - After most components are typed

### Step-by-Step File Conversion

#### 1. Rename the file
```bash
# For files without JSX
mv src/logic/array.js src/logic/array.ts

# For files with JSX
mv src/components/Author.jsx src/components/Author.tsx
```

#### 2. Add type annotations

**Before (JavaScript):**
```jsx
export function Author({ name, bio, imageUrl }) {
  return (
    <div className="author">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  )
}
```

**After (TypeScript):**
```tsx
interface AuthorProps {
  name: string
  bio: string
  imageUrl: string
}

export function Author({ name, bio, imageUrl }: AuthorProps) {
  return (
    <div className="author">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  )
}
```

#### 3. Type your hooks

**Before:**
```js
export function useTimeout(callback, delay) {
  const savedCallback = useRef()
  
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}
```

**After:**
```tsx
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()
  
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  
  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}
```

### Common Type Patterns

#### React Component Props
```tsx
// Functional component with props
interface MyComponentProps {
  title: string
  count?: number  // optional prop
  onClick: () => void
  children?: React.ReactNode
}

export function MyComponent({ title, count = 0, onClick, children }: MyComponentProps) {
  // ...
}
```

#### Event Handlers
```tsx
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // ...
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // ...
}
```

#### Refs
```tsx
const inputRef = useRef<HTMLInputElement>(null)
const divRef = useRef<HTMLDivElement>(null)
```

#### State
```tsx
// Simple state
const [count, setCount] = useState<number>(0)

// Complex state
interface User {
  id: string
  name: string
  email: string
}

const [user, setUser] = useState<User | null>(null)
```

#### API Responses
```tsx
interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

interface Story {
  id: string
  title: string
  author: string
  // ... other fields
}

const fetchStory = async (id: string): Promise<ApiResponse<Story>> => {
  // ...
}
```

### Dealing with Third-Party Libraries Without Types

For libraries without type definitions, create a `src/types` folder:

```bash
mkdir -p src/types
```

Create declaration files (e.g., `src/types/vite-plugin-string.d.ts`):
```typescript
declare module 'vite-plugin-string' {
  import { Plugin } from 'vite'
  export default function vitePluginString(): Plugin
}
```

### Gradual Strictness

The current `tsconfig.json` has `strict: true`, but you can temporarily relax this:

```json
{
  "compilerOptions": {
    "strict": false,  // Start loose
    "noImplicitAny": true,  // Enable this first
    "strictNullChecks": false,  // Enable later
    // ... gradually enable more strict options
  }
}
```

## Suggested Migration Files (Priority Order)

### Phase 1: Utilities & Hooks (No JSX)
- [ ] `src/logic/array.js`
- [ ] `src/hooks/timeout.js`
- [ ] `src/hooks/date.js`
- [ ] `src/hooks/viewport.js`
- [ ] `src/hooks/language.js`
- [ ] `src/hooks/data.js`
- [ ] `src/constants.js`
- [ ] `src/store.js`

### Phase 2: Simple Components
- [ ] `src/components/LangLink.jsx`
- [ ] `src/components/InputField.jsx`
- [ ] `src/components/TextareaField.jsx`
- [ ] `src/components/PlayPauseBtn.jsx`
- [ ] `src/components/ScrollIcon.jsx`
- [ ] `src/components/MetadataField.jsx`
- [ ] `src/components/Author.jsx`

### Phase 3: Medium Components
- [ ] `src/components/Header.jsx`
- [ ] `src/components/Footer.jsx`
- [ ] `src/components/SearchField.jsx`
- [ ] `src/components/DocumentItem.jsx`
- [ ] `src/components/StoryItem.jsx`

### Phase 4: Complex Components & Pages
- Convert remaining components and pages

## Tips

1. **Use `any` sparingly** - It defeats the purpose of TypeScript, but can be useful temporarily
2. **Let TypeScript infer when possible** - Don't annotate everything
3. **Run TypeScript check regularly**: `npx tsc --noEmit`
4. **Use IDE features** - VSCode will show type errors and suggest types
5. **Check one file at a time** - Don't convert everything at once

## Common Errors & Solutions

### "Cannot find module" errors
Make sure imports have the correct extension (or no extension with moduleResolution: "bundler"):
```tsx
import { something } from './utils'  // ✅ Works with bundler resolution
```

### "Property does not exist on type"
Either the property is genuinely missing (typo) or you need to type the object:
```tsx
interface Config {
  apiUrl: string
  [key: string]: any  // Allow additional properties
}
```

### "Object is possibly 'null'"
Use optional chaining or type guards:
```tsx
const value = obj?.property
// or
if (obj !== null) {
  const value = obj.property
}
```

## Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite TypeScript Guide](https://vitejs.dev/guide/features.html#typescript)

## Need Help?

When stuck:
1. Check the error message carefully - TypeScript errors are usually helpful
2. Look at similar typed files in the project
3. Search for the error message
4. Ask for assistance!
