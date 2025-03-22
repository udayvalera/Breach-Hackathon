import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/home/totoro/Videos/frontendmain/src/components/ui/card";
import { Switch } from "/home/totoro/Videos/frontendmain/src/components/ui/switch";
import { Slider } from "/home/totoro/Videos/frontendmain/src/components/ui/slider";
import { Button } from "/home/totoro/Videos/frontendmain/src/components/ui/button";
import { Input } from "/home/totoro/Videos/frontendmain/src/components/ui/input";
import { Label } from "/home/totoro/Videos/frontendmain/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "/home/totoro/Videos/frontendmain/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/home/totoro/Videos/frontendmain/src/components/ui/tabs";
import { Moon, Sun, Shield, Bell, Key } from "lucide-react";
import { Separator } from "/home/totoro/Videos/frontendmain/src/components/ui/separator";

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
  const [activeTab, setActiveTab] = useState("bureaus");

  // Handle bureau preference toggles
  const handleBureauToggle = (key: keyof typeof bureauPrefs) => {
    setBureauPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle discrepancy alert toggle
  const handleDiscrepancyAlert = () => {
    setDiscrepancyAlert(!discrepancyAlert);
  };

  // Handle discrepancy threshold
  const handleThresholdChange = (values: number[]) => {
    setDiscrepancyThreshold(values[0]);
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
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900 text-slate-50" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure your credit lookup preferences
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="bureaus">Credit Bureaus</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integration">API Integration</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* Bureau Preferences */}
          <TabsContent value="bureaus">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Bureau Preferences
                </CardTitle>
                <CardDescription>
                  Configure how credit scores are collected and prioritized from different bureaus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equifax */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Equifax</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prioritizeEquifax" className="flex-1">Prioritize Equifax scores</Label>
                    <Switch
                      id="prioritizeEquifax"
                      checked={bureauPrefs.prioritizeEquifax}
                      onCheckedChange={() => handleBureauToggle("prioritizeEquifax")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ignoreEquifax" className="flex-1">Ignore if unavailable</Label>
                    <Switch
                      id="ignoreEquifax"
                      checked={bureauPrefs.ignoreEquifax}
                      onCheckedChange={() => handleBureauToggle("ignoreEquifax")}
                    />
                  </div>
                </div>
                
                <Separator />

                {/* TransUnion */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">TransUnion</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prioritizeTransUnion" className="flex-1">Prioritize TransUnion scores</Label>
                    <Switch
                      id="prioritizeTransUnion"
                      checked={bureauPrefs.prioritizeTransUnion}
                      onCheckedChange={() => handleBureauToggle("prioritizeTransUnion")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ignoreTransUnion" className="flex-1">Ignore if unavailable</Label>
                    <Switch
                      id="ignoreTransUnion"
                      checked={bureauPrefs.ignoreTransUnion}
                      onCheckedChange={() => handleBureauToggle("ignoreTransUnion")}
                    />
                  </div>
                </div>
                
                <Separator />

                {/* Experian */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Experian</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prioritizeExperian" className="flex-1">Prioritize Experian scores</Label>
                    <Switch
                      id="prioritizeExperian"
                      checked={bureauPrefs.prioritizeExperian}
                      onCheckedChange={() => handleBureauToggle("prioritizeExperian")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ignoreExperian" className="flex-1">Ignore if unavailable</Label>
                    <Switch
                      id="ignoreExperian" 
                      checked={bureauPrefs.ignoreExperian}
                      onCheckedChange={() => handleBureauToggle("ignoreExperian")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure alerts and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discrepancyAlert" className="flex-1">
                    Show alerts for score discrepancies
                  </Label>
                  <Switch
                    id="discrepancyAlert"
                    checked={discrepancyAlert}
                    onCheckedChange={handleDiscrepancyAlert}
                  />
                </div>

                {discrepancyAlert && (
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <Label>Discrepancy Threshold: {discrepancyThreshold} points</Label>
                    </div>
                    <Slider
                      value={[discrepancyThreshold]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={handleThresholdChange}
                      className="w-full"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Alert when scores differ by {discrepancyThreshold} points or more
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Integration */}
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Integration
                </CardTitle>
                <CardDescription>
                  Manage your API keys and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                  <p className="text-sm font-medium mb-1">Current API Key</p>
                  <div className="flex items-center">
                    <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                      {apiKey}
                    </code>
                  </div>
                </div>
                <Button onClick={() => setShowApiModal(true)}>
                  Change API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Toggle */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isDarkMode ? 
                    <Moon className="h-5 w-5 mr-2" /> : 
                    <Sun className="h-5 w-5 mr-2" />
                  }
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={isDarkMode}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* API Key Modal */}
      <Dialog open={showApiModal} onOpenChange={setShowApiModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update your API key for credit bureau integration
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="apiKey" className="mb-2 block">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;