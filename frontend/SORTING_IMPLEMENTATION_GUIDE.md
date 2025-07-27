# Frontend Sorting Implementation Guide

## Overview
This guide documents the complete implementation of sorting functionality across all internship and application-related pages in the Fursa frontend application. All sorting follows the unified API format: `?sort=field:direction`.

## Implemented Sorting Functionality

### 1. AllInternshipsPage.js ✅ COMPLETED
**Location**: `src/pages/internship/AllInternshipsPage.js`
**API Endpoint**: `GET /internships?sort=field:direction`

#### Features Implemented:
- ✅ Sorting state management (`sortBy` state)
- ✅ Server-side sorting via API query parameters
- ✅ Sorting dropdown UI in the search/filter section
- ✅ Reset pagination on sort change
- ✅ Role-aware sorting options

#### Student Sorting Options:
- `createdAt:desc` - Newest First
- `createdAt:asc` - Oldest First
- `title:asc` - Title A-Z
- `title:desc` - Title Z-A
- `applicationDeadline:asc` - Deadline (Soon First)
- `applicationDeadline:desc` - Deadline (Latest First)
- `companyName:asc` - Company A-Z
- `companyName:desc` - Company Z-A

#### Company Sorting Options (viewing their own internships):
- `createdAt:desc` - Newest First
- `createdAt:asc` - Oldest First
- `title:asc` - Title A-Z
- `title:desc` - Title Z-A
- `applicationDeadline:asc` - Deadline (Soon First)
- `applicationDeadline:desc` - Deadline (Latest First)

### 2. InternshipApplicantsPage.js ✅ COMPLETED
**Location**: `src/pages/internship/InternshipApplicantsPage.js`
**API Endpoint**: `GET /internships/:id/applications?sort=field:direction`

#### Features Implemented:
- ✅ Sorting state management (`sortBy` state)
- ✅ Server-side sorting via API query parameters
- ✅ Sorting dropdown UI alongside status filter
- ✅ Reset pagination on sort change
- ✅ Company-specific sorting options

#### Company Sorting Options (viewing applicants for specific internship):
- `appliedAt:desc` - Newest Applications First
- `appliedAt:asc` - Oldest Applications First
- `status:asc` - Status (Pending → Rejected)
- `status:desc` - Status (Rejected → Pending)
- `studentName:asc` - Student Name A-Z
- `studentName:desc` - Student Name Z-A
- `university:asc` - University A-Z
- `university:desc` - University Z-A

### 3. CompanyInternshipStatusPage.js ✅ COMPLETED
**Location**: `src/pages/company/CompanyInternshipStatusPage.js`
**API Endpoint**: `GET /applications?sort=field:direction`

#### Features Implemented:
- ✅ Updated existing sorting to use proper API format
- ✅ Sorting dropdown UI in the control panel
- ✅ Reset pagination on sort change
- ✅ Company-specific sorting options

#### Company Sorting Options (viewing all received applications):
- `appliedAt:desc` - Newest Applications First
- `appliedAt:asc` - Oldest Applications First  
- `status:asc` - Status (Pending → Rejected)
- `status:desc` - Status (Rejected → Pending)
- `studentName:asc` - Student Name A-Z
- `studentName:desc` - Student Name Z-A
- `university:asc` - University A-Z
- `university:desc` - University Z-A

### 4. Student StatusPage.js ✅ COMPLETED
**Location**: `src/pages/student/StatusPage.js`
**API Endpoint**: `GET /applications?sort=field:direction`

#### Features Implemented:
- ✅ Sorting state management (`sortBy` state)
- ✅ Server-side sorting via API query parameters
- ✅ Sorting dropdown UI above status tabs
- ✅ Reset pagination on sort change
- ✅ Student-specific sorting options

#### Student Sorting Options (viewing their applications):
- `appliedAt:desc` - Newest Applications First
- `appliedAt:asc` - Oldest Applications First
- `status:asc` - Status (Pending → Rejected)
- `status:desc` - Status (Rejected → Pending)
- `companyName:asc` - Company Name A-Z
- `companyName:desc` - Company Name Z-A
- `internshipTitle:asc` - Internship Title A-Z
- `deadline:asc` - Deadline (Soon First)

## Technical Implementation Details

### State Management Pattern
All components follow the same state management pattern:
```javascript
const [sortBy, setSortBy] = useState('defaultValue:desc');

const handleSortChange = (newSort) => {
  setSortBy(newSort);
  setCurrentPage(1); // Reset to first page
};
```

