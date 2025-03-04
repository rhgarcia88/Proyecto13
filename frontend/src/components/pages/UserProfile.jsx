import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Header from "../ui/header";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [currencies, setCurrencies] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch("http://localhost:3000/api/v1/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await userResponse.json();
        setUser(userData);

        const currenciesResponse = await fetch("http://localhost:3000/api/v1/users/currencies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const currenciesData = await currenciesResponse.json();
        setCurrencies(currenciesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

    // Función para actualizar la moneda del usuario
    const handleCurrencyChange = async (currencyCode) => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/users/setCurrency", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currency: currencyCode }),
        });
        if (!response.ok) {
          throw new Error("Failed to update currency");
        }
        const updatedUser = await response.json();
        // Actualiza el estado y el localStorage
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
        
      }
    };

  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col items-center justify-center p-2 space-y-2">
    
      <h1 className="text-3xl font-bold mb-4 text-white">User Profile</h1>
      {user ? (
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <Input value={user.userName} disabled className="mt-1" />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input value={user.email} disabled className="mt-1" />
            </div>
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <Select
  onValueChange={handleCurrencyChange}
  defaultValue={user.currency} // Se asume que esto es el código de la moneda, por ejemplo, "USD"
>
  <SelectTrigger>
    <SelectValue placeholder="Select a currency" />
  </SelectTrigger>
  <SelectContent>
    {currencies.map((currency) => (
      <SelectItem key={currency.code} value={currency.code}>
        {currency.symbol} - {currency.code}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            </div>
            {/* Premium Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Premium Status</label>
              <Input
                value={
                  user.isPremium 
                    ? `Yes (Expires: ${new Date(user.premiumExpiresAt).toLocaleDateString()})`
                    : "No"
                }
                disabled
                className="mt-1"
              />
            </div>
            {/* Botón de Cerrar Sesión */}
            <div>
              <Button
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="mt-4 w-full"
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
    </>
  );
};

export default UserProfile;
