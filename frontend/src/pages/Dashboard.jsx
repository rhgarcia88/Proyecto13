import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import Header from "@/components/ui/header";
import UpcomingRenewalsTable from "@/components/ui/Dashboard/UpcomingRenewalsTable";
import PremiumStatsGrid from "@/components/ui/Dashboard/PremiumStatsGrid";
import NewSubscriptionModal from "@/components/ui/Dashboard/NewSubscriptionModal";
import SummaryCards from "@/components/ui/Dashboard/SummaryCards";
import FloatingAddButton from "@/components/ui/Dashboard/FloatingAddButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State hooks
  const [data, setData] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    cost: "",
    startDate: "",
    renewalFrequency: "monthly",
    category: "Other",
    notes: "",
    reminderSettings: { isActive: true, daysBefore: "1" },
  });

  // Fetch dashboard stats once on mount
  useEffect(() => {
    console.log("[Dashboard] stats effect");
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser) return navigate("/login");

    const fetchStats = async () => {
      console.log("[Dashboard] calling /stats");
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/subscriptions/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();
        console.log("[Dashboard] stats received", result);
        setData(result);
        setIsPremium(localUser.isPremium || false);
      } catch (err) {
        console.error("[Dashboard] stats error", err);
        toast({ title: "Error", description: "Could not load stats.", variant: "destructive" });
      }
    };

    fetchStats();
  }, [navigate, toast]);

  // Fetch subscriptions once on mount
  useEffect(() => {
    console.log("[Dashboard] subscriptions effect");
    const fetchSubscriptions = async () => {
      console.log("[Dashboard] calling /subscriptions");
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/subscriptions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const subs = await res.json();
        console.log("[Dashboard] subscriptions received", subs);
        setSubscriptions(subs);
      } catch (err) {
        console.error("[Dashboard] subscriptions error", err);
        toast({ title: "Error", description: "Could not load subscriptions.", variant: "destructive" });
      }
    };

    fetchSubscriptions();
  }, [toast]);

  // Show loading while data is null
  if (!data || !subscriptions) return <p>Loading...</p>;

  // Sort subscriptions by next renewal date
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate)
  );

  // Determine premium-only values with fallback
  const defaultSub = { name: "Hidden", cost: "Hidden" };
  const mostExpensiveSub = isPremium
    ? (data.mostExpensiveSubscription || defaultSub)
    : defaultSub;
  const cheapestSub = isPremium
    ? (data.cheapestSubscription || defaultSub)
    : defaultSub;
  const mostExpMonth = isPremium
    ? (data.mostExpensiveMonth || { month: "Hidden", totalSpent: "Hidden" })
    : { month: "Hidden", totalSpent: "Hidden" };

  // Handle form input changes for new subscription
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "daysBefore") {
      setNewSub((prev) => ({
        ...prev,
        reminderSettings: { ...prev.reminderSettings, daysBefore: value },
      }));
    } else if (name === "isActive") {
      setNewSub((prev) => ({
        ...prev,
        reminderSettings: { ...prev.reminderSettings, isActive: checked },
      }));
    } else {
      setNewSub((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit handler for adding a subscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[Dashboard] submit new subscription", newSub);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newSub,
          cost: parseFloat(newSub.cost),
          reminderSettings: {
            ...newSub.reminderSettings,
            daysBefore: newSub.reminderSettings.isActive
              ? parseInt(newSub.reminderSettings.daysBefore)
              : 0,
          },
        }),
      });
      if (!res.ok) throw new Error("Error adding subscription");
      const added = await res.json();
      console.log("[Dashboard] subscription added", added);
      setSubscriptions((prev) => [...prev, added]);
      toast({ title: "Done!", description: "Subscription added.", variant: "success" });
      setIsModalOpen(false);
      setNewSub({
        name: "",
        cost: "",
        startDate: "",
        renewalFrequency: "monthly",
        category: "Other",
        notes: "",
        reminderSettings: { isActive: true, daysBefore: "1" },
      });
    } catch (err) {
      console.error("[Dashboard] submit error", err);
      toast({ title: "Error", description: "Could not create subscription.", variant: "destructive" });
    }
  };

  // Currency symbol mapping
  const localUser = JSON.parse(localStorage.getItem("user"));
  const currencySymbols = { USD: "$", EUR: "€", GBP: "£", MXN: "$" };
  const symbol = currencySymbols[localUser?.currency] || localUser?.currency;

  return (
    <>
      <Header />

      {subscriptions.length > 0 ? (
        <div className="container mx-auto p-6">
          <SummaryCards
            totalSubscriptions={data.totalSubscriptions}
            totalMonthlyCost={data.totalMonthlyCost}
            averageCostPerSubscription={data.averageCostPerSubscription}
            isPremium={isPremium}
            symbol={symbol}
          />

          <UpcomingRenewalsTable
            sortedSubscriptions={sortedSubscriptions}
            symbol={symbol}
            onRowClick={(id) => navigate(`/subscriptions/${id}`)}
          />

          <PremiumStatsGrid
            mostExpensiveSub={mostExpensiveSub}
            cheapestSub={cheapestSub}
            mostExpensiveMonth={mostExpMonth}
            categories={data.categories}
            isPremium={isPremium}
            symbol={symbol}
          />
        </div>
      ) : (
        /* No subscriptions view */
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-3xl font-bold text-gray-800">Create your first sub!</h2>
            <p className="mt-4 text-gray-600">Start by adding a subscription.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-6 rounded-full p-4 shadow-lg bg-redVar text-white">
              Add a new Sub
            </Button>
          </div>
        </div>
      )}

      <FloatingAddButton onClick={() => setIsModalOpen(true)} />

      <NewSubscriptionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        newSub={newSub}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Dashboard;
