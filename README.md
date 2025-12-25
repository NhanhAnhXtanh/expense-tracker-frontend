# Expense Tracker Frontend

React + TypeScript + Vite + shadcn/ui + Tailwind CSS + Google Login

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

## 🔐 Google Login Setup

### 1. Google Cloud Console

1. Create OAuth ClientID (Web Application)
2. Add authorized JavaScript origin: `http://localhost:5173`
3. Copy Client ID

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:8081
VITE_API_BASE_PATH=/rest
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

⚠️ **Security:** Never commit `.env.local`!

## 🔌 Backend (Jmix) Setup Required

Your Jmix backend must be configured as a **Resource Server** to verify Google JWT tokens.

### Backend Requirements:

1. **Disable Jmix UI Login:**
   ```properties
   jmix.ui.login-view-id=
   ```

2. **Add Spring Security Resource Server:**
   ```gradle
   implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
   ```

3. **Configure JWT Verification:**
   ```properties
   spring.security.oauth2.resourceserver.jwt.issuer-uri=https://accounts.google.com
   ```

4. **Security Config:**
   ```java
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig {
     @Bean
     SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http
         .csrf(csrf -> csrf.disable())
         .authorizeHttpRequests(auth -> auth
           .requestMatchers("/actuator/**").permitAll()
           .anyRequest().authenticated()
         )
         .oauth2ResourceServer(oauth -> oauth.jwt());
       return http.build();
     }
   }
   ```

5. **Map Google User to Jmix:**
   - Extract `sub`, `email`, `name` from JWT
   - Create or update User entity
   - Assign default roles (e.g., `ui-minimal`)

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **@react-oauth/google** - Google Login
- **React Router** - Navigation

## 🎨 shadcn/ui Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

See: https://ui.shadcn.com

## 📖 How It Works

```
User clicks "Sign in with Google"
   ↓
Google authenticates user
   ↓
React receives ID Token (JWT)
   ↓
Token stored in sessionStorage
   ↓
All API calls include: Authorization: Bearer {token}
   ↓
Jmix verifies JWT signature
   ↓
Maps Google user to Jmix User entity
   ↓
Returns data
```

## 🔒 Security

- ✅ Google JWT tokens
- ✅ No client secret in frontend
- ✅ Backend verifies all tokens
- ✅ Tokens stored in sessionStorage (auto-cleared on browser close)
- ❌ No passwords
- ❌ No session cookies

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Jmix backend URL | ✅ |
| `VITE_API_BASE_PATH` | API base path (usually `/rest`) | ✅ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |

## 🌐 Production Deployment

1. Update `.env.production` with production URLs
2. Build: `pnpm build`
3. Deploy `dist/` folder to static hosting
4. Update Google OAuth authorized origins to include production domain
5. Ensure backend CORS allows production frontend domain

## 📚 Documentation

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)
- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
