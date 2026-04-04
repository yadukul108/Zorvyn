import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const userCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    profile: z.object({
      avatar: z.string().url().optional(),
      phone: z.string().optional(),
      department: z.string().optional()
    }).optional()
  })
});

export const userUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    profile: z.object({
      avatar: z.string().url().optional(),
      phone: z.string().optional(),
      department: z.string().optional()
    }).optional()
  })
});

export const roleCreateSchema = z.object({
  body: z.object({
    name: z.enum(['Viewer', 'Analyst', 'Admin']),
    description: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    isActive: z.boolean().optional()
  })
});

export const transactionCreateSchema = z.object({
  body: z.object({
    amount: z.number().gt(0),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1),
    subcategory: z.string().optional(),
    date: z.preprocess((value) => (value ? new Date(value) : new Date()), z.date()),
    description: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other']).optional(),
    isRecurring: z.boolean().optional(),
    recurringFrequency: z.string().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional(),
    attachments: z.array(z.object({ filename: z.string(), url: z.string().url(), uploadedAt: z.preprocess((value) => (value ? new Date(value) : new Date()), z.date()) })).optional()
  })
});

export const transactionUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    amount: z.number().gt(0).optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().min(1).optional(),
    subcategory: z.string().optional(),
    date: z.preprocess((value) => (value ? new Date(value) : undefined), z.date().optional()),
    description: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other']).optional(),
    isRecurring: z.boolean().optional(),
    recurringFrequency: z.string().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional(),
    attachments: z.array(z.object({ filename: z.string(), url: z.string().url(), uploadedAt: z.preprocess((value) => (value ? new Date(value) : new Date()), z.date()) })).optional()
  }).partial()
});

export const transactionQuerySchema = z.object({
  query: z.object({
    page: z.preprocess((value) => (value ? Number(value) : 1), z.number().int().positive()).optional(),
    limit: z.preprocess((value) => (value ? Number(value) : 20), z.number().int().positive()).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(['income', 'expense']).optional()
  })
});

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const dashboardSummarySchema = z.object({
  query: z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
  })
});

export const categoryAggregationSchema = z.object({
  query: z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
  })
});

export const monthlyTrendsSchema = z.object({
  params: z.object({
    year: z.preprocess((value) => (value ? Number(value) : new Date().getFullYear()), z.number().int().min(2000).max(2100)).optional()
  })
});