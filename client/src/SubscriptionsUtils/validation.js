// Validation utility functions

export const validateSubscription = (form) => {
  const errors = {};

  if (!form.name || form.name.trim() === "") {
    errors.name = "Subscription name is required";
  }

  if (!form.billingCycle || form.billingCycle === "") {
    errors.billingCycle = "Billing cycle is required";
  }

  if (!form.cost || form.cost === "" || Number(form.cost) <= 0) {
    errors.cost = "Valid cost is required";
  }

  if (!form.dueDate || form.dueDate === "") {
    errors.dueDate = "Due date is required";
  } else {
    const dueDate = new Date(form.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      errors.dueDate = "Due date cannot be in the past";
    }
  }

  // Owner is required
  if (!form.owner || !form.owner.email) {
    errors.owner = "Owner is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAsset = (form) => {
  const errors = {};

  if (!form.name || form.name.trim() === "") {
    errors.name = "Asset name is required";
  }

  if (!form.type || form.type.trim() === "") {
    errors.type = "Asset type is required";
  }

  if (form.warrantyEnd) {
    const warrantyEnd = new Date(form.warrantyEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (warrantyEnd < today) {
      errors.warrantyEnd = "Warranty end date cannot be in the past";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRenewal = (form) => {
  const errors = {};

  if (!form.newCost || form.newCost === "" || Number(form.newCost) <= 0) {
    errors.newCost = "Valid cost is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateWarrantyExtension = (form) => {
  const errors = {};

  if (!form.months || form.months === "" || Number(form.months) <= 0) {
    errors.months = "Valid number of months is required";
  }

  if (form.cost && Number(form.cost) < 0) {
    errors.cost = "Cost cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

