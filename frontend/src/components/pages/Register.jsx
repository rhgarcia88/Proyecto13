import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
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
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }
      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message,
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
      {/* Background video */}
      <video
        className="absolute inset-0 object-cover w-full h-full -z-1"
        src="/vid/register.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Form container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded-md shadow-lg z-10">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
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
