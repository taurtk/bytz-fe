import React, { useState } from 'react';
import { CartItem, Order, OrderItem } from '../types';
import { X, Plus, Minus, Trash2, ShoppingBag, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BASE_URL = 'https://bytz-be-qgnonfue2q-ew.a.run.app/';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  total: number;
  restaurantId: string;
  table: string;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  total,
  restaurantId,
  table
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [lastOrderItemCount, setLastOrderItemCount] = useState(0);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);

  if (!isOpen) return null;

  // Convert cart items to order items
  const createOrderItems = (): OrderItem[] => {
    return cartItems.map(cartItem => ({
      itemId: cartItem.id,
      name: cartItem.name,
      quantity: cartItem.quantity,
      price: cartItem.price,
    }));
  };

  // Create order object
  const createOrder = (): Order => {
    return {
      restaurantId,
      table,
      items: createOrderItems(),
      total
    };
  };

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    setOrderError(false);

    const order = createOrder();
    setCurrentOrder(order);
    setLastOrderItemCount(order.items.length);
    setLastOrderTotal(order.total);

    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });
      if (!response.ok) throw new Error('Order failed');
      const data = await response.json();
      setOrderId(data.orderId || '');
      setIsOrdering(false);
      setOrderPlaced(true);
      // Log order for debugging (remove in production)
      console.log('Order placed successfully:', {
        orderId: data.orderId,
        order: order,
        orderItems: order.items
      });
      setTimeout(() => {
        onClearCart();
        setOrderPlaced(false);
        setOrderId('');
        setCurrentOrder(null);
        onClose();
      }, 4000);
    } catch (error) {
      console.error('Order failed:', error);
      setIsOrdering(false);
      setOrderError(true);
      setTimeout(() => {
        setOrderError(false);
      }, 3000);
    }
  };

  const handleRetryOrder = () => {
    setOrderError(false);
    handlePlaceOrder();
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-3 text-sm">Your order has been sent to the kitchen.</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-700">Order ID: #{orderId}</p>
            <p className="text-xs text-gray-500 mt-1">Table {table} • {restaurantId}</p>
            <p className="text-xs text-gray-500 mt-1"> ${lastOrderTotal.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Estimated time: 15-20 minutes</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>Your Order</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <p className="text-gray-400 text-xs mt-1">Add some delicious items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                    <p className="text-black font-bold text-sm">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded-full transition-colors ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {/* Order Summary - Simplified without tax */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-black">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Message */}
            {orderError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-medium">Order failed</p>
                  <p className="text-red-600 text-xs">Please try again or contact staff</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {orderError ? (
                <>
                  <button
                    onClick={handleRetryOrder}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
                  >
                    Retry Order
                  </button>
                  <button
                    onClick={() => setOrderError(false)}
                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm transform hover:scale-105 disabled:transform-none"
                >
                  {isOrdering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Clear Cart */}
            <button
              onClick={onClearCart}
              className="w-full text-gray-500 hover:text-red-500 text-sm py-2 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
