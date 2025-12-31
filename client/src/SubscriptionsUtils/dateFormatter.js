// Format date to: "Tue Dec 29 2026 05:30:00 GMT+0530 (India Standard Time)"
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    // Return the full date string as requested
    return date.toString();
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

