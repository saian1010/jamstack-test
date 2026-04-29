# Jamstack Test: GitHub Repository Listing

This is a small Next.js application for the Catch Design interview test. It fetches repositories from the `github` organization, shows 10 repositories per page, and uses pagination to let you move through the result set efficiently.

## What It Does

- Fetches repository data from the GitHub REST API
- Renders a GitHub-inspired repository list
- Uses accessible pagination with numbered pages, Previous / Next controls, and a quick jump input
- Handles loading, empty, and error states
- Uses semantic HTML and keyboard-friendly controls

## Tech Choices

### Next.js

I used Next.js with the App Router because it is the fastest way to build a production-style React app with routing, server rendering, and a clean project structure. For this test, that keeps the code focused on the feature instead of framework plumbing.

### React

React is the right fit for the repository list, pagination state, and small reusable UI pieces such as the repository card and pagination control. The component model keeps the page readable and easy to extend.

### Server-side data fetching

The GitHub API request runs on the server. That keeps the client bundle smaller, avoids unnecessary client-side fetching logic, and makes the page easier to reason about. It also makes pagination by URL (`?page=`) straightforward.

### Tailwind CSS

The project uses Tailwind CSS for styling instead of custom handwritten page CSS. That makes the layout more maintainable, keeps the styling close to the markup, and is a better fit for a small feature-focused interview project.

### `rc-pagination`

I used `rc-pagination` instead of hand-rolling pagination behavior. It provides the page window, ellipsis handling, and quick-jump input out of the box, which keeps the pagination logic simpler and closer to what you would usually use in a production React app.

## Environment Variable

GitHub API rate limits can be hit during local development. If needed, add a `.env.local` file:

```bash
GITHUB_TOKEN=your_token_here
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start
```

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
features/
  repositories/
    components/
      icons.tsx
      pagination-controls.tsx
      repository-card.tsx
    data/
      github.ts
```

## Notes

- The page shows 10 repositories at a time.
- Pagination is driven by the `page` query parameter, so the current page is shareable in the URL.
- The GitHub token is optional. The app works without it, but authenticated requests are less likely to hit rate limits during repeated local testing.
