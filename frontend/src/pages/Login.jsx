import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; 
import { getBaseUrl } from "../lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mapea el código de error de la API a un mensaje claro
        let message = data.error?.message || "Ups, algo salió mal. Inténtalo de nuevo.";

        switch (data.error?.code) {
          case "USER_NOT_FOUND":
            message = "No existe ninguna cuenta con ese email.";
            break;
          case "INVALID_PASSWORD":
            message = "La contraseña es incorrecta.";
            break;
          default:
            break;
        }

        toast({
          title: "Error al iniciar sesión",
          description: message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Éxito
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userWithoutPassword));

      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Redirigiendo a tu dashboard…",
        variant: "success",
        duration: 2000,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error de red",
        description: "No hemos podido conectar con el servidor. Revisa tu conexión.",
        variant: "destructive", 
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent">
      <Link to="/" className="absolute z-10 top-2 w-64 cursor-pointer">
        <img src="/longLogo.png" alt="Logo SmartySub" />
      </Link>
      <video
        className="absolute inset-0 object-cover w-full h-full -z-1"
        src="/vid/login.mp4"
        autoPlay
        loop
        muted
      />
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded-md shadow-lg z-10">
        <h2 className="text-2xl font-bold text-center">Log In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <User className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="text-sm text-center text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-primary">
            Regístrate
          </Link>
        </p>
      </div>
      <h4 className="absolute bottom-4 z-10 text-white">
        Made by{" "}
        <a
          href="https://x.com/JustHunterDev"
          target="_blank"
          className="text-red-600 font-semibold"
          rel="noreferrer"
        >
          @justhunterdev
        </a>
      </h4>
    </div>
  );
};

export default Login;
