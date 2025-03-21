import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

// Mock bureau data for simulation
const mockBureauData = [
  { bureau: "Equifax", score: 710, status: "Online", lastUpdated: "2025-03-21T10:30:00" },
  { bureau: "Experian", score: null, status: "Offline", lastUpdated: "2025-03-20T15:45:00" },
  { bureau: "TransUnion", score: 735, status: "Online", lastUpdated: "2025-03-21T10:30:00" },
];

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
  const [creditAssessment, setCreditAssessment] = useState<any>(null);

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with New Application Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Credit Lookup</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setShowNewAppModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </button>
      </div>

      {/* New Application Modal */}
      {showNewAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">New Application</h2>
            <form onSubmit={handleNewApplicationSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
                <input
                  type="text"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Borrower Name</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={() => setShowNewAppModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter Identification Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card</label>
              <input
                type="text"
                value={aadharCard}
                onChange={(e) => setAadharCard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="XXXX-XXXX-XXXX"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
              <input
                type="text"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABCDE1234F"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowDetailsModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
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
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Credit Assessment */}
      {creditAssessment && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Unified Credit Assessment</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Application Name</p>
              <p className="text-lg font-medium">{creditAssessment.applicationName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Borrower Name</p>
              <p className="text-lg font-medium">{creditAssessment.borrowerName}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unified Score</p>
                <p className="text-3xl font-bold text-blue-600">{creditAssessment.unifiedScore}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  creditAssessment.riskLevel === "Low Risk"
                    ? "text-green-600 bg-green-50"
                    : creditAssessment.riskLevel === "Moderate Risk"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {creditAssessment.riskLevel}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Score Confidence</p>
              <p className="text-lg font-medium">{creditAssessment.confidenceScore}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bureau Scores</h3>
              {creditAssessment.bureauScores.map((bureau: any) => (
                <div key={bureau.bureau} className="flex justify-between py-2 border-b">
                  <span>{bureau.bureau}</span>
                  <span
                    className={bureau.status === "Offline" ? "text-orange-500" : "text-gray-800"}
                  >
                    {bureau.score !== null
                      ? bureau.score
                      : `Offline (Last: ${new Date(bureau.lastUpdated).toLocaleDateString()})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditLookup;