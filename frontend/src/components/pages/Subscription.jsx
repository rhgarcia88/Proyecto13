import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import Skeleton from "@/components/ui/skeleton";
import { CalendarIcon, CreditCardIcon, TagIcon, ClockIcon, FileText, ChevronLeftIcon, BellIcon, TrashIcon } from "lucide-react";
import Header from "../ui/header";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getBaseUrl } from '../../utils';

const SubscriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminderActive, setReminderActive] = useState(false);
  const [reminderDays, setReminderDays] = useState(3); // Predeterminado: 3 días antes
  const [updatingReminder, setUpdatingReminder] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Obtener usuario del localStorage para extraer la moneda
  const localUser = JSON.parse(localStorage.getItem("user"));
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    MXN: "$",
  };
  const symbol = currencySymbols[localUser.currency] || localUser.currency;

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/v1/subscriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setSubscriptionData(data);
        setReminderActive(data.subscription.reminderSettings.isActive);
        
        // Establecer días de recordatorio si están disponibles
        if (data.subscription.reminderSettings.daysBefore) {
          setReminderDays(data.subscription.reminderSettings.daysBefore);
        }
      } catch (error) {
        console.error("Error fetching subscription detail:", error);
        toast({
          title: "Error",
          description: "Could not load subscription details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [id]);

  const handleToggleReminder = async () => {
    setUpdatingReminder(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/subscriptions/${id}/reminders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          isActive: !reminderActive,
          daysBefore: !reminderActive ? reminderDays : 0 
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update reminder");
      }
      
      const updatedData = await response.json();
      setReminderActive(updatedData.reminderSettings.isActive);
      
      toast({
        title: "Success",
        description: "Reminder settings updated.",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update reminder settings.",
        variant: "destructive",
      });
    } finally {
      setUpdatingReminder(false);
    }
  };

  const handleUpdateReminderDays = async (days) => {
    setReminderDays(days);
    if (!reminderActive) return; // No es necesario actualizar si los recordatorios están desactivados
    
    setUpdatingReminder(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/subscriptions/${id}/reminders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          isActive: reminderActive,
          daysBefore: days 
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update reminder days");
      }
      
      toast({
        title: "Success",
        description: `You will be reminded ${days} days before renewal.`,
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update reminder days.",
        variant: "destructive",
      });
    } finally {
      setUpdatingReminder(false);
    }
  };

  const handleDeleteSubscription = async () => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }
      toast({
        title: "Deleted",
        description: "Subscription has been deleted.",
        variant: "destructive",
      });
      // Navegar a dashboard o lista de suscripciones después de eliminar
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not delete subscription.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-6 space-y-6">
          <Button onClick={() => navigate(-1)} className="mb-4" variant="ghost">
            <ChevronLeftIcon className="h-4 w-4 mr-2" /> Back
          </Button>
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-2/5" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-3/5" />
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!subscriptionData) return <div className="container mx-auto p-6 text-center">Error loading subscription data.</div>;

  const { subscription, stats } = subscriptionData;

  // Calcular días hasta la próxima renovación
  const nextRenewalDate = new Date(subscription.nextRenewalDate);
  const today = new Date();
  const daysUntilRenewal = Math.ceil((nextRenewalDate - today) / (1000 * 60 * 60 * 24));
  
  // Determinar el color del estado de renovación
  let renewalStatusColor = "text-green-600";
  if (daysUntilRenewal <= 3) {
    renewalStatusColor = "text-red-600";
  } else if (daysUntilRenewal <= 7) {
    renewalStatusColor = "text-amber-600";
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6 max-w-5xl">
        <Button onClick={() => navigate(-1)} className="mb-4" variant="default">
          <ChevronLeftIcon className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* Encabezado de la Suscripción */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{subscription.name}</h1>
              <p className="text-lg text-muted-foreground text-gray-200">{subscription.category}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 md:mt-0 bg-primary-50 p-3 rounded-lg">
            <p className="text-lg font-semibold text-white">{symbol}{subscription.cost}</p>
            <p className="text-sm text-muted-foreground">{subscription.renewalFrequency}</p>
          </div>
        </div>
        
        {/* Banner de Estado de Renovación */}
        <div className={`py-3 px-4 rounded-lg flex items-center justify-between ${daysUntilRenewal <= 7 ? 'bg-amber-50' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <ClockIcon className={`h-5 w-5 mr-2 ${renewalStatusColor}`} />
            <span className={`font-medium ${renewalStatusColor}`}>
              {daysUntilRenewal === 0 ? 'Renews today' : 
               daysUntilRenewal < 0 ? 'Renewal overdue' :
               `Renews in ${daysUntilRenewal} day${daysUntilRenewal === 1 ? '' : 's'}`}
            </span>
          </div>
          <span className="text-sm">
            {new Date(subscription.nextRenewalDate).toLocaleDateString()}
          </span>
        </div>

        {/* Detalles de la Suscripción */}
        <Card className="shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={<CreditCardIcon className="h-4 w-4 text-primary" />}
                label="Cost" 
                value={`${symbol}${subscription.cost}`} 
              />
              <InfoRow 
                icon={<TagIcon className="h-4 w-4 text-primary" />}
                label="Category" 
                value={subscription.category} 
              />
              <InfoRow 
                icon={<ClockIcon className="h-4 w-4 text-primary" />}
                label="Renewal Frequency" 
                value={subscription.renewalFrequency} 
              />
              <InfoRow 
                icon={<CalendarIcon className="h-4 w-4 text-primary" />}
                label="Start Date" 
                value={new Date(subscription.startDate).toLocaleDateString()} 
              />
            </div>
            
            {subscription.notes && (
              <div className="mt-2 pt-2 border-t">
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mt-1 mr-2 text-primary" />
                  <div>
                    <p className="font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{subscription.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuración de Recordatorios */}
        <Card className="shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Reminder Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Renewal Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    {reminderActive 
                      ? `Next reminder: ${stats.reminder?.nextReminderDate ? new Date(stats.reminder.nextReminderDate).toLocaleDateString() : 'Pending'}`
                      : "Get notified before your subscription renews"}
                  </p>
                </div>
              </div>
              <Switch 
                checked={reminderActive} 
                onCheckedChange={handleToggleReminder} 
                disabled={updatingReminder}
              />
            </div>
            
            {/* Control deslizante para días de recordatorio */}
            {reminderActive && (
              <div className="p-3 rounded-lg border border-gray-100">
                <div className="mb-3">
                  <p className="font-medium text-sm">Remind me before renewal</p>
                  <p className="text-sm text-muted-foreground">
                    You'll be notified {reminderDays} days before your subscription renews
                  </p>
                </div>
                <div className="px-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>1 day</span>
                    <span>7 days</span>
                    <span>14 days</span>
                  </div>
                  <Slider
                    value={[reminderDays]}
                    min={1}
                    max={14}
                    step={1}
                    disabled={updatingReminder}
                    onValueChange={(values) => setReminderDays(values[0])}
                    onValueCommit={(values) => handleUpdateReminderDays(values[0])}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análisis de Costos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Historial de Pagos */}
          <Card className="shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <MetricItem 
                  label="Total Paid" 
                  value={`${symbol}${stats.totalPaid}`} 
                  highlight
                />
                <MetricItem 
                  label="Total Payments" 
                  value={stats.totalPayments} 
                />
                <MetricItem 
                  label="Avg. Cost per Payment" 
                  value={`${symbol}${stats.averageCostPerPayment}`} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Proyecciones de Costos */}
          <Card className="shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Cost Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.averageMonthlyCost && (
                  <MetricItem 
                    label="Monthly Average" 
                    value={`${symbol}${stats.averageMonthlyCost}`} 
                  />
                )}
                {stats.annualProjectedCost && (
                  <MetricItem 
                    label="Yearly Projection" 
                    value={`${symbol}${stats.annualProjectedCost}`} 
                    highlight
                  />
                )}
                {stats.costTrend && (
                  <MetricItem 
                    label="Cost Trend" 
                    value={stats.costTrend} 
                    trend={stats.costTrend.toLowerCase().includes('increase') ? 'up' : 'down'}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparación */}
        {stats.costComparison && (
          <Card className="shadow-sm border-none bg-gray-50">
            <CardContent className="py-4">
              <p className="text-sm text-center">{stats.costComparison}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-bold">Confirm Deletion</DialogTitle>
            <DialogDescription className="italic text-sm mb-2">
              Are you sure you want to delete this subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubscription}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Componente auxiliar para renderizar pares de etiqueta-valor con iconos de manera consistente
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon && <div className="mr-2">{icon}</div>}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

// Componente auxiliar para métricas con resaltado y tendencias opcionales
const MetricItem = ({ label, value, highlight = false, trend = null }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`font-medium ${highlight ? 'text-lg text-primary' : ''}`}>
      {value}
      {trend && (
        <span className={`ml-1 text-xs ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </span>
  </div>
);

export default SubscriptionDetail;