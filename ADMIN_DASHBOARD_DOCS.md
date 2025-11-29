# Admin Dashboard Components Documentation

## Overview

The Admin Dashboard is a comprehensive management interface for league administrators to manage all aspects of their sports league. It consists of five main tabs:

1. **League Rules** - Configure league-wide policies and rules
2. **Teams Management** - Manage all teams, view members, and control team status
3. **Players Management** - Manage individual players, roles, and permissions
4. **Analytics** - View league statistics, growth trends, and engagement metrics
5. **Reports** - Generate and download detailed reports

## File Structure

```
src/components/admin/
├── AdminTabs.tsx                    # Main container component
├── FilterBar.tsx                    # Reusable search and filter component
├── DataTable.tsx                    # Reusable table component
├── Modal.tsx                        # Reusable modal component
├── StatusBadge.tsx                  # Status indicator component
└── admin-tabs/
    ├── LeagueRulesTab.tsx          # League rules configuration
    ├── TeamsManagementTab.tsx       # Teams management interface
    ├── PlayersManagementTab.tsx     # Players management interface
    ├── AnalyticsTab.tsx            # Analytics and charts
    └── ReportsTab.tsx              # Reports generation and viewing
```

## Components Detail

### AdminTabs Component

The main orchestrator component that renders all five tabs using the Radix UI Tabs component.

**Location:** `src/components/admin/AdminTabs.tsx`

**Features:**
- Tab navigation with icons
- Responsive design (hides labels on small screens)
- Lazy component loading

**Usage:**
```tsx
import { AdminTabs } from '@/components/admin/AdminTabs';

<AdminTabs />
```

### LeagueRulesTab

Configuration interface for league-wide rules and policies.

**Location:** `src/components/admin/admin-tabs/LeagueRulesTab.tsx`

**Features:**
- Create and manage league rules
- Enable/disable individual rules
- Delete rules
- Rule state management with React hooks

**Sample Rules:**
- Max Players per Team (default: 20)
- Min Players for Match (default: 4)
- Captain Transfer Approval
- Team Name Pattern enforcement

### TeamsManagementTab

Manage all teams in the league with filtering and search capabilities.

**Location:** `src/components/admin/admin-tabs/TeamsManagementTab.tsx`

**Features:**
- Search teams by name
- Filter by sport and status
- View team details (members count, division, creation date)
- Edit and delete teams
- Status indicators (active/inactive)
- Teams table with action dropdown menu

**Filter Options:**
- Sport: Basketball, Football, Volleyball
- Status: Active, Inactive

### PlayersManagementTab

Manage individual players with role assignment and permission control.

**Location:** `src/components/admin/admin-tabs/PlayersManagementTab.tsx`

**Features:**
- Search players by name or email
- Filter by role and status
- View player profiles with avatars
- Reset password functionality
- Change player roles
- Role indicators with icons (Admin, Captain)

**Filter Options:**
- Role: Player, Captain, Admin
- Status: Active, Inactive

### AnalyticsTab

Dashboard with key metrics and visualizations.

**Location:** `src/components/admin/admin-tabs/AnalyticsTab.tsx`

**Visualizations:**
1. **Top Stats Cards** - Display key metrics (Total Players, Active Teams, Matches, Attendance)
2. **Growth Chart** - Line chart showing player and team growth over 6 months
3. **Sport Distribution** - Pie chart showing distribution across different sports
4. **Weekly Engagement** - Bar chart showing matches and practices by day of week

**Libraries Used:**
- Recharts for data visualization

### ReportsTab

Generate and manage league reports.

**Location:** `src/components/admin/admin-tabs/ReportsTab.tsx`

**Features:**
- View previously generated reports
- Download reports in PDF/XLSX formats
- View report details (type, period, generation date)
- Generate new reports from templates
- Report types: Season Summary, Financial, Attendance, Team Performance

## Shared Components

### FilterBar Component

Reusable search and filter component used across management tabs.

**Location:** `src/components/admin/FilterBar.tsx`

**Props:**
```tsx
interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}
```

**Usage:**
```tsx
<FilterBar
  searchPlaceholder="Search teams..."
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  filters={[
    {
      label: 'Sport',
      options: sportOptions,
      value: sportFilter,
      onChange: setSportFilter,
    },
  ]}
/>
```

### StatusBadge Component

Display status with color coding.

**Location:** `src/components/admin/StatusBadge.tsx`

### DataTable Component

Reusable table component for displaying data.

**Location:** `src/components/admin/DataTable.tsx`

### Modal Component

Reusable modal for confirmations and dialogs.

**Location:** `src/components/admin/Modal.tsx`

## Integration with App

To integrate the AdminDashboard into your main app, add it to your routing:

**In `App.tsx`:**
```tsx
import AdminDashboard from '@/components/AdminDashboard';

// Add to your routing
<Route path="/admin" element={<AdminDashboard />} />
```

**In navigation:**
```tsx
<Link to="/admin">Admin Dashboard</Link>
```

## Features Overview

### Data Management
- View and manage all entities (teams, players, rules)
- Create, read, update, delete operations
- Real-time filtering and search
- Batch operations support

### User Interface
- Consistent design across all tabs
- Responsive layout for mobile and desktop
- Loading states and error handling
- Confirmation dialogs for destructive actions

### Analytics
- Growth tracking over time
- Distribution analysis
- Engagement metrics
- Trend visualization

### Reports
- Multiple report formats (PDF, XLSX)
- Historical report access
- Custom report generation
- Scheduled report generation support

## Sample Data

All tabs include sample data for demonstration:

**Teams Sample:**
- Thunder Hawks (Basketball, Division A)
- Desert Foxes (Football, Division B)
- Ocean Waves (Volleyball, Division A)
- Mountain Kings (Basketball, Division C)

**Players Sample:**
- John Smith (Thunder Hawks, Captain)
- Sarah Johnson (Desert Foxes, Player)
- Mike Davis (Thunder Hawks, Player)
- Emma Wilson (Mountain Kings, Captain)

**Engagement Data:**
- Weekly match and practice schedule
- Attendance tracking
- Performance metrics

## Styling

The components use Tailwind CSS for styling with these color schemes:
- Primary: Blue (`#3b82f6`)
- Success: Green (`#10b981`)
- Warning: Amber (`#f59e0b`)
- Error: Red (`#ef4444`)
- Neutral: Gray (`#6b7280`)

## State Management

Currently uses React's built-in `useState` hook for state management. For production:
- Consider moving to Redux or Context API for complex state
- Implement API integration for data fetching
- Add error boundaries and error handling

## Future Enhancements

1. **Backend Integration**
   - Connect to actual API endpoints
   - Real-time data updates
   - WebSocket support for live notifications

2. **Advanced Features**
   - Bulk import/export
   - Custom report builder
   - Email notifications
   - Role-based access control (RBAC)

3. **Performance**
   - Virtual scrolling for large lists
   - Pagination for tables
   - Memoization for expensive computations

4. **Analytics**
   - Custom date range selection
   - Export analytics data
   - Advanced filtering and drill-down

## Testing

To test the components:

1. **Unit Tests** - Test individual components with sample props
2. **Integration Tests** - Test interaction between components
3. **E2E Tests** - Test complete user workflows

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

- Initial Load: < 2s
- Search Response: < 100ms
- Chart Render: < 500ms
- Filter Operations: < 50ms

---

**Version:** 1.0.0  
**Last Updated:** 2024
