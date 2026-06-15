# Product Requirements Document (PRD)

## Project Overview
A group project to create a simple ToDoApp, profounding a real time solution to safe track dasily work.

## Goal
Build a lightweight, easy-to-use task tracker for daily work management with a focus on collaboration, task status visibility, and real-time updates.

## Target Users
- Students managing homework and assignments
- Small teams coordinating daily tasks
- Individuals tracking personal to-do items and habits

## Key Features
- Task Creation (Dev: Mujeeb)
- Task Completion (Dev: Sobur)
- Task Merge (Dev: Abdulqayyum)
- Task status tracking
- Responsive and simple user interface
- Persistent task list through browser storage (if implemented)

## User Stories
1. As a user, I want to add a new task quickly so I can capture work items as they come up.
2. As a user, I want to mark tasks as complete so I can see my progress.
3. As a user, I want to merge related tasks so I can consolidate work items and reduce clutter.
4. As a user, I want to view task status so I can understand what is pending, in progress, or done.

## Functional Requirements
- Users can create a new task with a title and optional description.
- Users can view a list of current tasks.
- Users can mark a task as complete or incomplete.
- Users can merge two or more tasks into one consolidated task.
- Users can filter or sort tasks by status.

## Non-Functional Requirements
- The app must be responsive across desktop and mobile screen sizes.
- The UI should be intuitive and fast.
- The app should load quickly and handle small task lists smoothly.

## Success Metrics
- Tasks can be added, completed, and merged without page reload.
- Users can easily identify task status.
- The interface works well on both desktop and mobile.

## Risks
- Real-time collaboration features may require backend support not available in this simple app.
- Task merge behavior must remain predictable and not lose user data.

## Future Enhancements
- Add user authentication.
- Add online real-time sync across devices.
- Add task categories, deadlines, and reminders.
- Add drag-and-drop task ordering.
