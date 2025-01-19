# InstaWrapped

InstaWrapped is a web application that analyzes Instagram chat exports and provides insightful visualizations and statistics about your conversations.

## Features

- Upload Instagram chat export (JSON format)
- Analyze message counts, response times, and interest levels
- Visualize conversation timeline and emoji usage
- Identify conversation highlights and milestones
- Premium features including word analysis and sentiment tracking

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yugofrl/InstaWrapped.git
   ```
2. Navigate to the project directory:
   ```bash
   cd instawrapped
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or if you're using Yarn:
   ```bash
   yarn install
   ```

### Usage

1. Start the development server:
   ```bash
   npm start
   ```
   or with Yarn:
   ```bash
   yarn start
   ```
2. Open your web browser and navigate to `http://localhost:3000` to access the application.

### Build for Production

To create an optimized production build:
```bash
npm run build
```
or with Yarn:
```bash
yarn build
```
The build will be output to the `build` directory.

### Features Overview

#### Upload Instagram Chat Export
- Upload your `messages.json` file exported from Instagram.
- Ensure the file is in JSON format for the application to parse correctly.

#### Analytics
- **Message Count**: Total messages exchanged and individual contributor stats.
- **Response Time**: Analyze average and median response times.
- **Interest Levels**: Gauge activity spikes and frequency.

#### Visualizations
- **Timeline**: Graphical representation of the conversation over time.

#### Premium Features
- **Word Analysis**: Explore most frequently used words or phrases.
- **Sentiment Tracking**: Understand the emotional tone of your conversations.

### Contribution

We welcome contributions to InstaWrapped! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.
