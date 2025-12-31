export const getWarrantyStatus = (warrantyEnd) => {
  if (!warrantyEnd) {
    return { label: "No Warranty", color: "gray", priority: 5 };
  }

  const today = new Date();
  const end = new Date(warrantyEnd);
  const daysLeft = Math.ceil((end - today) / 86400000);

  if (daysLeft <= 0) {
    return { label: "Expired", color: "red", daysLeft, priority: 1 };
  }
  if (daysLeft <= 30) {
    return { label: "Expiring Soon", color: "orange", daysLeft, priority: 2 };
  }
  if (daysLeft <= 90) {
    return { label: "Upcoming", color: "yellow", daysLeft, priority: 3 };
  }
  return { label: "Valid", color: "green", daysLeft, priority: 4 };
};

