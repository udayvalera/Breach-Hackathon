import React from 'react';
import { AlertCircle } from 'lucide-react';
import { bureauStatus } from '../../data/mockData';

export default function Footer() {
  const allOnline = bureauStatus.every(bureau => bureau.status === 'Online');

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0">
        <div className="flex items-center">
          {allOnline ? (
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></span>
              All Bureaus Online
            </span>
          ) : (
            <span className="text-orange-500 dark:text-orange-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {bureauStatus.find(b => b.status === 'Offline')?.name} Offline
            </span>
          )}
        </div>

        <div className="text-gray-600 dark:text-gray-400 order-first sm:order-none">
          © 2025 xAI Hackathon Team
        </div>

        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Terms of Use</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200">Contact Us</a>
          <span>{new Date().toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>
    </footer>
  );
}