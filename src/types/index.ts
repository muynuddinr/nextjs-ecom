export interface Seller {
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  storeDetails?: {
    name: string;
    address: string;
  };
  isActive: boolean;
  createdAt: string;
} 