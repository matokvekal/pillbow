# Component Structure

This refactored React app follows best practices with small, focused components. Each component has its own CSS file using BEM naming convention and classnames for class management.

## Component Hierarchy

```
App
├── AppHeader
├── TimelineContainer
│   ├── ActivePillboxCard (when date is active)
│   │   ├── CardHeader
│   │   ├── TimeSlotView (for 1-5 time slots)
│   │   │   └── PillGraphic
│   │   ├── ListView (for 6+ time slots)
│   │   └── MedicationFooter
│   └── InactivePillboxCard (when date is inactive)
├── FloatingActionButtons
└── DetailSheet
```

## Component Details

### AppHeader

- **Location**: `components/AppHeader/`
- **Responsibility**: Navigation header with logo and menu button
- **Props**: `onMenuClick`

### TimelineContainer

- **Location**: `components/TimelineContainer/`
- **Responsibility**: Main scrollable timeline view, manages date visibility
- **Props**: `days`, `activeDate`, `medications`, `dayLogs`, `editableDates`, `onStatusChange`, `onPillClick`, `onDateChange`

### ActivePillboxCard

- **Location**: `components/ActivePillboxCard/`
- **Responsibility**: Full card view for the active (centered) day
- **Props**: `date`, `medications`, `dayLog`, `isEditable`, `onStatusChange`, `onPillClick`, `onClick`

### InactivePillboxCard

- **Location**: `components/InactivePillboxCard/`
- **Responsibility**: Compact preview card for inactive days
- **Props**: `date`, `medications`, `dayLog`, `onClick`

### CardHeader

- **Location**: `components/CardHeader/`
- **Responsibility**: Header section of active card (date, completion status, close button)
- **Props**: `date`, `takenCount`, `totalDoses`, `isEditable`, `onClose`

### TimeSlotView

- **Location**: `components/TimeSlotView/`
- **Responsibility**: Displays medications in a grid of time slots (1-5 columns)
- **Props**: `timeSlots`, `medications`, `dayLog`, `isEditable`, `onSlotClick`

### ListView

- **Location**: `components/ListView/`
- **Responsibility**: Displays medications in a list format (6+ time slots)
- **Props**: `timeSlots`, `medications`, `dayLog`, `isEditable`, `onSlotClick`, `onMedicationClick`

### MedicationFooter

- **Location**: `components/MedicationFooter/`
- **Responsibility**: Expandable section showing all medications for the day
- **Props**: `medications`, `onMedicationClick`

### PillGraphic

- **Location**: `components/PillGraphic/`
- **Responsibility**: Visual representation of a pill with dosage information
- **Props**: `color`, `size` ('sm' | 'md'), `count`, `strength`

### DetailSheet

- **Location**: `components/DetailSheet/`
- **Responsibility**: Bottom sheet modal showing detailed medication information
- **Props**: `medication`, `onClose`

### FloatingActionButtons

- **Location**: `components/FloatingActionButtons/`
- **Responsibility**: FAB for scanning medications and scrolling to today
- **Props**: `isScanning`, `onScan`, `onTodayClick`

## Styling Approach

### CSS Organization

- **Pattern**: BEM (Block Element Modifier)
- **Variable Style**: `block__element--modifier`
- **No Tailwind**: All styles are custom CSS in individual component files
- **Class Management**: Using `classnames` package for dynamic class binding

### Example CSS Class Names

```
.card-header__title
.card-header__badge--today
.list-view__item-icon
.list-view__item-icon.bg-blue-300
```

### Color Classes

Pills support background colors via utility classes:

- `.bg-blue-300`, `.bg-green-300`, `.bg-yellow-300`
- `.bg-red-300`, `.bg-purple-300`, `.bg-pink-300`
- `.bg-orange-300`, `.bg-indigo-300`

## Key Features

✅ **Small, focused components**: Each component has a single responsibility
✅ **Reusable**: Components like PillGraphic and CardHeader are used across multiple containers
✅ **Maintainable**: Each component has its own CSS file for easier updates
✅ **Classnames**: Dynamic class binding with the classnames package
✅ **TypeScript**: Full type safety with interfaces
✅ **No Tailwind**: Pure CSS with BEM naming convention
✅ **Responsive**: Properly styled for mobile-first design

## Adding New Components

When creating a new component:

1. Create a folder: `components/MyComponent/`
2. Create three files:
   - `MyComponent.tsx` - React component with TypeScript
   - `MyComponent.css` - Component styles (BEM naming)
   - `index.ts` in components/ - Add export to main index

3. Use classnames for dynamic classes:

   ```tsx
   className={classNames('my-component', {
     'my-component--active': isActive
   })}
   ```

4. Keep components small and focused on a single responsibility
