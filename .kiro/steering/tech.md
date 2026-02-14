# Technology Stack

## Framework & Runtime
- **React Native**: 0.79.5 with New Architecture enabled
- **Expo**: ~53.0.20 (managed workflow)
- **React**: 19.0.0
- **TypeScript**: ~5.8.3 with strict mode enabled

## Navigation & Routing
- **Expo Router**: ~5.1.4 (file-based routing with typed routes)
- **React Navigation**: Custom tab bar with sliding highlight animation
- **Navigation Pattern**: Floating dock with 4 tabs (Home, Records, Community, Family)

## UI & Styling
- **Expo Blur**: Glass morphism effects for tab bar
- **Lucide React Native**: Icon system
- **Expo Linear Gradient**: Gradient effects
- **React Native Reanimated**: ~3.17.4 for animations
- **React Native Gesture Handler**: Touch interactions

## Fonts & Assets
- **Outfit Font Family**: Bold, SemiBold, Medium, Regular (brand/headings/UI)
- **Inter Font Family**: 400, 500, 600, 700 weights (body text/readability)
- **Expo Vector Icons**: Additional icon support
- **Expo Symbols**: System symbols (iOS)

## Development Tools
- **Babel**: Expo preset with router and reanimated plugins
- **Prettier**: 2-space indentation, single quotes, bracket spacing
- **Cross-env**: Environment variable management
- **Metro**: Bundler for web builds

## Common Commands
```bash
# Development
npm run dev              # Start Expo development server
npm run build:web        # Build for web deployment
npm run lint            # Run Expo linting

# Platform-specific testing
# Use Expo Go app or development builds for testing
```

## Configuration Notes
- Uses `legacy-peer-deps=true` in .npmrc for dependency resolution
- TypeScript path mapping with `@/*` for root imports
- Telemetry disabled via `EXPO_NO_TELEMETRY=1`
- Automatic UI style switching (light/dark mode support)