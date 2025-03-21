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
        borderColor: "#4B5EAA",
        backgroundColor: "rgba(75, 94, 170, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Score Trends Over Time" },
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Summary Report */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Approval Rate</p>
          <p className="text-xl font-semibold">{approvalRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Average Score</p>
          <p className="text-xl font-semibold">{avgScore}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Avg Processing Time</p>
          <p className="text-xl font-semibold">{avgProcessingTime}s</p>
        </div>
      </div>

      {/* Trends Graph */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Searchable List and Export Buttons */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowFilterModal(true)}
          >
            Filter
          </button>
          <div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              onClick={exportToCSV}
            >
              Download CSV
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              onClick={() => setShowExportModal(true)}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Borrower Name</th>
              <th className="p-2">Unified Score</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {lookupHistory.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2">{entry.name}</td>
                <td className="p-2">{entry.score}</td>
                <td className="p-2">{entry.date}</td>
                <td className="p-2">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Filter Reports</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date Range</label>
              <select
                className="w-full p-2 border rounded"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 3 Days</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Risk Level</label>
              <select
                className="w-full p-2 border rounded"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option>All</option>
                <option>Low Risk</option>
                <option>Moderate Risk</option>
                <option>High Risk</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Preview Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Export Preview</h2>
            <p className="mb-4">Preview of the report to be exported as PDF:</p>
            <div className="bg-gray-100 p-2 rounded mb-4">
              <p>Approval Rate: {approvalRate}%</p>
              <p>Average Score: {avgScore}</p>
              <p>Entries: {lookupHistory.length}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={exportToPDF}
              >
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;