import { CreditCard, Check, Clock, AlertCircle, Download, DollarSign, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface DuesPaymentScreenProps {
  onBack: () => void;
  paymentsEnabled?: boolean; // Can be toggled by organization
}

interface Payment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  method: string;
}

export function DuesPaymentScreen({ onBack, paymentsEnabled = true }: DuesPaymentScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"dues" | "history">("dues");

  const upcomingDues: Payment[] = [
    {
      id: "d1",
      description: "Winter Season Dues 2024-25",
      amount: 150.0,
      dueDate: "Jan 15, 2025",
      status: "pending",
    },
    {
      id: "d2",
      description: "Tournament Entry Fee",
      amount: 50.0,
      dueDate: "Dec 30, 2024",
      status: "pending",
    },
  ];

  const paidDues: Payment[] = [
    {
      id: "d3",
      description: "Fall Season Dues 2024",
      amount: 150.0,
      dueDate: "Oct 1, 2024",
      status: "paid",
      paidDate: "Sep 28, 2024",
    },
    {
      id: "d4",
      description: "League Registration Fee",
      amount: 75.0,
      dueDate: "Sep 1, 2024",
      status: "paid",
      paidDate: "Aug 25, 2024",
    },
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: "h1",
      date: "Sep 28, 2024",
      description: "Fall Season Dues 2024",
      amount: 150.0,
      method: "Credit Card •••• 4242",
    },
    {
      id: "h2",
      date: "Aug 25, 2024",
      description: "League Registration Fee",
      amount: 75.0,
      method: "Credit Card •••• 4242",
    },
    {
      id: "h3",
      date: "Jun 15, 2024",
      description: "Summer Season Dues 2024",
      amount: 150.0,
      method: "Credit Card •••• 4242",
    },
  ];

  const totalDue = upcomingDues.reduce((sum, due) => sum + due.amount, 0);
  const totalPaid = [...paidDues, ...paymentHistory].reduce((sum, item) => sum + item.amount, 0);

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "overdue": return "bg-red-100 text-red-700";
    }
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid": return <Check className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertCircle className="w-4 h-4" />;
    }
  };

  // If payments are disabled by organization
  if (!paymentsEnabled) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="text-[var(--color-text-secondary)]">
              ← Back
            </button>
          </div>
          <h1>Payments</h1>
        </div>
        <div className="p-4">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 text-center">
            <CreditCard className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4" />
            <h2 className="mb-2">Payments Not Available</h2>
            <p className="text-[var(--color-text-secondary)]">
              Your organization has not enabled online payments. Please contact your league administrator for payment information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/90">
            ← Back
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Payments & Dues</h1>
            <p className="text-sm text-white/80">Manage your payments</p>
          </div>
          <DollarSign className="w-8 h-8 text-white" />
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-xs text-white/80 mb-1">Amount Due</div>
            <div className="text-2xl font-bold text-white">
              ${totalDue.toFixed(2)}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-xs text-white/80 mb-1">Total Paid</div>
            <div className="text-2xl font-bold text-white">
              ${totalPaid.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-[var(--color-bg-elevated)] rounded-xl p-1">
          <button
            onClick={() => setSelectedTab("dues")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "dues"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Upcoming Dues
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedTab === "history"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Payment History
          </button>
        </div>

        {selectedTab === "dues" ? (
          <>
            {/* Upcoming Payments */}
            {totalDue > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-amber-900 mb-1">
                      You have pending payments
                    </h3>
                    <p className="text-sm text-amber-700 mb-3">
                      Total amount due: ${totalDue.toFixed(2)}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => toast.success("Payment processed successfully!")}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay All Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Unpaid Dues */}
            {upcomingDues.length > 0 && (
              <div className="space-y-3">
                <h2>Pending Dues</h2>
                {upcomingDues.map((due, index) => (
                  <motion.div
                    key={due.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{due.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                          <Calendar className="w-4 h-4" />
                          Due {due.dueDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${due.amount.toFixed(2)}
                        </div>
                        <Badge className={`${getStatusColor(due.status)} text-xs mt-1`}>
                          {getStatusIcon(due.status)}
                          <span className="ml-1 capitalize">{due.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => toast.success("Payment processed successfully!")}
                    >
                      Pay Now
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paid Dues */}
            {paidDues.length > 0 && (
              <div className="space-y-3">
                <h2>Paid Dues</h2>
                {paidDues.map((due, index) => (
                  <motion.div
                    key={due.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{due.description}</h3>
                        <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                          Paid on {due.paidDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${due.amount.toFixed(2)}
                        </div>
                        <Badge className={`${getStatusColor(due.status)} text-xs mt-1`}>
                          {getStatusIcon(due.status)}
                          <span className="ml-1">Paid</span>
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Payment History */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2>Transaction History</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Receipt downloaded!")}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
            {paymentHistory.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--color-bg-elevated)] rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{payment.description}</h3>
                    <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                      {payment.date}
                    </div>
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      {payment.method}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${payment.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => toast.success("Receipt downloaded!")}
                      className="text-xs text-[var(--color-primary)] hover:underline mt-1"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Payment Method Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1 text-blue-900">
                Saved Payment Method
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Visa •••• 4242
              </p>
              <button
                onClick={() => toast.info("Payment method update coming soon!")}
                className="text-sm text-blue-600 hover:underline"
              >
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
