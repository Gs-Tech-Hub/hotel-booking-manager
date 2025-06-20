# Hotel Booking Admin  @Version 2 Web.  

## MV2Web: Fix department totals calculation
- **Consistent Quantity Reporting:**  
  Updated the reporting logic to ensure that the `quantity` field for all department items is always stored and processed as a number, not an array of objects. This change simplifies calculations, improves consistency across all departments, and reduces the risk of errors in reporting and analytics.

  - Previous: `quantity` could be an array of objects (with `product_count`).
  - Now: `quantity` is always a number (sum of all `product_count` values).

  - **Location of Change:**  
  The main logic was updated in  
  `src/utils/ReportHelpers/reportHelpers/calculateDepartmentTotals.ts`  
  (see the section after merging product counts and before grouping by name, where all `quantity` values are normalized to numbers). 
  Line `50 - 54`

