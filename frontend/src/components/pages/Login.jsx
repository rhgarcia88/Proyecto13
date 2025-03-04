import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; // Asegúrate de la ruta correcta

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userWithoutPassword));

     
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
        variant: "success",
        duration:2000,
        className: "bg-green-500"
      });

      navigate("/dashboard");
    } catch (err) {
      // Toast de "error"
      toast({
        title: "Login Failed",
        description: "Review your credentials",
        variant: "destructive", 
        duration:2000
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent">
      <Link to={"/"} className="absolute z-10 top-2 w-64 cursor-pointer">
        <img src="/longLogo.png" alt="Logo SmartySub" className="" />
      </Link>
      <video
        className="absolute inset-0 object-cover w-full h-full -z-1"
        src="/vid/login.mp4"
        autoPlay
        loop
        muted
      ></video>
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
          Don't have an account?{" "}
          <Link to="/register" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
      <h4 className="absolute bottom-4 z-10 text-white">
        Made by{" "}
        <a
          href="https://x.com/JustHunterDev"
          target="blank"
          className="text-red-600 font-semibold"
        >
          @justhunterdev
        </a>
      </h4>
    </div>
  );
};

export default Login;
