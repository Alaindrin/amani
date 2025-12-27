import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { quotationAPI, messageAPI, type Quotation, type Message, type Stats } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Mail, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Trash2,
  ArrowLeft,
  BarChart3,
  Users,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Fetch quotations
  const { data: quotationsData, isLoading: quotationsLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: quotationAPI.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageAPI.getAll,
    refetchInterval: 30000,
  });

  // Fetch quotation stats
  const { data: quotationStats } = useQuery({
    queryKey: ['quotation-stats'],
    queryFn: quotationAPI.getStats,
    refetchInterval: 30000,
  });

  // Fetch message stats
  const { data: messageStats } = useQuery({
    queryKey: ['message-stats'],
    queryFn: messageAPI.getStats,
    refetchInterval: 30000,
  });

  // Update quotation status mutation
  const updateQuotationStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      quotationAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-stats'] });
      toast({ title: "Status updated successfully" });
    },
  });

  // Update message status mutation
  const updateMessageStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      messageAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message-stats'] });
      toast({ title: "Status updated successfully" });
    },
  });

  // Delete quotation mutation
  const deleteQuotation = useMutation({
    mutationFn: (id: number) => quotationAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-stats'] });
      toast({ title: "Quotation deleted successfully" });
      setSelectedQuotation(null);
    },
  });

  // Delete message mutation
  const deleteMessage = useMutation({
    mutationFn: (id: number) => messageAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message-stats'] });
      toast({ title: "Message deleted successfully" });
      setSelectedMessage(null);
    },
  });

  const quotations = quotationsData?.data || [];
  const messages = messagesData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'unread':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'reviewed':
      case 'read':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'responded':
      case 'replied':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'denied':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => localStorage.removeItem("adminLoggedIn")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Logout & Back to Portfolio
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage quotations and messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quotations
              </CardTitle>
              <FileText className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {quotationStats?.data?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {quotationStats?.data?.pending || 0} pending review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Messages
              </CardTitle>
              <MessageSquare className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {messageStats?.data?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {messageStats?.data?.unread || 0} unread
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Response Rate
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {quotationStats?.data?.total 
                  ? Math.round(((quotationStats.data.responded || 0) / quotationStats.data.total) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {quotationStats?.data?.responded || 0} responded
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </CardTitle>
              <Clock className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                &lt;24h
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target response time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotations" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="quotations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Quotation Requests
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Mail className="w-4 h-4 mr-2" />
              Contact Messages
            </TabsTrigger>
          </TabsList>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Quotation Requests</CardTitle>
                <CardDescription>
                  View and manage all quotation requests from potential clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : quotations.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No quotation requests yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Project Type</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotations.map((quotation) => (
                          <TableRow key={quotation.id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{quotation.name}</TableCell>
                            <TableCell>{quotation.email}</TableCell>
                            <TableCell className="capitalize">
                              {quotation.project_type?.replace('-', ' ')}
                            </TableCell>
                            <TableCell>{quotation.budget || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(quotation.status)}>
                                {quotation.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedQuotation(quotation)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  View and manage all messages from the contact form
                </CardDescription>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Message Preview</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {message.message}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quotation Detail Dialog */}
      <Dialog open={!!selectedQuotation} onOpenChange={() => setSelectedQuotation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Request Details</DialogTitle>
            <DialogDescription>
              Submitted {selectedQuotation && formatDistanceToNow(new Date(selectedQuotation.created_at), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{selectedQuotation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedQuotation.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedQuotation.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <p className="text-foreground">{selectedQuotation.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                  <p className="text-foreground capitalize">{selectedQuotation.project_type?.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Budget</label>
                  <p className="text-foreground">{selectedQuotation.budget || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                  <p className="text-foreground">{selectedQuotation.timeline || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Select
                      value={selectedQuotation.status}
                      onValueChange={(value) =>
                        updateQuotationStatus.mutate({ id: selectedQuotation.id, status: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Project Description</label>
                <p className="text-foreground mt-2 whitespace-pre-wrap bg-secondary/50 p-4 rounded-lg">
                  {selectedQuotation.description}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => deleteQuotation.mutate(selectedQuotation.id)}
                  disabled={deleteQuotation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setSelectedQuotation(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received {selectedMessage && formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) =>
                        updateMessageStatus.mutate({ id: selectedMessage.id, status: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="text-foreground mt-2 whitespace-pre-wrap bg-secondary/50 p-4 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => deleteMessage.mutate(selectedMessage.id)}
                  disabled={deleteMessage.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;