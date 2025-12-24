# Expense Tracker Frontend

React + TypeScript + Vite + shadcn/ui + Tailwind CSS

## 🚀 Getting Started

### Development
```bash
pnpm install
pnpm dev
```

### Build
```bash
pnpm build
```

### Preview
```bash
pnpm preview
```

## 🔌 API Configuration

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
   
   ⚠️ **Security:** Never commit `.env.local` or `.env.production`! See `SECURITY.md` for details.


2. Configure your backend credentials:
```env
VITE_API_URL=http://localhost:8081
VITE_API_BASE_PATH=/rest
VITE_OAUTH2_TOKEN_URL=http://localhost:8081/oauth2/token
VITE_OAUTH2_CLIENT_ID=my-client
VITE_OAUTH2_CLIENT_SECRET=my-secret
```

### Test Connection

The app includes an OAuth2 test page:

1. Start your backend on port 8081
2. Run `pnpm dev`
3. Open http://localhost:5173
4. Click **"Get Token"** → Authenticates with OAuth2
5. Click **"Fetch Users"** → Calls `/rest/entities/User`

**API automatically handles:**
- OAuth2 token fetching
- Token caching
- Auto-retry on 401
- Bearer token in headers



## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Radix UI** - Headless UI primitives

## 🎨 shadcn/ui

### Adding Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

**Examples:**
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
```

### Usage

```tsx
import { Button } from '@/components/ui/button'

function App() {
  return <Button>Click me</Button>
}
```

### Available Components
- `button`, `card`, `dialog`, `input`, `select`, `table`, `toast`, `form`, `dropdown-menu`, `tabs`, and more

📚 See all components: https://ui.shadcn.com/docs/components

## 🔧 Path Aliases

Use `@/` to import from `src/`:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

**Note:** If you see red squiggly lines in your IDE, restart the TypeScript server:
- VSCode: `Ctrl+Shift+P` → `TypeScript: Restart TS Server`

## 🌙 Dark Mode

Add `className="dark"` to `<html>` element to enable dark mode.

## 📖 Documentation

- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [React](https://react.dev)
- [Vite](https://vite.dev)
