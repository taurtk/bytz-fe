import { useState, useCallback } from 'react';
import { Order, OrderItem } from '../types';
import { OrderService, orderHelpers } from '../services/orderService';

export const useOrder = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  /**
   * Place an order
   * @param order - Order object to place
   * @returns Promise with order result
   */
  const placeOrder = useCallback(async (order: Order): Promise<{ success: boolean; orderId?: string }> => {
    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Validate order before sending
      const validation = orderHelpers.validateOrder(order);
      if (!validation.isValid) {
        throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
      }

      // Log order for debugging
      console.log('Placing order:', order);

      // Place order via service
      const result = await OrderService.placeOrder(order);
      
      setLastOrderId(result.orderId);
      setIsPlacingOrder(false);
      
      return { success: true, orderId: result.orderId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      setOrderError(errorMessage);
      setIsPlacingOrder(false);
      
      console.error('Order placement failed:', error);
      return { success: false };
    }
  }, []);

  /**
   * Get order status
   * @param orderId - Order ID to check
   */
  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      return await OrderService.getOrderStatus(orderId);
    } catch (error) {
      console.error('Failed to get order status:', error);
      return null;
    }
  }, []);

  /**
   * Clear order error
   */
  const clearOrderError = useCallback(() => {
    setOrderError(null);
  }, []);

  return {
    isPlacingOrder,
    orderError,
    lastOrderId,
    placeOrder,
    getOrderStatus,
    clearOrderError
  };
};