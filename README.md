# Ortex Login Page

A modern, responsive login page for Ortex.com built with React, TypeScript, and Vite.

## Features

- **Responsive Design**: Works seamlessly on mobile and desktop
- **Login Form**: Posts credentials to `/login` endpoint
- **Password Reset**: Modal for password reset functionality
- **Live Market Data**: Real-time EUR/USD exchange rate via WebSocket
- **TypeScript**: Full type safety and modern React patterns
- **Comprehensive Testing**: Unit tests for all components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test
```

Run tests once (CI mode):

```bash
npm run test:run
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run coverage
```

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx          # Main login component
│   ├── LoginPage.css          # Styles for login page
│   ├── ResetPasswordModal.tsx # Password reset modal
│   ├── MarketData.tsx         # WebSocket EUR/USD feed
│   └── __tests__/             # Component tests
│       ├── LoginPage.test.tsx
│       ├── ResetPasswordModal.test.tsx
│       └── MarketData.test.tsx
├── __tests__/                 # App-level tests
│   └── App.test.tsx
├── App.tsx                    # Main app component
├── App.css                    # Global styles
├── main.tsx                   # App entry point
└── test-setup.ts              # Test configuration
```

## Testing Strategy

### Component Tests

- **LoginPage**: Form validation, submission, password toggle, modal interactions
- **ResetPasswordModal**: Modal behavior, form submission, validation
- **MarketData**: WebSocket connection, data display, error handling
- **App**: Component rendering and integration

### Test Coverage

The test suite covers:

- User interactions (form filling, button clicks)
- Form validation and submission
- WebSocket connection and data handling
- Modal open/close behavior
- Loading states and error handling
- Component integration

### Mocking Strategy

- WebSocket API mocked for reliable testing
- Fetch API mocked for login requests
- Child components mocked for isolated testing
- Console methods mocked to reduce test noise

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **Testing Library** - Component testing utilities
- **CSS3** - Styling with modern features
- **WebSocket** - Real-time market data

## API Integration

### Login Endpoint

- **URL**: `/login`
- **Method**: POST
- **Body**: `{ username: string, password: string }`

### WebSocket Feed

- **URL**: `ws://stream.tradingeconomics.com/?client=guest:guest`
- **Subscribe**: `{"topic": "subscribe", "to": "EURUSD:CUR"}`
- **Response**: `{ price: string, dt: string }`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## How This App Was Built

When building this login page, I focused on creating something that feels modern and professional while keeping the code maintainable. The whole thing is built with React and TypeScript, which gives us that nice type safety that catches bugs before they happen.

The architecture is pretty straightforward - I broke everything into small, focused components. The main LoginPage handles the form logic, there's a separate ResetPasswordModal for the password reset flow, and the MarketData component manages the live EUR/USD feed. Each component has one job and does it well.

For the real-time market data, I built a custom useWebSocket hook that handles all the connection logic, reconnections, and cleanup. It's one of those things that looks simple from the outside but handles a lot of edge cases under the hood - like what happens when the connection drops or when you get malformed data.

The styling uses plain CSS with some modern techniques like CSS Grid and Flexbox. I went with a glassmorphism design that looks clean and professional. Everything is responsive and works well on mobile devices.

Testing was a big focus here. I used Vitest with Testing Library to write tests that actually test user behavior rather than implementation details. The WebSocket testing was particularly tricky - I had to create a mock WebSocket class that could simulate all the different connection states and message types.

## What Could Be Better

There are definitely some areas where this could be improved if it were going into production. The biggest thing would be adding proper error boundaries - right now if something breaks, it might crash the whole component tree. I'd also want to implement a more robust state management solution if this were part of a larger app.

Security-wise, there's room for improvement. In a real app, you'd want input sanitization, rate limiting on login attempts, and proper CSRF protection. The WebSocket connection could also be more secure with proper authentication tokens.

The CSS architecture could be better organized. Right now it's just one big CSS file per component, but for a larger app you'd probably want CSS modules or styled-components to avoid naming conflicts and make theming easier.

Performance-wise, the app is pretty snappy as is, but there are optimizations you could make. The WebSocket connection could be smarter about reconnection strategies, and you could add service workers for offline functionality.

From a user experience perspective, adding animations and micro-interactions would make it feel more polished. A dark mode toggle would be nice too - everyone expects that these days. The form validation could be more sophisticated with real-time feedback as users type.

For the development workflow, adding Storybook would make it easier to develop and test components in isolation. Setting up proper CI/CD with automated testing and deployment would be essential for a production app.

The testing could be expanded with end-to-end tests using something like Playwright to test the full user journey. Visual regression testing would catch UI bugs that unit tests might miss.

If this were part of a larger system, you'd probably want to extract the WebSocket logic into a more general-purpose service that could handle multiple data streams. The form handling could be abstracted into reusable hooks that other parts of the app could use.

## Technical Decisions

I chose Vite over Create React App because it's faster and has better TypeScript support out of the box. The build times are noticeably quicker, especially during development.

For testing, Vitest was a natural choice since it integrates seamlessly with Vite and has a Jest-compatible API. The WebSocket mocking was probably the most complex part of the test setup, but it ensures the tests are reliable and don't depend on external services.

TypeScript strict mode is enabled, which catches a lot of potential issues at compile time. The type definitions are pretty comprehensive - even the WebSocket mock has proper typing.

The component structure follows React best practices with functional components and hooks. I used useCallback for the WebSocket connection function to prevent unnecessary re-renders, which is important for performance when dealing with real-time data.

Overall, this is a solid foundation that demonstrates modern React development practices while keeping things simple and maintainable.

## License

This project is for demonstration purposes.
