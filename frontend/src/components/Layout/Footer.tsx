import React from "react";
import { AlertCircle } from "lucide-react";
import { bureauStatus } from "../../data/mockData";
import { Alert, AlertDescription } from "../../components/ui/alert"; // shadcn/ui Alert
import { Button } from "../../components/ui/button"; // shadcn/ui Button

export default function Footer() {
  const allOnline = bureauStatus.every((bureau) => bureau.status === "Online");
  const offlineBureau = bureauStatus.find((b) => b.status === "Offline");

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        {/* Bureau Status
        <div className="flex items-center">
          {allOnline ? (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1 px-3">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <AlertDescription>All Bureaus Online</AlertDescription>
              </div>
            </Alert>
          ) : (
            <Alert
              variant="destructive"
              className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 py-1 px-3"
            >
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {offlineBureau?.name} Offline
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div> */}

        {/* Copyright */}
        <div className="text-gray-500 dark:text-gray-400 font-medium">
          © 2025 xAI Hackathon Team
        </div>

        {/* Links and Date */}
        <div className="flex items-center space-x-4">
          <Button
            variant="link"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
            asChild
          >
            <a href="#">Terms of Use</a>
          </Button>
          <Button
            variant="link"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
            asChild
          >
            <a href="#">Contact Us</a>
          </Button>
          <span className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </footer>
  );
}