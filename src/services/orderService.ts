import { Order, OrderItem } from '../types';

// Order service for backend integration
export class OrderService {
  private static baseUrl = '/api'; // Replace with your actual API base URL

  /**
   * Place an order
   * @param order - The order object to send to backend
   * @returns Promise with order response
   */
  static async placeOrder(order: Order): Promise<{ orderId: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }

  /**
   * Get order status
   * @param orderId - The order ID to check
   * @returns Promise with order status
   */
  static async getOrderStatus(orderId: string): Promise<{ status: string; estimatedTime?: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to get order status:', error);
      throw error;
    }
  }

  /**
   * Get order history for a table
   * @param restaurantId - Restaurant ID
   * @param table - Table number
   * @returns Promise with order history
   */
  static async getOrderHistory(restaurantId: string, table: string): Promise<Order[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/history?restaurantId=${restaurantId}&table=${table}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to get order history:', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   * @param orderId - The order ID to cancel
   * @returns Promise with cancellation result
   */
  static async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }
}

// Helper functions for order data transformation
export const orderHelpers = {
  /**
   * Convert cart items to order items
   * @param cartItems - Array of cart items
   * @returns Array of order items
   */
  cartToOrderItems: (cartItems: any[]): OrderItem[] => {
    return cartItems.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));
  },

  /**
   * Calculate order total from cart items
   * @param cartItems - Array of cart items
   * @returns Total price
   */
  calculateTotal: (cartItems: any[]): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  /**
   * Validate order before sending
   * @param order - Order object to validate
   * @returns Validation result
   */
  validateOrder: (order: Order): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!order.restaurantId) {
      errors.push('Restaurant ID is required');
    }

    if (!order.table) {
      errors.push('Table number is required');
    }

    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (order.total <= 0) {
      errors.push('Order total must be greater than 0');
    }

    // Validate each order item
    order.items.forEach((item, index) => {
      if (!item.itemId) {
        errors.push(`Item ${index + 1}: Item ID is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};