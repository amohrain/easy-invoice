function calculateAmounts(invoice) {
  // Calculate item totals
  invoice.items.forEach((item) => {
    item.total = item.quantity * item.unitPrice - (item.discount || 0);
  });

  // Calculate subtotal
  invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);

  // Apply deductions first
  let deductedSubtotal = invoice.subtotal;
  invoice.deductions.forEach((deduction) => {
    if (deduction.percent) {
      deduction.amount = (deductedSubtotal * deduction.percent) / 100;
    }
  });

  // Subtract deductions from subtotal
  const totalDeductions = invoice.deductions.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );
  deductedSubtotal -= totalDeductions;

  // Apply additions on the reduced subtotal
  invoice.additions.forEach((addition) => {
    if (addition.percent) {
      addition.amount = (deductedSubtotal * addition.percent) / 100;
    }
  });
}

export function calculateInvoice(invoice) {
  // Calculate subtotal
  let subtotal = invoice.items.reduce(
    (sum, item) =>
      sum + (item.quantity * item.unitPrice - (item.discount || 0)),
    0
  );
  invoice.subtotal = subtotal;

  // Calculate additions and deductions amounts
  calculateAmounts(invoice);

  // Calculate deductions
  let totalDeductions = invoice.deductions.reduce(
    (sum, deduction) => sum + deduction.amount,
    0
  );

  // Calculate additions
  let totalAdditions = invoice.additions.reduce(
    (sum, addition) => sum + addition.amount,
    0
  );

  // Calculate total
  let totalAmount = subtotal + totalAdditions - totalDeductions;

  // Update the invoice object
  return {
    ...invoice,
    subtotal: subtotal,
    totalAmount: totalAmount,
  };
}
