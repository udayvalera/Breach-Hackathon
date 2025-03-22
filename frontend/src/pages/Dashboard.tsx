import React from "react";
import { 
  Users, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Download,
  RefreshCw,
  Shield,
  Lock
} from "lucide-react";
import { mockBorrowers, bureauStatus } from "../data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
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
    <div className="p-6 space-y-6 bg-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-blue-800">Secure Dashboard</h1>
          </div>
          <p className="text-blue-600 mt-1 ml-11">Protected credit lookup activity overview</p>
        </div>
        <Button className="w-fit bg-blue-600 hover:bg-blue-700 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-purple-200 bg-purple-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Total Lookups Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-10 w-10 text-purple-500 mr-3 p-1 bg-purple-100 rounded-full" />
              <div className="text-2xl font-bold text-purple-700">{totalLookups} <span className="text-purple-500 text-lg font-normal">Borrowers</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Average Unified Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-10 w-10 text-green-500 mr-3 p-1 bg-green-100 rounded-full" />
              <div className="text-2xl font-bold text-green-700">{averageScore}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-200 bg-cyan-50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-600">Bureau Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bureauStatus.map(bureau => (
                <div key={bureau.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        bureau.status === "Online" ? "bg-cyan-500" : "bg-red-500"
                      }`}></span>
                      <span className="text-sm font-medium text-cyan-700">{bureau.name}</span>
                    </div>
                    <span className="text-sm text-cyan-600">{bureau.uptime}%</span>
                  </div>
                  <Progress value={bureau.uptime} className="h-2 bg-cyan-100" indicatorClassName="bg-cyan-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-blue-200 bg-white shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            <CardTitle>Secured Recent Activity</CardTitle>
          </div>
          <CardDescription className="text-blue-100">Latest encrypted credit assessment results</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="text-blue-700">Borrower</TableHead>
                <TableHead className="text-blue-700">Score</TableHead>
                <TableHead className="text-blue-700">Risk Level</TableHead>
                <TableHead className="text-blue-700">Status</TableHead>
                <TableHead className="text-blue-700">Time</TableHead>
                <TableHead className="text-blue-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBorrowers.map((borrower, index) => (
                <TableRow key={borrower.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <TableCell className="font-medium text-blue-800">{borrower.name}</TableCell>
                  <TableCell className="font-medium">{borrower.unifiedScore}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(borrower.riskLevel)} className="px-3 py-1">
                      {borrower.riskLevel} Risk
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(borrower.status)} className="px-3 py-1">
                      {borrower.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(borrower.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadReport(borrower)}
                      className="h-8 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-300 flex items-center"
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
        <CardFooter className="border-t border-blue-100 flex justify-between items-center pt-6 bg-blue-50 rounded-b-lg">
          <p className="text-sm text-blue-600">Showing {mockBorrowers.length} secured records</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">View All Activity</Button>
        </CardFooter>
      </Card>

      {bureauStatus.some(bureau => bureau.status === "Offline") && (
        <Alert className="bg-amber-50 border-2 border-amber-300 text-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold">Bureau Downtime Alert</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              {bureauStatus.find(b => b.status === "Offline")?.name} is currently unavailable. 
              Using encrypted cached data where applicable.
            </span>
            <Button className="ml-4 bg-amber-600 hover:bg-amber-700 text-white" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}