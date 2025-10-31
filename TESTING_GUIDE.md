# 🧪 Testing Guide - AI Analyst SaaS

## Sample Queries to Test

Use the provided `sample_data.csv` file and try these queries:

### Basic Queries

```
1. Show total revenue by category (bar chart)
```

```
2. Display sales quantity distribution by product (pie chart)
```

```
3. Show revenue trend over time (line chart)
```

### Advanced Queries

```
1. Show top 5 products by revenue (bar chart)
2. Display regional sales distribution (pie chart)
3. List all electronics products with revenue over 20000 (table)
```

### Multi-Query Example

```
1. Show total revenue by month (bar chart)
2. Display category-wise sales percentage (pie chart)
3. Show top 10 products by sales quantity (table)
4. Display revenue by region (bar chart)
```

## Expected Results

### Query: "Show total revenue by category"
- **Chart Type**: Bar Chart
- **Expected Data**: 
  - Electronics: ~$180,000
  - Clothing: ~$45,000
  - Appliances: ~$50,000
- **Insights**: Should mention Electronics as highest revenue category

### Query: "Display sales quantity distribution by product"
- **Chart Type**: Pie Chart
- **Expected Data**: Distribution across all products
- **Insights**: Should identify top-selling products

### Query: "Show revenue trend over time"
- **Chart Type**: Line Chart
- **Expected Data**: Revenue progression from Jan to Feb 2024
- **Insights**: Should mention any trends or patterns

## Testing Checklist

### ✅ Authentication
- [ ] Can create new account
- [ ] Can login with existing account
- [ ] Can logout
- [ ] Session persists on page refresh
- [ ] Invalid credentials show error

### ✅ File Upload
- [ ] Can upload CSV file
- [ ] Can upload Excel file (.xlsx)
- [ ] Upload progress shows
- [ ] Success message appears
- [ ] File appears in uploaded files list
- [ ] Error handling for invalid files

### ✅ Chatbot
- [ ] Can type and send messages
- [ ] Messages appear in chat
- [ ] Loading indicator shows during processing
- [ ] AI responses appear
- [ ] Error messages display properly
- [ ] Can scroll through chat history
- [ ] Enter key sends message
- [ ] Shift+Enter creates new line

### ✅ Query Processing
- [ ] Single query works
- [ ] Multiple queries work
- [ ] Different chart types work:
  - [ ] Bar chart
  - [ ] Pie chart
  - [ ] Line chart
  - [ ] Table
- [ ] SQL query is generated
- [ ] Insights are generated
- [ ] Charts appear on dashboard

### ✅ Visualizations
- [ ] Charts render correctly
- [ ] Charts are interactive (Plotly features)
- [ ] Chart colors are appropriate
- [ ] Text is readable (white on dark grey)
- [ ] Insights display below charts
- [ ] Multiple charts can coexist
- [ ] Charts are responsive

### ✅ Color Themes
- [ ] Color grid opens
- [ ] Can select different themes
- [ ] Theme applies immediately
- [ ] All 10 themes work
- [ ] Chart backgrounds stay dark grey
- [ ] Text stays white
- [ ] Color grid closes

### ✅ Dashboard Features
- [ ] Save button appears after charts generated
- [ ] Can save dashboard
- [ ] Present button appears after charts generated
- [ ] Presentation mode works
- [ ] Can exit presentation mode
- [ ] Dashboard scrolls when content overflows
- [ ] Grid layout adjusts properly

### ✅ Error Handling
- [ ] No files uploaded - shows error
- [ ] Invalid query format - shows error
- [ ] Network error - shows error
- [ ] API error - shows error
- [ ] File upload error - shows error

## Performance Tests

### Response Times
- [ ] Login: < 2 seconds
- [ ] File upload (1MB): < 5 seconds
- [ ] Query processing: < 10 seconds
- [ ] Chart rendering: < 2 seconds
- [ ] Theme change: < 1 second

### Load Tests
- [ ] Can handle 5+ charts on dashboard
- [ ] Can upload multiple files
- [ ] Can process 10+ queries in sequence
- [ ] UI remains responsive with large datasets

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if on Mac)

## API Tests

### Backend Health Check
```bash
curl http://localhost:8000/api/health/
```
Expected: `{"status": "ok", "message": "AI Analyst API is running"}`

### Analyze Endpoint (requires file uploaded first)
```bash
curl -X POST http://localhost:8000/api/analyze/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show total revenue by category",
    "chart_type": "bar chart",
    "files": ["user_id/sample_data.csv"]
  }'
```

## Common Test Scenarios

### Scenario 1: New User Journey
1. Open app
2. Click "Sign up"
3. Create account
4. Redirected to dashboard
5. Upload sample_data.csv
6. Ask first query
7. View results
8. Change color theme
9. Save dashboard

### Scenario 2: Returning User
1. Open app
2. Login with existing credentials
3. Dashboard loads
4. Previous session restored
5. Upload new file
6. Ask multiple queries
7. Use presentation mode

### Scenario 3: Data Analysis Workflow
1. Login
2. Upload sales data
3. Ask 5 different queries
4. Review all visualizations
5. Customize colors
6. Save dashboard
7. Present to stakeholders

## Bug Reporting Template

If you find issues, document them:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/etc.]
**Console Errors**: [Any errors in browser console]
**Screenshots**: [If applicable]
```

## Success Criteria

The application is working correctly if:
- ✅ All authentication flows work
- ✅ Files upload successfully to Supabase
- ✅ Queries generate SQL via Grok API
- ✅ Charts render with correct data
- ✅ Insights are meaningful
- ✅ Color themes apply properly
- ✅ Save and present features work
- ✅ No console errors
- ✅ UI is responsive and smooth

## Next Steps After Testing

1. Fix any bugs found
2. Optimize slow queries
3. Improve error messages
4. Add more chart types
5. Enhance UI/UX based on feedback
6. Add user tutorials
7. Prepare for production deployment

---

**Happy Testing! 🧪**
