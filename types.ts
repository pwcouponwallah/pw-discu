
export type LeadMethod = 'coupon_request' | 'assisted_sale';

export type LeadStatus = 'New' | 'Contacted' | 'OTP_Sent' | 'Payment_Pending' | 'Converted' | 'Closed';

export interface Lead {
  id: string;
  studentId?: string;
  name: string;
  email?: string;
  mobile: string;
  category: string;
  class: string;
  batch: string;
  method: LeadMethod;
  status: LeadStatus;
  createdAt: number;
  notes?: string;
}

export interface AppSettings {
  activeCoupon: string;
  whatsappNumber: string;
  ambassadorName: string;
}

export type UserRole = 'admin' | 'student';

export interface User {
  uid: string;
  email: string | null;
  role: UserRole;
  name?: string;
}
