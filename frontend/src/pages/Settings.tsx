import React, { useState } from "react";

const Settings: React.FC = () => {
  // State for settings
  const [bureauPrefs, setBureauPrefs] = useState({
    prioritizeEquifax: false,
    prioritizeTransUnion: false,
    prioritizeExperian: false,
    ignoreEquifax: false,
    ignoreTransUnion: false,
    ignoreExperian: false,
  });
  const [discrepancyAlert, setDiscrepancyAlert] = useState(false);
  const [discrepancyThreshold, setDiscrepancyThreshold] = useState(50);
  const [apiKey, setApiKey] = useState("mock-api-key-12345");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  // Handle bureau preference toggles
  const handleBureauToggle = (key: keyof typeof bureauPrefs) => {
    setBureauPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle discrepancy alert toggle and threshold
  const handleDiscrepancyAlert = () => {
    setDiscrepancyAlert(!discrepancyAlert);
  };

  // Simulate saving API key (mocked)
  const saveApiKey = () => {
    // In a real app, this would send to a backend
    alert(`API Key saved: ${apiKey}`);
    setShowApiModal(false);
  };

  // Toggle theme (mocked for demo)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Simulate theme change (would typically update CSS variables or a context)
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Bureau Preferences */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Bureau Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={bureauPrefs.prioritizeEquifax}
                onChange={() => handleBureauToggle("prioritizeEquifax")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Prioritize Equifax</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={bureauPrefs.ignoreEquifax}
                onChange={() => handleBureauToggle("ignoreEquifax")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Ignore Equifax if unavailable</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={bureauPrefs.prioritizeTransUnion}
                onChange={() => handleBureauToggle("prioritizeTransUnion")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Prioritize TransUnion</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={bureauPrefs.ignoreTransUnion}
                onChange={() => handleBureauToggle("ignoreTransUnion")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Ignore TransUnion if unavailable</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={bureauPrefs.prioritizeExperian}
                onChange={() => handleBureauToggle("prioritizeExperian")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Prioritize Experian</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={bureauPrefs.ignoreExperian}
                onChange={() => handleBureauToggle("ignoreExperian")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Ignore Experian if unavailable</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={discrepancyAlert}
            onChange={handleDiscrepancyAlert}
            className="h-4 w-4 text-blue-600"
          />
          <span>Show alerts for score discrepancies</span>
        </label>
        {discrepancyAlert && (
          <div className="mt-4">
            <label className="block mb-2">Discrepancy Threshold</label>
            <input
              type="number"
              value={discrepancyThreshold}
              onChange={(e) => setDiscrepancyThreshold(Number(e.target.value))}
              className="w-24 p-2 border rounded dark:bg-gray-700 dark:text-white"
              min={10}
              max={100}
            />
            <span className="ml-2">points</span>
          </div>
        )}
      </div>

      {/* API Integration */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">API Integration</h2>
        <p className="mb-2">Current API Key: {apiKey}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowApiModal(true)}
        >
          Edit API Key
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Theme</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
            className="h-4 w-4 text-blue-600"
          />
          <span>Dark Mode</span>
        </label>
      </div>

      {/* API Key Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit API Key</h2>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Enter API Key"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowApiModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={saveApiKey}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;