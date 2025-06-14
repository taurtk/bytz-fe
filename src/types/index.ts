export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface Order {
  restaurantId: string;
  table: string;
  items: OrderItem[];
  total: number;
}

// Additional types for backend integration
export interface OrderResponse {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: number;
  message?: string;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistory {
  orders: (Order & { orderId: string; status: string; createdAt: string })[];
  total: number;
  page: number;
  limit: number;
}