# Project Structure

## Root Directory Organization
```
├── app/                    # Expo Router app directory (file-based routing)
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Custom tab bar with sliding animation
│   │   ├── index.tsx      # Home tab screen (healthcare dashboard)
│   │   ├── records.tsx    # Records tab screen
│   │   ├── community.tsx  # Community tab screen
│   │   └── family.tsx     # Family tab screen
│   ├── profile.tsx        # Standalone profile screen (not in tabs)
│   ├── _layout.tsx        # Root layout with fonts and splash screen
│   └── +not-found.tsx     # 404 error screen
├── components/            # Shared components
│   └── BackArrow.tsx      # Reusable back navigation component
├── constants/             # App constants and design tokens
│   └── Typography.ts      # Typography system and brand colors
├── services/              # Business logic and API services
│   └── satronis/          # AI-powered health intelligence services
├── assets/                # Static assets
│   └── images/            # App icons, logos, and graphics
├── hooks/                 # Custom React hooks
│   └── useFrameworkReady.ts # Framework initialization hook
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/          # AI guidance documents
└── [config files]        # Various configuration files
```

## Routing Conventions
- **File-based routing**: Use Expo Router conventions
- **Route groups**: Parentheses `(tabs)` for layout grouping without affecting URL
- **Special files**: 
  - `_layout.tsx` for nested layouts
  - `+not-found.tsx` for error pages
  - `index.tsx` for default routes

## Component Organization
- **Screens**: Place in appropriate app directory structure
- **Shared components**: Create `components/` directory when needed
- **Hooks**: Place custom hooks in `hooks/` directory
- **Utils**: Create `utils/` or `lib/` directory for shared utilities

## Import Conventions
- Use `@/` path mapping for root-level imports
- Prefer named imports over default imports where possible
- Import React Native components from 'react-native'
- Import Expo modules with full package names

## File Naming
- **Screens**: Use descriptive names matching their purpose
- **Components**: PascalCase for component files
- **Hooks**: Start with 'use' prefix (camelCase)
- **Utilities**: camelCase or kebab-case for utility files

## Platform-Specific Code
- Use `Platform.OS` checks for platform-specific logic
- Leverage Expo's cross-platform APIs when possible
- Consider web-specific optimizations for web builds