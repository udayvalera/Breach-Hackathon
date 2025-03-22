import React, { useState, useEffect } from "react";
import { Plus, Loader2, Shield, Download, CreditCard, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock bureau data
const mockBureauData = [
  { bureau: "CIBIL", score: 750, status: "Online", lastUpdated: "2025-03-21T10:30:00", history: [
    { type: "Loan", status: "Active", amount: 500000 },
    { type: "Credit Card", status: "Closed", amount: 100000 },
  ]},
  { bureau: "Experian", score: 780, status: "Online", lastUpdated: "2025-03-20T15:45:00", history: [
    { type: "Home Loan", status: "Active", amount: 2000000 },
    { type: "Personal Loan", status: "Active", amount: 300000 },
  ]},
  { bureau: "Equifax", score: null, status: "Offline", lastUpdated: "2025-03-21T10:30:00", history: [] },
];

interface CreditBureau {
  bureau: string;
  score: number | null;
  status: string;
  lastUpdated: string;
  history: { type: string; status: string; amount: number }[];
}

interface CreditAssessment {
  applicationName: string;
  borrowerName: string;
  description: string;
  aadharCard: string;
  panCard: string;
  unifiedScore: number;
  bureauScores: CreditBureau[];
  confidenceScore: number;
  riskLevel: string;
  recommendations: string[];
}

interface Toast {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  className?: string;
}

const CreditLookup: React.FC = () => {
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFetchingModal, setShowFetchingModal] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [description, setDescription] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [panCard, setPanCard] = useState("");
  const [creditAssessment, setCreditAssessment] = useState<CreditAssessment | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast function
  const toast = ({ title, description, duration = 3000, className }: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, duration, className }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const handleNewApplicationSubmit = (data: { applicationName: string; borrowerName: string; description: string }) => {
    try {
      setApplicationName(data.applicationName);
      setBorrowerName(data.borrowerName);
      setDescription(data.description);
      setShowNewAppModal(false);
      setShowDetailsModal(true);
      
      toast({
        title: "Success",
        description: "New application created successfully",
        duration: 3000,
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new application",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleDocumentSubmit = (data: { aadharCard: string; panCard: string }) => {
    setAadharCard(data.aadharCard);
    setPanCard(data.panCard);
    setShowDetailsModal(false);
    setShowFetchingModal(true);

    toast({
      title: "Processing",
      description: "Document details submitted, fetching credit information...",
      duration: 2000,
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  const handleFetchComplete = (data: any) => {
    setCreditAssessment({
      applicationName,
      borrowerName,
      description,
      aadharCard,
      panCard,
      unifiedScore: data.unifiedScore,
      bureauScores: data.bureaus.map((b: any) => ({
        bureau: b.name,
        score: b.data?.score || null,
        status: b.data ? "Online" : "Offline",
        lastUpdated: new Date().toISOString(),
        history: b.data?.history || [],
      })),
      confidenceScore: Math.round((data.bureaus.length / 3) * 100),
      riskLevel: data.riskLevel,
      recommendations: data.recommendations,
    });
    setShowFetchingModal(false);

    toast({
      title: "Complete",
      description: "Credit assessment generated successfully",
      duration: 3000,
      className: "bg-emerald-50 border-emerald-200 text-emerald-800",
    });
  };

  const resetApplication = () => {
    setCreditAssessment(null);
    setApplicationName("");
    setBorrowerName("");
    setDescription("");
    setAadharCard("");
    setPanCard("");
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low Risk": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Medium": return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "High Risk": return "bg-rose-100 text-rose-800 hover:bg-rose-100";
      default: return "bg-slate-100 text-slate-800 hover:bg-slate-100";
    }
  };

  const getBureauStatusColor = (status: string) => {
    return status === "Online" ? "bg-emerald-500" : "bg-amber-500";
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-700 mr-3" />
            <h1 className="text-3xl font-bold text-blue-800">Credit Lookup</h1>
          </div>
          <p className="text-blue-600 mt-1 ml-11">Secure unified credit assessment system</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewAppModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* New Application Modal */}
      <Dialog open={showNewAppModal} onOpenChange={setShowNewAppModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-blue-200">
          <DialogHeader className="bg-blue-100 -m-4 mb-4 p-4 rounded-t-lg">
            <DialogTitle className="text-blue-800 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              New Application
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              Enter the details for the new credit assessment application
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleNewApplicationSubmit({ applicationName, borrowerName, description });
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="applicationName" className="text-blue-700">Application Name</Label>
                <Input
                  id="applicationName"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borrowerName" className="text-blue-700">Borrower's Name</Label>
                <Input
                  id="borrowerName"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-blue-700">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="bg-blue-100 -m-4 mt-4 p-4 rounded-b-lg">
              <Button variant="outline" type="button" onClick={() => setShowNewAppModal(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" type="submit">Next</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-blue-200">
          <DialogHeader className="bg-blue-100 -m-4 mb-4 p-4 rounded-t-lg">
            <DialogTitle className="text-blue-800 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Document Details
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              Enter the borrower's identification details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleDocumentSubmit({ aadharCard, panCard });
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="aadharCard" className="text-blue-700">Aadhar Card Number</Label>
                <Input
                  id="aadharCard"
                  value={aadharCard}
                  onChange={(e) => setAadharCard(e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  className="border-blue-200 focus:border-blue-400"
                  required
                  pattern="[0-9]{12}"
                  maxLength={12}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panCard" className="text-blue-700">PAN Card Number</Label>
                <Input
                  id="panCard"
                  value={panCard}
                  onChange={(e) => setPanCard(e.target.value)}
                  placeholder="Enter 10-character PAN number"
                  className="border-blue-200 focus:border-blue-400"
                  required
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  maxLength={10}
                />
              </div>
            </div>
            <DialogFooter className="bg-blue-100 -m-4 mt-4 p-4 rounded-b-lg">
              <Button variant="outline" type="button" onClick={() => setShowDetailsModal(false)}>
                Back
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" type="submit">Fetch Details</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Fetching Status Modal */}
      <Dialog open={showFetchingModal} onOpenChange={setShowFetchingModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-blue-200">
          <DialogHeader className="bg-blue-100 -m-4 mb-4 p-4 rounded-t-lg">
            <DialogTitle className="text-blue-800 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Fetching Credit Information
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              Retrieving credit information from multiple bureaus
            </DialogDescription>
          </DialogHeader>
          <FetchingStatusModal 
            open={showFetchingModal} 
            onClose={() => setShowFetchingModal(false)}
            onComplete={handleFetchComplete}
            toast={toast}
          />
        </DialogContent>
      </Dialog>

      {/* Credit Assessment Display */}
      {creditAssessment ? (
        <Card className="mt-8 border-2 border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-white" />
                <CardTitle>Unified Credit Assessment</CardTitle>
              </div>
              <Button variant="ghost" onClick={resetApplication} className="text-white hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
            </div>
            <CardDescription className="text-blue-100">
              Comprehensive credit report across multiple bureaus
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2 bg-cyan-50 p-4 rounded-lg border-2 border-cyan-200">
                <Label className="text-sm text-cyan-700">Application Details</Label>
                <p className="font-medium text-cyan-900">{creditAssessment.applicationName}</p>
                <p className="text-sm text-cyan-800">{creditAssessment.borrowerName}</p>
                <p className="text-sm text-cyan-600">{creditAssessment.description || "N/A"}</p>
              </div>
              <div className="space-y-2 bg-cyan-50 p-4 rounded-lg border-2 border-cyan-200">
                <Label className="text-sm text-cyan-700">Document Details</Label>
                <p className="text-sm text-cyan-800">Aadhar: XXXX XXXX {creditAssessment.aadharCard.slice(-4)}</p>
                <p className="text-sm text-cyan-800">PAN: {creditAssessment.panCard}</p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
                <Label className="text-sm text-blue-100">Unified Score</Label>
                <p className="text-4xl font-bold">{creditAssessment.unifiedScore}</p>
                <Badge className={`${getRiskBadgeColor(creditAssessment.riskLevel)} mt-2`}>
                  {creditAssessment.riskLevel}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="unified" className="space-y-6">
              <TabsList className="grid grid-cols-3 bg-purple-100 border-2 border-purple-200">
                <TabsTrigger value="unified" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Unified Report</TabsTrigger>
                <TabsTrigger value="cibil" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">CIBIL</TabsTrigger>
                <TabsTrigger value="experian" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Experian</TabsTrigger>
              </TabsList>

              <TabsContent value="unified">
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="text-lg font-medium mb-4 text-purple-800">Unified Credit Assessment</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-white border-2 border-purple-100">
                        <CardContent className="p-4">
                          <Label className="text-sm text-purple-700">Credit Score</Label>
                          <p className="text-2xl font-bold text-purple-800">{creditAssessment.unifiedScore}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white border-2 border-purple-100">
                        <CardContent className="p-4">
                          <Label className="text-sm text-purple-700">Risk Level</Label>
                          <p className="text-2xl font-bold text-purple-800">{creditAssessment.riskLevel}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white border-2 border-purple-100">
                        <CardContent className="p-4">
                          <Label className="text-sm text-purple-700">Active Loans</Label>
                          <p className="text-2xl font-bold text-purple-800">
                            {creditAssessment.bureauScores.reduce((sum, b) => sum + (b.history.filter(h => h.status === "Active").length), 0)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2 text-purple-800">Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-1 text-purple-700">
                        {creditAssessment.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cibil">
                <BureauReport bureauData={creditAssessment.bureauScores.find(b => b.bureau === "CIBIL")} />
              </TabsContent>

              <TabsContent value="experian">
                <BureauReport bureauData={creditAssessment.bureauScores.find(b => b.bureau === "Experian")} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end bg-gray-50 p-6">
            <Button variant="outline" className="mr-2 border-blue-300 text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-8 border-2 border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-600 text-white">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-white" />
              <CardTitle>No Active Assessment</CardTitle>
            </div>
            <CardDescription className="text-blue-100">
              Start by creating a new credit assessment application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 bg-white">
            <div className="bg-purple-100 p-6 rounded-full mb-4 border-2 border-purple-200">
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-purple-700 text-center max-w-md">
              Create a new application to check unified credit scores across multiple bureaus and assess lending risk.
            </p>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-center bg-gray-50 p-6">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewAppModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-md shadow-lg border ${t.className || "bg-gray-800 text-white"}`}
          >
            <h3 className="font-bold">{t.title}</h3>
            {t.description && <p>{t.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Fetching Status Modal Component
const FetchingStatusModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  toast: (toast: Omit<Toast, 'id'>) => void;
}> = ({ open, onClose, onComplete, toast }) => {
  const [bureaus, setBureaus] = useState<{ name: string; status: string; data: { score: number; history: { type: string; status: string; amount: number }[] } | null }[]>([
    { name: "CIBIL", status: "pending", data: null },
    { name: "Experian", status: "pending", data: null },
    { name: "Equifax", status: "pending", data: null },
  ]);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        for (const bureau of mockBureauData) {
          setBureaus(prev => prev.map(b => b.name === bureau.bureau ? { ...b, status: "fetching" } : b));
          await new Promise(resolve => setTimeout(resolve, 2000));
          setBureaus(prev => prev.map(b => b.name === bureau.bureau ? {
            ...b,
            status: bureau.score ? "success" : "failed",
            data: bureau.score ? { score: bureau.score, history: bureau.history } : null,
          } : b));
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        const successfulBureaus = bureaus.filter(b => b.status === "success");
        const unifiedScore = Math.round(
          successfulBureaus.reduce((sum, b) => sum + (b.data?.score || 0), 0) / successfulBureaus.length
        );
        const onCompleteData = {
          bureaus: bureaus.filter(b => b.status === "success"),
          unifiedScore,
          riskLevel: unifiedScore >= 750 ? "Low Risk" : "Medium",
          recommendations: ["Maintain timely repayments", "Monitor credit utilization"],
        };
        onComplete(onCompleteData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch credit information",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    };

    fetchData();
  }, [open, onComplete, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-500";
      case "fetching": return "text-yellow-500";
      case "failed": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  return (
    <>
      <div className="py-4">
        <div className="space-y-4">
          {bureaus.map(bureau => (
            <div key={bureau.name} className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-blue-700">{bureau.name}</span>
              <div className="flex items-center">
                <span className={`mr-2 ${getStatusColor(bureau.status)}`}>
                  {bureau.status === "fetching" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : bureau.status === "success" ? "✓" : bureau.status === "failed" ? "✗" : "○"}
                </span>
                <span className={getStatusColor(bureau.status)}>
                  {bureau.status.charAt(0).toUpperCase() + bureau.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter className="bg-blue-100 -m-4 mt-4 p-4 rounded-b-lg">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={bureaus.some(b => b.status === "fetching")}
        >
          Cancel
        </Button>
      </DialogFooter>
    </>
  );
};

// Bureau Report Component
const BureauReport: React.FC<{ bureauData: CreditBureau | undefined }> = ({ bureauData }) => {
  return (
    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
      <h3 className="text-lg font-medium mb-4 text-purple-800">
        {bureauData?.bureau} Report
      </h3>
      {bureauData && bureauData.score ? (
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-purple-700">Credit Score</Label>
            <p className="text-3xl font-bold text-purple-800">{bureauData.score}</p>
          </div>
          <div>
            <h4 className="text-md font-medium mb-2 text-purple-800">Credit History</h4>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-purple-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {bureauData.history.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-purple-800">{item.type}</td>
                      <td className="px-4 py-2">
                        <Badge className={item.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-purple-800">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-purple-400" />
          <p className="mt-4 text-purple-600">No data available from {bureauData?.bureau}</p>
        </div>
      )}
    </div>
  );
};

export default CreditLookup;