import React from "react";
import { 
  Users, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Download,
  RefreshCw
} from "lucide-react";
import { mockBorrowers, bureauStatus } from "../data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "success";
      case "Moderate":
        return "warning";
      default:
        return "destructive";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Denied":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of credit lookup activity</p>
        </div>
        <Button variant="outline" className="w-fit">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Lookups Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-2xl font-bold">{totalLookups} <span className="text-slate-500 text-lg font-normal">Borrowers</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Unified Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-2xl font-bold">{averageScore}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Bureau Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bureauStatus.map(bureau => (
                <div key={bureau.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        bureau.status === "Online" ? "bg-green-500" : "bg-red-500"
                      }`}></span>
                      <span className="text-sm font-medium">{bureau.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{bureau.uptime}%</span>
                  </div>
                  <Progress value={bureau.uptime} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest credit assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBorrowers.map(borrower => (
                <TableRow key={borrower.id}>
                  <TableCell className="font-medium">{borrower.name}</TableCell>
                  <TableCell>{borrower.unifiedScore}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(borrower.riskLevel)}>
                      {borrower.riskLevel} Risk
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(borrower.status)}>
                      {borrower.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(borrower.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => downloadReport(borrower)}
                      className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t flex justify-between items-center pt-6">
          <p className="text-sm text-slate-500">Showing {mockBorrowers.length} records</p>
          <Button variant="outline" size="sm">View All Activity</Button>
        </CardFooter>
      </Card>

      {bureauStatus.some(bureau => bureau.status === "Offline") && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bureau Downtime Alert</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              {bureauStatus.find(b => b.status === "Offline")?.name} is currently unavailable. 
              Using cached data where applicable.
            </span>
            <Button variant="outline" size="sm" className="ml-4">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}