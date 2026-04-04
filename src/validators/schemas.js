import Joi from 'joi';
import { z } from 'zod';

const idParam = Joi.object({
  id: Joi.string().min(1).required()
});

const statusEnum = ['active', 'inactive', 'suspended'];
const transactionTypeEnum = ['income', 'expense'];
const paymentMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other'];
const transactionStatusEnum = ['pending', 'completed', 'cancelled'];

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().optional()
  }).required()
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }).required()
});

export const userCreateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().optional(),
    status: Joi.string().valid(...statusEnum).optional(),
    profile: Joi.object({
      avatar: Joi.string().uri().optional(),
      phone: Joi.string().optional(),
      department: Joi.string().optional()
    }).optional()
  }).required()
});

export const userUpdateSchema = Joi.object({
  params: idParam.required(),
  body: Joi.object({
    name: Joi.string().min(1).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().optional(),
    status: Joi.string().valid(...statusEnum).optional(),
    profile: Joi.object({
      avatar: Joi.string().uri().optional(),
      phone: Joi.string().optional(),
      department: Joi.string().optional()
    }).optional()
  }).required()
});

export const roleCreateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().valid('Viewer', 'Analyst', 'Admin').required(),
    description: Joi.string().optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional()
  }).required()
});

const attachmentSchema = Joi.object({
  filename: Joi.string().required(),
  url: Joi.string().uri().required(),
  uploadedAt: Joi.date().iso().optional()
});

export const transactionCreateSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().greater(0).required(),
    type: Joi.string().valid(...transactionTypeEnum).required(),
    category: Joi.string().min(1).required(),
    subcategory: Joi.string().optional(),
    date: Joi.date().iso().default(() => new Date()),
    description: Joi.string().optional(),
    notes: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    paymentMethod: Joi.string().valid(...paymentMethods).optional(),
    isRecurring: Joi.boolean().optional(),
    recurringFrequency: Joi.string().optional(),
    status: Joi.string().valid(...transactionStatusEnum).optional(),
    attachments: Joi.array().items(attachmentSchema).optional()
  }).required()
});

export const transactionUpdateSchema = Joi.object({
  params: idParam.required(),
  body: Joi.object({
    amount: Joi.number().greater(0).optional(),
    type: Joi.string().valid(...transactionTypeEnum).optional(),
    category: Joi.string().min(1).optional(),
    subcategory: Joi.string().optional(),
    date: Joi.date().iso().optional(),
    description: Joi.string().optional(),
    notes: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    paymentMethod: Joi.string().valid(...paymentMethods).optional(),
    isRecurring: Joi.boolean().optional(),
    recurringFrequency: Joi.string().optional(),
    status: Joi.string().valid(...transactionStatusEnum).optional(),
    attachments: Joi.array().items(attachmentSchema).optional()
  }).required()
});

export const transactionQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().positive().default(1).optional(),
    limit: Joi.number().integer().positive().default(20).optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().optional(),
    category: Joi.string().optional(),
    type: Joi.string().valid(...transactionTypeEnum).optional()
  }).required()
});

export const transactionIdSchema = Joi.object({
  params: idParam.required()
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