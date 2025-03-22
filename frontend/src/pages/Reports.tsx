import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Download, Filter, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for lookups
const mockLookupHistory = [
  { id: 1, name: "John Doe", score: 720, date: "2025-03-21", status: "Approved" },
  { id: 2, name: "Jane Smith", score: 650, date: "2025-03-20", status: "Denied" },
  { id: 3, name: "Alice Johnson", score: 780, date: "2025-03-19", status: "Approved" },
  { id: 4, name: "Bob Brown", score: 610, date: "2025-03-18", status: "Review" },
  { id: 5, name: "Emma Davis", score: 740, date: "2025-03-17", status: "Approved" },
];

// Mock trends data
const mockTrendsData = {
  labels: ["2025-03-17", "2025-03-18", "2025-03-19", "2025-03-20", "2025-03-21"],
  scores: [740, 610, 780, 650, 720],
};

const Reports: React.FC = () => {
  const [lookupHistory, setLookupHistory] = useState(mockLookupHistory);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [riskLevel, setRiskLevel] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const applyFilters = () => {
    let filtered = [...mockLookupHistory];
    if (riskLevel !== "All") {
      filtered = filtered.filter((entry) => {
        if (riskLevel === "Low Risk") return entry.score >= 700;
        if (riskLevel === "Moderate Risk") return entry.score >= 600 && entry.score < 700;
        return entry.score < 600;
      });
    }
    if (dateRange === "Last 3 Days") {
      filtered = filtered.filter((entry) => new Date(entry.date) >= new Date("2025-03-19"));
    }
    setLookupHistory(filtered);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setDateRange("Last 7 Days");
    setRiskLevel("All");
    setLookupHistory(mockLookupHistory);
    setShowFilterModal(false);
  };

  const exportToCSV = () => {
    const csv = "Name,Score,Date,Status\n" + lookupHistory.map((entry) => `${entry.name},${entry.score},${entry.date},${entry.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit_lookup_report.csv";
    a.click();
  };

  const exportToPDF = () => {
    alert("PDF export triggered! In a real app, this would generate a PDF.");
    setShowExportModal(false);
  };

  const chartData = {
    labels: mockTrendsData.labels,
    datasets: [
      {
        label: "Average Unified Score",
        data: mockTrendsData.scores,
        borderColor: "#8b5cf6", // Vibrant purple
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 500,
        grid: { color: "rgba(139, 92, 246, 0.1)" },
      },
      x: { grid: { color: "rgba(139, 92, 246, 0.1)" } },
    },
  };

  const approvalRate = Math.round(
    (lookupHistory.filter((entry) => entry.status === "Approved").length / lookupHistory.length) * 100
  );
  const avgScore = Math.round(
    lookupHistory.reduce((sum, entry) => sum + entry.score, 0) / lookupHistory.length
  );
  const avgProcessingTime = 12;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-400 text-green-900 hover:bg-green-500">{status}</Badge>;
      case "Denied":
        return <Badge className="bg-red-400 text-red-900 hover:bg-red-500">{status}</Badge>;
      case "Review":
        return <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">{status}</Badge>;
      default:
        return <Badge className="bg-gray-400 text-gray-900">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Credit Reports</h1>
            <p className="text-blue-600">Securely view and analyze credit lookup data</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100" onClick={() => setShowFilterModal(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-100" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowExportModal(true)}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4 bg-blue-100 rounded-lg border-2 border-blue-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">All Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Approval Rate
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-green-800">{approvalRate}%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-green-600">Based on {lookupHistory.length} records</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-700 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Average Score
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-800">{avgScore}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-blue-600">
                  {avgScore >= 700 ? "Excellent" : avgScore >= 650 ? "Good" : "Fair"} average
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-700 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Avg Processing Time
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-purple-800">{avgProcessingTime}s</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-purple-600">Response time average</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 bg-white border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-t-lg">
              <CardTitle>Score Trends Over Time</CardTitle>
              <CardDescription className="text-purple-100">
                Average unified credit scores for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 bg-purple-50 rounded-b-lg">
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
              <CardTitle>Recent Lookups</CardTitle>
              <CardDescription className="text-blue-100">
                Latest {Math.min(3, lookupHistory.length)} credit lookup records
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 bg-blue-50 rounded-b-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="text-blue-800">Borrower Name</TableHead>
                    <TableHead className="text-blue-800">Score</TableHead>
                    <TableHead className="text-blue-800">Date</TableHead>
                    <TableHead className="text-blue-800">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lookupHistory.slice(0, 3).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-blue-900">{entry.name}</TableCell>
                      <TableCell className="text-blue-800">{entry.score}</TableCell>
                      <TableCell className="text-blue-800">{entry.date}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {lookupHistory.length > 3 && (
                <Button variant="link" className="mt-2 p-0 text-blue-600 hover:text-blue-800" onClick={() => setActiveTab("records")}>
                  View all {lookupHistory.length} records
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card className="bg-white border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
              <CardTitle>All Lookup Records</CardTitle>
              <CardDescription className="text-blue-100">
                Complete list of credit lookups ({lookupHistory.length} entries)
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-blue-50 rounded-b-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="text-blue-800">Borrower Name</TableHead>
                    <TableHead className="text-blue-800">Unified Score</TableHead>
                    <TableHead className="text-blue-800">Date</TableHead>
                    <TableHead className="text-blue-800">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lookupHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-blue-900">{entry.name}</TableCell>
                      <TableCell className="text-blue-800">{entry.score}</TableCell>
                      <TableCell className="text-blue-800">{entry.date}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="bg-white border-2 border-blue-200">
          <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <DialogTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Reports
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Apply filters to customize the displayed records
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 bg-blue-50 rounded-b-lg">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-blue-800">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-blue-300">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 3 Days">Last 3 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-blue- dagger text-blue-800">Risk Level</label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger className="border-blue-300">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Low Risk">Low Risk</SelectItem>
                  <SelectItem value="Moderate Risk">Moderate Risk</SelectItem>
                  <SelectItem value="High Risk">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="bg-blue-100 rounded-b-lg">
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-200" onClick={resetFilters}>Reset</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="bg-white border-2 border-purple-200">
          <DialogHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <DialogTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Preview
            </DialogTitle>
            <DialogDescription className="text-purple-100">
              Preview of the report to be exported as PDF
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-purple-50 p-4 rounded-md mb-4 space-y-2">
            <p className="text-purple-800"><strong>Approval Rate:</strong> {approvalRate}%</p>
            <p className="text-purple-800"><strong>Average Score:</strong> {avgScore}</p>
            <p className="text-purple-800"><strong>Entries:</strong> {lookupHistory.length}</p>
          </div>

          <DialogFooter className="bg-purple-100 rounded-b-lg">
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-200" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={exportToPDF}>
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;