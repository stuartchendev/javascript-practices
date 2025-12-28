## 1. Intro:

- A map-based application focused on state-driven UI and clear MVC separation
- Built with Vanilla JavaScript following an MVC architecture

## Demo:

https://mapty-mvc-app.netlify.app/

## ScreenShoots:

##### Map View:

![Map View](./img/Demo0.png)

##### Add Workout:

![Add Workout](./img/Demo1.png)

## 2. Features:

### Basic:

- Click on the map to add workout markers and store workout data
- Display workout history in the sidebar
- Focus on a selected workout's marker and route on the map
- Edit menu tooltip interaction
- Persist data using localStorage

### Edit Menu

- **Edit**: toggle edit mode to enable delete actions
- **Sort**: sort workouts by distance
- **Show All**: display all workouts, including markers and routes, on the map
- **Delete**: delete the selected workout (edit mode required)
- **Delete All**: remove all workouts (edit mode required)

## 3. Technical Highlights:

- Clear MVC separation between data, UI, and control logic
- State-driven rendering to ensure predictable UI updates
- Explicit instance management for markers, routing, and popups
- Deterministic UI reset flow to avoid inconsistent states
- Workout inheritance model (Running / Cycling extending base Workout)

## 4. What I Learned:

- Refactoring from a single global state to a multi-entity state design
- Avoiding render side effects by clearly separating state updates and view rendering
- Understanding when UI behavior should be handled by CSS instead of JavaScript
- Distinguishing between domain state and UI instance state
- Learning when to use guard conditions versus try-catch for flow control

## 5. Feature Impovement:

- Improve workout list UX by highlighting the active item and conditionally rendering action buttons to reduce visual noise.
- Handling complex UI state transitions (edit mode, show-all view, and item-level actions) requires clear state ownership and guard conditions, which I intentionally limited in v1 to keep the flow deterministic.
- display weather data at workout timing and place
- use geocode loction coordinate
