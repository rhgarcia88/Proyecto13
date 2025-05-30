import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getBaseUrl } from "../lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Mapea el código de error del backend a un mensaje claro
        let message = data.error?.message || "Ups, algo salió mal. Inténtalo de nuevo.";
        switch (data.error?.code) {
          case "USER_ALREADY_EXISTS":
            message = "Ya existe un usuario con ese email o nombre de usuario.";
            break;
          case "REGISTER_FAILED":
            message = "No hemos podido crear tu cuenta. Vuelve a intentarlo más tarde.";
            break;
            
          default:
            break;
        }
        toast({
          title: "Error al registrarte",
          description: message,
          variant: "destructive",
        });
        return;
      }

      // Éxito
      toast({
        title: "¡Cuenta creada!",
        description: "Registro exitoso. Ahora puedes iniciar sesión.",
        variant: "success",
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Error de red",
        description: "No podemos conectar con el servidor. Revisa tu conexión.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-transparent z-11"
      style={{
        boxShadow:
          "inset 0px 10px 20px rgba(0, 0, 0, 0.2), inset 0px -20px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Link to="/" className="absolute z-10 top-2 w-64 cursor-pointer">
        <img src="/longLogo.png" alt="Logo SmartySub" />
      </Link>
      <video
        className="absolute inset-0 object-cover w-full h-full -z-1"
        src="/vid/register.mp4"
        autoPlay
        loop
        muted
      />

      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded-md shadow-lg z-10">
        <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              className="pl-10"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            <User className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              className="pl-10"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Mail className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              className="pl-10"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Confirm Password"
              className="pl-10"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Lock className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary">
            Inicia sesión
          </Link>
        </p>
      </div>
      <h4 className="absolute bottom-4 z-10 text-white">
        Made by{" "}
        <a
          href="https://x.com/JustHunterDev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 font-semibold"
        >
          @justhunterdev
        </a>
      </h4>
    </div>
  );
};

export default Register;
