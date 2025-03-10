export interface Seller {
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  photo?: string;
  storeDetails?: {
    name: string;
    address: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Reseller {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  photo?: string;
  storeDetails?: {
    storeName: string;
    description: string;
    category: string;
    openingTime: string;
    closingTime: string;
    storeAddress: {
      street: string;
      landmark: string;
      city: string;
      state: string;
      pinCode: string;
    };
  };
  isActive: boolean;
  createdAt: string;
}