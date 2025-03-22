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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // State for filters, modals, and filtered data
  const [lookupHistory, setLookupHistory] = useState(mockLookupHistory);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [riskLevel, setRiskLevel] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Filter logic (mocked)
  const applyFilters = () => {
    let filtered = [...mockLookupHistory];
    if (riskLevel !== "All") {
      filtered = filtered.filter((entry) => {
        if (riskLevel === "Low Risk") return entry.score >= 700;
        if (riskLevel === "Moderate Risk") return entry.score >= 600 && entry.score < 700;
        return entry.score < 600;
      });
    }
    // Simulate date range filter (simplified for demo)
    if (dateRange === "Last 3 Days") {
      filtered = filtered.filter((entry) => new Date(entry.date) >= new Date("2025-03-19"));
    }
    setLookupHistory(filtered);
    setShowFilterModal(false);
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange("Last 7 Days");
    setRiskLevel("All");
    setLookupHistory(mockLookupHistory);
    setShowFilterModal(false);
  };

  // Mock export functions
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
    // For demo, simulate PDF export with alert
    alert("PDF export triggered! In a real app, this would generate a PDF.");
    setShowExportModal(false);
  };

  // Trends graph data
  const chartData = {
    labels: mockTrendsData.labels,
    datasets: [
      {
        label: "Average Unified Score",
        data: mockTrendsData.scores,
        borderColor: "hsl(221.2 83.2% 53.3%)",
        backgroundColor: "hsla(221.2 83.2% 53.3%, 0.2)",
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
      },
    },
  };

  // Summary stats
  const approvalRate = Math.round(
    (lookupHistory.filter((entry) => entry.status === "Approved").length / lookupHistory.length) * 100
  );
  const avgScore = Math.round(
    lookupHistory.reduce((sum, entry) => sum + entry.score, 0) / lookupHistory.length
  );
  const avgProcessingTime = 12; // Mocked value in seconds

  // Status badge renderer
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Denied":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      case "Review":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Credit Reports</h1>
          <p className="text-slate-500">View and analyze credit lookup data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="default" onClick={() => setShowExportModal(true)}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">All Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Summary Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Approval Rate</CardDescription>
                <CardTitle className="text-3xl font-bold">{approvalRate}%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-slate-500">Based on {lookupHistory.length} records</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Score</CardDescription>
                <CardTitle className="text-3xl font-bold">{avgScore}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-slate-500">
                  {avgScore >= 700 ? "Excellent" : avgScore >= 650 ? "Good" : "Fair"} average
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Processing Time</CardDescription>
                <CardTitle className="text-3xl font-bold">{avgProcessingTime}s</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-slate-500">Response time average</p>
              </CardContent>
            </Card>
          </div>

          {/* Trends Graph */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Score Trends Over Time</CardTitle>
              <CardDescription>Average unified credit scores for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Lookups */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Lookups</CardTitle>
              <CardDescription>Latest {Math.min(3, lookupHistory.length)} credit lookup records</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lookupHistory.slice(0, 3).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell>{entry.score}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {lookupHistory.length > 3 && (
                <Button variant="link" className="mt-2 p-0" onClick={() => setActiveTab("records")}>
                  View all {lookupHistory.length} records
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>All Lookup Records</CardTitle>
              <CardDescription>
                Complete list of credit lookups ({lookupHistory.length} entries)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower Name</TableHead>
                    <TableHead>Unified Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lookupHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell>{entry.score}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Reports</DialogTitle>
            <DialogDescription>
              Apply filters to customize the displayed records
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 3 Days">Last 3 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Risk Level</label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
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

          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Preview Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Preview</DialogTitle>
            <DialogDescription>
              Preview of the report to be exported as PDF
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-100 p-4 rounded-md mb-4 space-y-2">
            <p><strong>Approval Rate:</strong> {approvalRate}%</p>
            <p><strong>Average Score:</strong> {avgScore}</p>
            <p><strong>Entries:</strong> {lookupHistory.length}</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={exportToPDF}>
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;