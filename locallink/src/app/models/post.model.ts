export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  zip: string;
  createdAt: Date;
  isFeatured?: boolean;
  imageUrl?: string;
  lat?: number;
  lng?: number;
  distance?: number; 
   user?: {
    id: string;
    name: string;
  };
  contact?: string;
}
