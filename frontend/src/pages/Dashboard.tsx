import React from "react";
import { 
  Users, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Download,
} from "lucide-react";
import { mockBorrowers, bureauStatus } from "../data/mockData";

export default function Dashboard() {
  const totalLookups = mockBorrowers.length;
  const averageScore = Math.round(
    mockBorrowers.reduce((acc, curr) => acc + curr.unifiedScore, 0) / totalLookups
  );

  // Mock function to simulate downloading a report
  const downloadReport = (borrower: any) => {
    // Simulate PDF generation with an alert for demo purposes
    const reportContent = `
      Credit Report for ${borrower.name}
      Unified Score: ${borrower.unifiedScore}
      Risk Level: ${borrower.riskLevel} Risk
      Status: ${borrower.status}
      Last Updated: ${new Date(borrower.lastUpdated).toLocaleString()}
    `;
    const blob = new Blob([reportContent], { type: "text/plain" }); // Could be text/pdf with a library
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${borrower.name}_credit_report.txt`; // .pdf in real app
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Lookups Today</h3>
              <p className="text-2xl font-bold text-gray-900">{totalLookups} Borrowers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Average Unified Score</h3>
              <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Bureau Uptime</h3>
              <div className="space-y-1 mt-2">
                {bureauStatus.map(bureau => (
                  <div key={bureau.name} className="flex items-center text-sm">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      bureau.status === "Online" ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    <span>{bureau.name}: {bureau.uptime}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Borrower</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Risk Level</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBorrowers.map(borrower => (
                  <tr key={borrower.id} className="border-b last:border-0">
                    <td className="py-3">{borrower.name}</td>
                    <td className="py-3">{borrower.unifiedScore}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        borrower.riskLevel === "Low" ? "bg-green-100 text-green-800" :
                        borrower.riskLevel === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {borrower.riskLevel} Risk
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        borrower.status === "Approved" ? "bg-green-100 text-green-800" :
                        borrower.status === "Denied" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {borrower.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(borrower.lastUpdated).toLocaleTimeString()}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => downloadReport(borrower)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        title="Download Report"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-sm">Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bureauStatus.some(bureau => bureau.status === "Offline") && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            <p className="ml-3 text-orange-700">
              Bureau Downtime: {bureauStatus.find(b => b.status === "Offline")?.name} is currently unavailable. 
              Using cached data where applicable.
            </p>
            <button className="ml-auto bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200">
              Retry Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}