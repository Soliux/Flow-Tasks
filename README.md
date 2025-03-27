# FlowTasks

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**A sleek, modern task management application built with React Native and Expo.**

[Features](#features) •
[Screenshots](#screenshots) •
[Installation](#installation) •
[Usage](#usage) •
[Contributing](#contributing) •
[License](#license)

</div>

## Features

✨ **Beautiful UI** - Modern interface with support for both light and dark themes  
⏱️ **Timer Tasks** - Create tasks with countdown timers for time-sensitive activities  
🔍 **Task Categories** - Organize your tasks with custom categories and color coding  
📝 **Task Details** - Add detailed descriptions to your tasks for better context  
🔄 **Task Status** - Easily track completed and uncompleted tasks  
📅 **Due Dates** - Set due dates and times for your tasks  
💾 **Persistence** - Your tasks are saved locally on your device

## Screenshots

<div align="center">
  <img src="https://i.ibb.co/8gLZBGBt/SCR-20250327-elcs.png" alt="FlowTasks Home Page" width="400"/>
  <img src="https://i.ibb.co/JjDjfcBf/SCR-20250327-elix.png" alt="FlowTasks Tasks Page" width="400"/>
</div>

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Yarn](https://yarnpkg.com/) (optional, but recommended)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Soliux/expo-todo-list.git
cd expo-todo-list
```

2. Install dependencies:

```bash
npm install
# or if you use yarn
yarn install
```

3. Start the development server:

```bash
npx expo start
# or
npm start
# or
yarn start
```

4. Open the app:
   - Use the Expo Go app on your phone to scan the QR code
   - Press 'a' to open in an Android emulator
   - Press 'i' to open in an iOS simulator

## Usage

### Creating a Task

1. Tap the "Add" tab in the bottom navigation bar
2. Fill in the task details:
   - Enter a title for your task
   - Select a category
   - Add an optional description
   - Choose a color tag
   - Set a due date and time
   - Toggle the timer option if needed
3. Tap "Create Task" to save your task

### Timer Tasks

1. When creating a task, toggle "Timer Task" on
2. Use the slider to set the duration (from 5 seconds to 5 minutes)
3. Create the task to start the timer
4. The task will automatically mark as complete when the timer ends

### Managing Tasks

- Tap on the checkbox to mark a task as complete
- Tap on a task with a description to view the details
- Tasks are automatically sorted into "Tasks," "Timers," and "Completed" sections

## Project Structure

```
expo-todo-list/
├── app/                  # Main application code
│   ├── (tabs)/           # Tab-based navigation screens
│   │   ├── index.tsx     # Tasks list screen
│   │   ├── add.tsx       # Add task screen
│   │   └── _layout.tsx   # Tab navigation layout
├── context/              # React context for state management
│   └── TodoContext.tsx   # Todo state management
├── types/                # TypeScript type definitions
│   └── todo.ts           # Todo-related types
├── constants/            # App constants
├── hooks/                # Custom React hooks
└── components/           # Reusable components
```

## Tech Stack

- [React Native](https://reactnative.dev/) - Mobile app framework
- [Expo](https://expo.dev/) - React Native toolkit
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Navigation](https://reactnavigation.org/) - Navigation library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Developed by [Soliux](https://github.com/Soliux)
