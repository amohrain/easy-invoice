import { z } from "zod";

const ItemSchema = z.array(
  z.object({
    description: z.string().min(1),
    quantity: z.number().nonnegative(),
    rate: z.number().nonnegative(),
  })
);

const AdjustmentSchema = z
  .array(
    z.object({
      description: z.string().min(1),
      amount: z.number().optional(),
      percent: z.number().optional(),
    })
  )
  .optional()
  .or(z.literal(null));

export const InvoicePayloadSchema = z.object({
  items: ItemSchema,
  additions: AdjustmentSchema,
  deductions: AdjustmentSchema,
});
