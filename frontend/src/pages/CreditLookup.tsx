import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock bureau data for simulation
const mockBureauData = [
  { bureau: "Equifax", score: 710, status: "Online", lastUpdated: "2025-03-21T10:30:00" },
  { bureau: "Experian", score: null, status: "Offline", lastUpdated: "2025-03-20T15:45:00" },
  { bureau: "TransUnion", score: 735, status: "Online", lastUpdated: "2025-03-21T10:30:00" },
];

interface CreditBureau {
  bureau: string;
  score: number | null;
  status: string;
  lastUpdated: string;
}

interface CreditAssessment {
  applicationName: string;
  borrowerName: string;
  unifiedScore: number;
  bureauScores: CreditBureau[];
  confidenceScore: number;
  riskLevel: string;
}

const CreditLookup: React.FC = () => {
  // State for modals and application data
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [description, setDescription] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [panCard, setPanCard] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [creditAssessment, setCreditAssessment] = useState<CreditAssessment | null>(null);

  // Handle form submission in New Application Modal
  const handleNewApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewAppModal(false);
    setShowDetailsModal(true);
  };

  // Simulate fetching credit bureau data
  const fetchCreditDetails = () => {
    setIsFetching(true);
    setTimeout(() => {
      const unifiedScore = Math.round(
        mockBureauData
          .filter((b) => b.score !== null)
          .reduce((sum, b) => sum + (b.score || 0), 0) /
          mockBureauData.filter((b) => b.score !== null).length
      );
      const confidenceScore = Math.round((mockBureauData.filter((b) => b.score !== null).length / 3) * 100);
      const riskLevel = unifiedScore >= 700 ? "Low Risk" : unifiedScore >= 600 ? "Moderate Risk" : "High Risk";

      setCreditAssessment({
        applicationName,
        borrowerName,
        unifiedScore,
        bureauScores: mockBureauData,
        confidenceScore,
        riskLevel,
      });
      setIsFetching(false);
      setShowDetailsModal(false);
    }, 2000); // Simulate 2-second delay
  };

  const getRiskBadgeStyle = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low Risk":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Moderate Risk":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "High Risk":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header with New Application Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Credit Lookup</h1>
          <p className="text-slate-500 mt-1">Unified credit assessment system</p>
        </div>
        <Button onClick={() => setShowNewAppModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* New Application Modal */}
      <Dialog open={showNewAppModal} onOpenChange={setShowNewAppModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
            <DialogDescription>
              Create a new credit assessment application
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewApplicationSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="applicationName">Application Name</Label>
                <Input
                  id="applicationName"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input
                  id="borrowerName"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowNewAppModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Next</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Identification Details</DialogTitle>
            <DialogDescription>
              Provide identification documents to proceed with credit assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="aadharCard">Aadhar Card</Label>
              <Input
                id="aadharCard"
                value={aadharCard}
                onChange={(e) => setAadharCard(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panCard">PAN Card</Label>
              <Input
                id="panCard"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value)}
                placeholder="ABCDE1234F"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={fetchCreditDetails}
              disabled={isFetching || !aadharCard || !panCard}
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Details"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Credit Assessment */}
      {creditAssessment ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Unified Credit Assessment</CardTitle>
            <CardDescription>
              Comprehensive credit report across multiple bureaus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-slate-500">Application Name</Label>
                <p className="text-lg font-medium">{creditAssessment.applicationName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-slate-500">Borrower Name</Label>
                <p className="text-lg font-medium">{creditAssessment.borrowerName}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-sm text-slate-500">Unified Score</Label>
                  <p className="text-5xl font-bold text-blue-600">{creditAssessment.unifiedScore}</p>
                </div>
                <Badge className={getRiskBadgeStyle(creditAssessment.riskLevel)}>
                  {creditAssessment.riskLevel}
                </Badge>
              </div>
              
              <div className="space-y-2 mt-6">
                <div className="flex justify-between">
                  <Label className="text-sm text-slate-500">Score Confidence</Label>
                  <span className="text-sm font-medium">{creditAssessment.confidenceScore}%</span>
                </div>
                <Progress value={creditAssessment.confidenceScore} className="h-2" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Bureau Scores</h3>
              <div className="space-y-4">
                {creditAssessment.bureauScores.map((bureau) => (
                  <div key={bureau.bureau} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${bureau.status === "Online" ? "bg-green-500" : "bg-orange-500"}`}></div>
                      <span className="font-medium">{bureau.bureau}</span>
                    </div>
                    <div className="text-right">
                      {bureau.score !== null ? (
                        <span className="text-lg font-semibold">{bureau.score}</span>
                      ) : (
                        <div>
                          <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">
                            Offline
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">
                            Last updated: {new Date(bureau.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button variant="outline" className="mr-2">Download Report</Button>
            <Button>Apply for Loan</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Active Assessment</CardTitle>
            <CardDescription>
              Start by creating a new credit assessment application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <Plus className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-center max-w-md">
              Create a new application to check unified credit scores across multiple bureaus and assess lending risk.
            </p>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-center">
            <Button onClick={() => setShowNewAppModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CreditLookup;