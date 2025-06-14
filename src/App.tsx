import React from 'react';
import { Menu } from './components/Menu';

function App() {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get('restaurantId');
  const table = urlParams.get('table');

  // If no parameters, show demo/landing page
  if (!restaurantId || !table) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📱</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Menu System</h1>
          <p className="text-gray-600 mb-8">
            Scan the QR code on your table to view the menu and place your order.
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Demo Links:</h2>
            <div className="space-y-3">
              <a
                href="?restaurantId=resto1&table=4"
                className="block w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                🍝 Bella Vista - Table 4
              </a>
              <a
                href="?restaurantId=resto2&table=7"
                className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                🥘 Golden Spoon - Table 7
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Menu restaurantId={restaurantId} table={table} />;
}

export default App;