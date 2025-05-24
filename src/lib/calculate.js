import { formatCurrency } from "./formatCurrency";

function calculateAmounts(invoice) {
  // Calculate item totals
  invoice.items.forEach((item) => {
    item.total = item.quantity * item.rate - (item.discount || 0);
  });

  // Calculate subtotal
  invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);

  // Safely handle deductions
  let deductedSubtotal = invoice.subtotal;
  if (Array.isArray(invoice.deductions)) {
    invoice.deductions.forEach((deduction) => {
      if (deduction.percent) {
        deduction.amount = (deductedSubtotal * deduction.percent) / 100;
      } else {
        deduction.amount = parseFloat(deduction.amount);
      }
    });
  } else {
    invoice.deductions = [];
  }

  const totalDeductions = invoice.deductions.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );
  deductedSubtotal -= totalDeductions;

  // Safely handle additions
  if (Array.isArray(invoice.additions)) {
    invoice.additions.forEach((addition) => {
      if (addition.percent) {
        addition.amount = (deductedSubtotal * addition.percent) / 100;
      } else {
        addition.amount = parseFloat(addition.amount);
      }
    });
  } else {
    invoice.additions = [];
  }
}

export function calculateInvoice(invoice) {
  // Ensure items array exists
  invoice.items = Array.isArray(invoice.items) ? invoice.items : [];

  // Calculate subtotal
  let subtotal = invoice.items.reduce(
    (sum, item) => sum + (item.quantity * item.rate - (item.discount || 0)),
    0
  );
  invoice.subtotal = subtotal;

  // Calculate amounts for deductions/additions
  calculateAmounts(invoice);

  // Calculate deductions
  let totalDeductions = invoice.deductions.reduce(
    (sum, deduction) => sum + (deduction.amount || 0),
    0
  );

  // Calculate additions
  let totalAdditions = invoice.additions.reduce(
    (sum, addition) => sum + (addition.amount || 0),
    0
  );

  // Final total
  let totalAmount = subtotal + totalAdditions - totalDeductions;

  return {
    ...invoice,
    subtotal: subtotal,
    totalAmount: totalAmount,
    amountDue: formatCurrency(totalAmount, invoice.currency),
  };
}