### API Integration Pattern
All fetch functions follow the same API integration pattern:
```javascript
const fetchData = useCallback(async (page = 1, status = null, sort = 'default:desc') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    sort: sort,
  });
  
  // Add other filters as needed
  if (status && status !== 'all') {
    params.append('status', status);
  }
  
  const url = `${config.API_URL}/endpoint?${params}`;
  // ... rest of fetch logic
}, [dependencies]);
```

### UI Component Pattern
All sorting dropdowns follow the same UI pattern:
```javascript
<Select
  value={sortBy}
  onChange={(e) => handleSortChange(e.target.value)}
  // styling props
>
  <option value="field:desc">Newest First</option>
  <option value="field:asc">Oldest First</option>
  // ... other options
</Select>
```

## Default Sorting Behavior

### Internships Endpoint (`/internships`)
- **Default**: `createdAt:desc` (newest internships first)
- **Applies to**: AllInternshipsPage.js

### Applications Endpoint (`/applications`)
- **Default**: `appliedAt:desc` (newest applications first)  
- **Applies to**: CompanyInternshipStatusPage.js, Student StatusPage.js

### Internship Applications Endpoint (`/internships/:id/applications`)
- **Default**: `appliedAt:desc` (newest applications first)
- **Applies to**: InternshipApplicantsPage.js

## API Usage Examples

### Combined Parameters
Sorting can be combined with other query parameters:

```javascript
// Internships with status filter and sorting
GET /internships?status=open&sort=deadline:asc&page=1&limit=10

// Applications with status filter and sorting  
GET /applications?status=PENDING&sort=appliedAt:desc&page=2&limit=5

// Specific internship applicants with sorting
GET /internships/123/applications?sort=studentName:asc&page=1&limit=10
```

### Role-Aware Behavior
The same endpoints return different data based on user role:

#### `/internships` endpoint:
- **Students**: All public internships from all companies
- **Companies**: Only their own internships

#### `/applications` endpoint:
- **Students**: Only their own applications
- **Companies**: All applications to their internships

## Testing Checklist

### Functional Testing
- [ ] Sorting dropdown shows correct options for each user role
- [ ] Sorting persists across pagination
- [ ] Sorting resets pagination to page 1
- [ ] Sorting works with status filters
- [ ] Default sorting is applied on page load
- [ ] API calls include correct sort parameter

### UI/UX Testing
- [ ] Sorting dropdown is accessible and styled consistently
- [ ] Loading states work correctly during sort changes
- [ ] Sort options are clearly labeled and intuitive
- [ ] Sorting dropdown placement is logical in the UI flow

### Cross-Component Testing
- [ ] Same sorting options work consistently across similar pages
- [ ] Role-aware sorting shows appropriate options
- [ ] Navigation between pages preserves expected behavior

## Future Enhancements

### Potential Improvements
1. **Sort Direction Indicators**: Add ↑↓ arrows to show current sort direction
2. **Multi-field Sorting**: Allow secondary sort criteria
3. **Custom Sort Orders**: Let users save preferred sort orders
4. **Sort History**: Remember last used sort per page
5. **Advanced Filtering**: Combine sorting with more complex filters

### Performance Considerations
1. **Debounced Sorting**: Add debouncing for rapid sort changes
2. **Client-side Caching**: Cache sorted results for faster switching
3. **Lazy Loading**: Implement virtual scrolling for large datasets
4. **Index Optimization**: Ensure backend has proper database indexes

## Troubleshooting

### Common Issues
1. **Sort not applied**: Check if API endpoint supports the sort parameter
2. **Pagination broken**: Ensure `setCurrentPage(1)` is called on sort change
3. **Wrong options shown**: Verify role-based conditions in option rendering
4. **API errors**: Check sort field names match backend expectations

### Debug Tips
1. Check browser console for API request URLs
2. Verify sort parameter format: `field:direction`
3. Ensure useEffect dependencies include `sortBy`
4. Check that fetch functions accept sort parameter

## Conclusion

The sorting functionality has been successfully implemented across all major internship and application pages, providing a consistent and intuitive user experience. The implementation follows React best practices and integrates seamlessly with the existing pagination and filtering systems.

All components now support server-side sorting with proper state management, API integration, and user-friendly interfaces that adapt to different user roles and contexts.
