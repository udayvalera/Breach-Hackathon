import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Info, 
  AlertCircle, 
  ChevronDown, 
  Send, 
  ExternalLink 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - would connect to backend in real implementation
    alert(`Thank you for your message, ${contactName}. Our team will respond to ${contactEmail} shortly.`);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Help Center</h1>
        <p className="text-slate-500 mt-1">Find answers, guides, and support for the Credit Lookup System</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search for help topics..."
          className="pl-10 py-6 text-lg"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Access detailed guides and documentation about using the credit lookup system.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-purple-600" />
              Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Watch video tutorials and step-by-step guides to effectively use our system.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Tutorials
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Contact our support team for personalized assistance with your queries.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contact Support
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="guides">Quick Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about using the Credit Lookup System</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How is the unified credit score calculated?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-slate-600 mb-2">
                      The unified credit score is calculated by aggregating data from multiple credit bureaus including Equifax, Experian, and TransUnion.
                    </p>
                    <p className="text-slate-600 mb-2">
                      Our proprietary algorithm weighs these scores based on:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-600">
                      <li>Recency of the data</li>
                      <li>Completeness of bureau information</li>
                      <li>Historical accuracy of each bureau</li>
                      <li>Consistency across bureaus</li>
                    </ul>
                    <p className="text-slate-600 mt-2">
                      The final score represents a comprehensive assessment of creditworthiness that is more reliable than any single bureau score.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What does the confidence score indicate?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-slate-600">
                      The confidence score indicates the reliability of our unified credit assessment. A higher confidence score means more bureau data was available and consistent. Low confidence scores may occur when bureaus are offline or data is inconsistent between sources.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I interpret the risk levels?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Badge variant="success" className="mt-1">Low Risk</Badge>
                        <p className="text-slate-600 ml-3">
                          Indicates a highly creditworthy borrower with strong repayment history. Generally corresponds to scores above 700.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <Badge variant="warning" className="mt-1">Moderate Risk</Badge>
                        <p className="text-slate-600 ml-3">
                          Indicates an average creditworthy borrower who may have some minor issues in their credit history. Generally corresponds to scores between 600-700.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <Badge variant="destructive" className="mt-1">High Risk</Badge>
                        <p className="text-slate-600 ml-3">
                          Indicates a borrower with significant credit issues. Generally corresponds to scores below 600.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What happens when a bureau is offline?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-slate-600">
                      When a bureau is offline, the system will:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-600 my-2">
                      <li>Use cached data from the offline bureau if available</li>
                      <li>Calculate the unified score based on available bureau data</li>
                      <li>Reduce the confidence score to reflect missing information</li>
                      <li>Clearly indicate which bureau is offline in the assessment</li>
                    </ul>
                    <p className="text-slate-600">
                      You can retry the connection or proceed with the reduced confidence score.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I download a credit report?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-slate-600">
                      To download a credit report:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1 text-slate-600 my-2">
                      <li>Navigate to the Dashboard or Credit Lookup page</li>
                      <li>Find the borrower in the list of recent assessments</li>
                      <li>Click the "Report" button with the download icon</li>
                      <li>The report will download as a PDF containing all credit details</li>
                    </ol>
                    <p className="text-slate-600">
                      Reports include the unified score, individual bureau scores, risk assessment, and relevant borrower information.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-slate-500">Can't find what you're looking for?</p>
              <Button variant="outline" size="sm">View All FAQs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Quick Guides</CardTitle>
              <CardDescription>Step-by-step instructions for common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Beginner</Badge>
                    <h3 className="text-lg font-medium">Creating a New Credit Application</h3>
                  </div>
                  <ol className="list-decimal pl-6 space-y-2 text-slate-600">
                    <li>Navigate to the Credit Lookup page</li>
                    <li>Click the "New Application" button in the top right</li>
                    <li>Fill in the application name and borrower details</li>
                    <li>Click "Next" to proceed to identification details</li>
                    <li>Enter the borrower's Aadhar Card and PAN Card numbers</li>
                    <li>Click "Fetch Details" to retrieve credit information</li>
                  </ol>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    View detailed guide
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Intermediate</Badge>
                    <h3 className="text-lg font-medium">Understanding the Credit Assessment</h3>
                  </div>
                  <ol className="list-decimal pl-6 space-y-2 text-slate-600">
                    <li>Review the Unified Score as the primary indicator</li>
                    <li>Check the Risk Level indicator for quick assessment</li>
                    <li>Review individual bureau scores to understand data sources</li>
                    <li>Note any offline bureaus or data discrepancies</li>
                    <li>Check the confidence score to gauge reliability</li>
                    <li>Download the full report for comprehensive details</li>
                  </ol>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    View detailed guide
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">Advanced</Badge>
                    <h3 className="text-lg font-medium">Exporting and Analyzing Data</h3>
                  </div>
                  <ol className="list-decimal pl-6 space-y-2 text-slate-600">
                    <li>Use the Dashboard to view aggregate statistics</li>
                    <li>Download individual reports for detailed analysis</li>
                    <li>Export data to CSV from the Reports section</li>
                    <li>Use filters to segment data by risk level, score range, or date</li>
                    <li>Generate trend reports by comparing historical data</li>
                  </ol>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    View detailed guide
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-slate-500">Need more detailed help?</p>
              <Button variant="outline" size="sm">Browse All Guides</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our customer support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContact}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe your issue or question in detail..."
                      rows={6}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Other Ways to Reach Us</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Email Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">
                        support@creditlookup.example.com
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Response time: Within 24 hours
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Phone Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Available: Mon-Fri, 9 AM - 5 PM
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-blue-50 border-blue-100 mt-8">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-lg">Need additional assistance?</h3>
              <p className="text-slate-600 mt-1">
                Our dedicated support team is available for personalized guidance through live chat, phone, or email.
              </p>
              <Button className="mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}