import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DashboardDonut } from "../ui/dashboardDonut";
import Header from "../ui/header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { getBaseUrl } from '../../utils';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    cost: "",
    startDate: "",
    renewalFrequency: "monthly", // Opciones: daily, weekly, monthly, yearly
    category: "Other", // Opciones: Entertainment, Work, Utilities, Other
    notes: "",
    reminderSettings: {
      isActive: true,
      daysBefore: "1", // Opciones: 1, 2, 3, 5, 10, 15
    },
  });

  const navigate = useNavigate();

  // Obtenemos el usuario del localStorage para extraer su currency
  const localUser = JSON.parse(localStorage.getItem("user"));
  // Mapeo de códigos de moneda a símbolos
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    MXN: "$", 
  
  };
  // Si el usuario tiene definido un currency, se usa el símbolo; de lo contrario, se muestra el código
  const symbol = currencySymbols[localUser.currency] || localUser.currency;

  useEffect(() => {
    // Si no hay usuario en memoria, redirige a "/login"
    if (!localUser) {
      navigate("/login");
    }

    async function fetchData() {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/v1/subscriptions/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        // Guardamos los datos tal cual
        setData(result);

        setCurrency(localUser.currency);
        setIsPremium(localUser?.isPremium || false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    fetchData();
  }, [navigate, localUser]);

  // Fetch de todas las suscripciones activas del usuario
  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/v1/subscriptions/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const subs = await response.json();
        setSubscriptions(subs);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    }
    fetchSubscriptions();
  }, []);

  if (!data || !subscriptions) return <p>Loading...</p>;

  // Ordenar las suscripciones por proximidad de fecha (la más cercana primero)
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate)
  );

  // Valores por defecto para usuarios no premium o si faltan datos
  const defaultSub = { name: "Hidden", cost: "Hidden" };
  const mostExpensiveSub = !isPremium
    ? defaultSub
    : data.mostExpensiveSubscription || defaultSub;
  const cheapestSub = !isPremium
    ? defaultSub
    : data.cheapestSubscription || defaultSub;
  const mostExpensiveMonth = !isPremium
    ? { month: "Hidden", totalSpent: "Hidden" }
    : data.mostExpensiveMonth || { month: "Hidden", totalSpent: "Hidden" };

  // Variables para datos sensibles
  const totalMonthlyCostText = !isPremium ? "Hidden" : data.totalMonthlyCost;
  const averageCostText = !isPremium ? "Hidden" : data.averageCostPerSubscription;

  // Manejo de cambios en el formulario de nueva suscripción
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  // Envío del formulario para agregar una nueva suscripción
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/subscriptions`, {
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
              ? parseInt(newSub.reminderSettings.daysBefore, 10)
              : 0,
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Error adding subscription");
      }
      const addedSub = await response.json();
      // Actualiza el estado de suscripciones agregando la nueva
      setSubscriptions((prev) => [...prev, addedSub]);
      // Muestra el toast de éxito (usando el toast de shadcn)
      toast({
        title: "Subscription created successfully!",
        description: "Your new subscription has been added.",
        variant: "success",
      });
      // Cierra el modal y reinicia el formulario
      setIsModalOpen(false);
      setNewSub({
        name: "",
        cost: "",
        startDate: "",
        renewalFrequency: "monthly",
        category: "Other",
        notes: "",
        reminderSettings: {
          isActive: true,
          daysBefore: "1",
        },
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create subscription.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <Header />
    {subscriptions && subscriptions.length > 0? 
    <>
    <div className="container mx-auto p-6">
        {/* Sección de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-t from-black to-red-700 rounded-xl">
          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Active Subscriptions</h2>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{data.totalSubscriptions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Total Monthly Cost</h2>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {!isPremium ? (
                  <span className="blur-lg">{symbol}Hidden</span>
                ) : (
                  `${symbol}${data.totalMonthlyCost}`
                )}
              </p>
              {!isPremium && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" className="mt-2">
                      Upgrade to Premium
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    Unlock detailed insights and maximize your subscription management!
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Average Cost per Subscription</h2>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {!isPremium ? (
                  <span className="blur-lg">{symbol}Hidden</span>
                ) : (
                  `${symbol}${data.averageCostPerSubscription}`
                )}
              </p>
              {!isPremium && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" className="mt-2">
                      Upgrade to Premium
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    Unlock detailed insights and maximize your subscription management!
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Próximas renovaciones: suscripciones activas ordenadas por fecha */}
        <div className="mt-8 p-8 rounded-xl shadow-xl bg-gray text-white">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Renewals</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-bold">Subscription</TableCell>
                <TableCell className="font-bold">Price</TableCell>
                <TableCell className="font-bold">Next Renewal</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubscriptions.map((sub) => (
                <TableRow
                  key={sub._id}
                  onClick={() => navigate(`/subscriptions/${sub._id}`)}
                  className="cursor-pointer hover:bg-gray-700"
                >
                  <TableCell className="font-light">{sub.name}</TableCell>
                  <TableCell className="font-light">
                    {symbol}{parseFloat(sub.cost).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-light">
                    {new Date(sub.nextRenewalDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Estadísticas Premium */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Most Expensive Subscription</h2>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {!isPremium ? (
                  <span className="blur-md">
                    {defaultSub.name} - {defaultSub.cost}
                  </span>
                ) : (
                  `${mostExpensiveSub.name} - ${symbol}${mostExpensiveSub.cost}`
                )}
              </p>
              {!isPremium && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" className="mt-2">
                      Upgrade to Premium
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    Unlock detailed insights and maximize your subscription management!
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Cheapest Subscription</h2>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {!isPremium ? (
                  <span className="blur-md">
                    {defaultSub.name} - {defaultSub.cost}
                  </span>
                ) : (
                  `${cheapestSub.name} - ${symbol}${cheapestSub.cost}`
                )}
              </p>
              {!isPremium && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" className="mt-2">
                      Upgrade to Premium
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    Unlock detailed insights and maximize your subscription management!
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Categories</h2>
            </CardHeader>
            <CardContent>
              <DashboardDonut categories={data.categories} />
              <Card className="p-4 mt-2">
              {Object.entries(data.categories || {}).map(([category, count]) => (
              <p key={category} className="text-lg">
                {category}: {count}
              </p>
            ))}
              </Card>
            </CardContent>
          </Card>

          <Card className="bg-gray text-white border-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Most Expensive Month</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-3/4">
              <div className={`flex flex-col items-center justify-center text-center ${!isPremium ? "blur-sm" : ""}`}>
                <p className="text-4xl">
                  {!isPremium ? "Hidden" : mostExpensiveMonth.month}
                </p>
                <p className="text-xl">
                  {!isPremium ? "Hidden" : `${symbol}${mostExpensiveMonth.totalSpent}`}
                </p>
              </div>
              {!isPremium && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="destructive" className="mt-2">
                      Upgrade to Premium
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    Unlock detailed insights and maximize your subscription management!
                  </PopoverContent>
                </Popover>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
   {/* Boton para crear suscripción */}
     <Button
     className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg bg-redVar"
     onClick={() => setIsModalOpen(true)}
   >
     New Sub
   </Button>

   
    </>
    : <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
      <h2 className="text-3xl font-bold text-gray-800">
        Let's create your first sub!
      </h2>
      <p className="mt-4 text-gray-600">
        Get started by adding your first subscription.
      </p>
      <Button
        className="mt-6 rounded-full p-4 shadow-lg bg-redVar text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Add a new Sub
      </Button>
    </div>
  </div>}
      
      

     

      {/* Modal para agregar nueva suscripción */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-bold">Add New Subscription</DialogTitle>
            <DialogDescription className="italic text-sm mb-2">
              Fill out the form below to add a new subscription.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newSub.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                step="0.01"
                name="cost"
                value={newSub.cost}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
               Last Renewal
              </label>
              <input
                type="date"
                name="startDate"
                value={newSub.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Renewal Frequency
              </label>
              <select
                name="renewalFrequency"
                value={newSub.renewalFrequency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={newSub.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Work">Work</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={newSub.notes}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700">
                Reminder Active
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={newSub.reminderSettings.isActive}
                onChange={handleChange}
                className="ml-2"
              />
            </div>
            {newSub.reminderSettings.isActive && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Days Before
                </label>
                <select
                  name="daysBefore"
                  value={newSub.reminderSettings.daysBefore}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Subscription</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
