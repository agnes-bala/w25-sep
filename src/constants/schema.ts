import * as z from 'zod';

export const searchPartnerSchema = z.object({
  searchTerm: z
    .string()
    .min(1, { message: 'Search term is required and must be at least 1 characters!' }),
});

export const checkInPartnerSchema = z
  .object({
    title: z.string().min(1, { message: 'Title is required!' }),
    fullName: z.string().min(1, { message: 'Full name is required!' }),
    occupation: z.string().optional(),
    country: z.string().min(1, { message: 'Country is required!' }),
    state: z.string().optional(),
    district: z.string().optional(),
    addr1: z.string().min(1, { message: 'Address line 1 is required!' }),
    addr2: z.string().optional(),
    isAttended: z.any(),
    city: z.string().optional(),
    pincode: z.coerce.string().optional(),
    paymentMode: z.coerce.string().optional(),
    upiRefNumber: z.string(),
    discount: z.any(),
    extraFemale: z.any(),
    foodDetails: z.any(),
    mobileNumber: z.string().min(1, { message: 'Mobile number is required!' }),
    memberList: z.any(),
    remarks: z.any().optional(),
    under: z.any().optional(),
    maleChild: z.any().optional(),
    femaleChild: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.country === 'India') {
      if (!data.state || data.state.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'State is required!',
          path: ['state'],
        });
      }

      if (!data.district || data.district.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'District is required!',
          path: ['district'],
        });
      }

      // if (!data.pinCode || data.pinCode.trim() === '') {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: 'Pin code is required!',
      //     path: ['pinCode'],
      //   });
      // } else if (!/^\d{6}$/.test(data.pinCode)) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: 'Pin code must be exactly 6 digits!',
      //     path: ['pinCode'],
      //   });
      // }
    }
  }).superRefine((data, ctx) => {
    if (data.paymentMode === 'upi' && (!data.upiRefNumber || data.upiRefNumber.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'UPI reference number is required!',
        path: ['upiRefNumber'],
      });
    }
  }).superRefine((data, ctx) => {
    if (Array.isArray(data.foodDetails) && data.foodDetails.length > 0 && (data.foodDetails[0].food > 0 || data.foodDetails[1].food > 0)) {
      if (!data.paymentMode || data.paymentMode.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Payment mode is required when food is selected!',
          path: ['paymentMode'],
        });
      }
    }
  });


export const addFieldSchema = z.object({
  label: z.string().min(3, { message: 'Label is required!' }),
  key: z.string().min(3, { message: 'Key is required!' }),
  type: z.string().min(3, { message: 'Type is required!' }),
  required: z.boolean(),
  placeholder: z.string().min(3, { message: 'Placeholder is required!' }),
});

export const smsSchema = z.object({
  user_name: z.string().min(1, 'User Name is required'),
  mobile_number: z.string().regex(/^\d{10}$/, 'Mobile Number must be 10 digits').min(1, 'Mobile Number is required'),
  status: z.string().min(1, 'Status is required'),
});

export const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email must be a valid email address').min(1, 'Email is required'),
  role: z.string().min(1, 'Role is required'),
  password: z.any(),
});