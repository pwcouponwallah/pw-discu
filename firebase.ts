
import { Lead, AppSettings, LeadStatus, User, UserRole } from './types';

// NOTE: To use real Firebase, uncomment the following and add your config:
/*
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth_real = getAuth(app);
export const db_real = getFirestore(app);
*/

class MockDB {
  private leads: Lead[] = [
    {
      id: 'L001',
      name: 'Aryan Singh',
      email: 'aryan@student.com',
      mobile: '9876543210',
      category: 'JEE (Main + Advanced)',
      class: 'Class 12',
      batch: 'Lakshya JEE 2026',
      method: 'coupon_request',
      status: 'New',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'L002',
      studentId: 'student123',
      name: 'Sneha Gupta',
      mobile: '9988776655',
      category: 'NEET (UG)',
      class: 'Dropper',
      batch: 'Prayas NEET 2026',
      method: 'assisted_sale',
      status: 'OTP_Sent',
      createdAt: Date.now() - 86400000,
    }
  ];

  private settings: AppSettings = {
    activeCoupon: 'YUGNA00001',
    whatsappNumber: '919000000000',
    ambassadorName: 'Yugal (Official Ambassador)'
  };

  async getLeads(): Promise<Lead[]> {
    return [...this.leads].sort((a, b) => b.createdAt - a.createdAt);
  }

  async getStudentLeads(studentId: string): Promise<Lead[]> {
    return this.leads.filter(l => l.studentId === studentId);
  }

  async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const newLead: Lead = {
      ...lead,
      id: 'L' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      createdAt: Date.now(),
      status: 'New'
    };
    this.leads.push(newLead);
    return newLead.id;
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    this.leads = this.leads.map(l => l.id === id ? { ...l, status } : l);
  }

  async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    this.settings = { ...settings };
  }
}

export const db = new MockDB();

export const auth = {
  currentUser: JSON.parse(localStorage.getItem('pw_portal_user') || 'null') as User | null,
  
  signIn: async (email: string, pass: string): Promise<User> => {
    let user: User;
    if (email === 'admin' && pass === 'password') {
      user = { uid: 'admin_001', email: 'admin@pw.live', role: 'admin', name: 'Master Ambassador' };
    } else {
      user = { uid: 'student_' + Math.random().toString(36).substr(2, 5), email: email, role: 'student', name: email.split('@')[0] };
    }
    localStorage.setItem('pw_portal_user', JSON.stringify(user));
    auth.currentUser = user;
    return user;
  },
  
  signOut: async () => {
    localStorage.removeItem('pw_portal_user');
    auth.currentUser = null;
  }
};
