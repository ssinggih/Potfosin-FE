import { z } from 'zod'

export const emailSchema = z.string().min(1, 'Email wajib diisi').email('Format email tidak valid')

export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .max(100, 'Password maksimal 100 karakter')

export const phoneSchema = z
  .string()
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Format nomor telepon tidak valid')
  .optional()
