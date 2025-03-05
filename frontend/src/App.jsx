// App.jsx (versión Landing integrada)
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import UserProfile from "./components/pages/UserProfile";
import Dashboard from "./components/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { HiOutlineDeviceMobile, HiOutlineClock, HiOutlineChartSquareBar } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import Header from "./components/ui/header";
import SubscriptionDetail from "./components/pages/Subscription";

function App() {
  // Variants para animaciones con Framer Motion
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-gray-800 font-poppins">
      {/* Componente Toaster de ShadCN */}
      <Toaster />
      {/* Definición de rutas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* La landing se mostrará en la raíz */}
        <Route
          path="/"
          element={
            <>
              {/* Navbar */}
              <header className="flex justify-center lg:justify-between items-center p-6 px-20">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                  <img src="./logo-long.png" className="w-40" alt="Logo" />
                </motion.div>
                <nav className="space-x-6 lg:block sm:hidden">
                  <motion.a
                    href="#hello"
                    className="text-secondary hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    Hello
                  </motion.a>
                  <motion.a
                    href="#features"
                    className="text-secondary hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    Features
                  </motion.a>
                  <motion.a
                    href="#faqs"
                    className="text-secondary hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    FAQs
                  </motion.a>
                  <a href="/login">
                    <motion.button
                      className="mt-3 px-3 py-3 bg-primary text-secondary font-small rounded-md hover:bg-red-800 transition duration-300 ease-in-out"
                      whileHover={{ scale: 1.05 }}
                    >
                      Let's go!
                    </motion.button>
                  </a>
                </nav>
              </header>

              {/* Hero Section */}
              <section className="flex flex-col md:flex-row items-center text-center md:text-left md:py-16 px-10 bg-background" id="hello">
                <motion.div
                  className="w-full md:w-2/3 flex flex-col items-center md:items-start md:pl-12"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl font-semibold text-primary mb-4">
                    Manage All Your Subscriptions in One Place
                  </h1>
                  <p className="text-sm text-secondary max-w-lg font-light">
                    With SmartySub, you can keep track of every subscription, receive renewal reminders, and manage your monthly expenses, all in one simple dashboard.
                  </p>
                  <div className="flex items-baseline gap-5">
                    <a href="/login">
                      <motion.button
                        className="mt-6 px-6 py-3 bg-primary text-secondary font-medium rounded-md hover:bg-red-800 transition duration-300 ease-in-out"
                        whileHover={{ scale: 1.05 }}
                      >
                        Join SmartySub
                      </motion.button>
                    </a>
                    <p className="text-white mt-2 text-xs">+500 people joined already!</p>
                  </div>
                </motion.div>
                <motion.div
                  className="w-full items-center lg:w-1/3 flex justify-end mt-10 md:mt-0"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <img src="./feature-1.png" alt="Feature illustration" className="w-full max-w-xs md:max-w-md lg:max-w-lg rounded-lg object-right" />
                </motion.div>
              </section>

              {/* Features Section */}
              <section className="py-6 px-16" id="features">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div className="flex flex-col items-center" variants={fadeInUp}>
                    <HiOutlineDeviceMobile className="text-secondary text-5xl mb-4" />
                    <h3 className="font-semibold text-xl text-primary mb-2">
                      Centralize All Your Subscriptions in One Dashboard
                    </h3>
                    <p className="text-secondary text-sm">
                      Add and manage all your subscriptions in one organized dashboard.
                    </p>
                  </motion.div>
                  <motion.div className="flex flex-col items-center" variants={fadeInUp}>
                    <HiOutlineClock className="text-secondary text-5xl mb-4" />
                    <h3 className="font-semibold text-xl text-primary mb-2">
                      Never Miss a Renewal with Smart Reminders
                    </h3>
                    <p className="text-secondary text-sm">
                      Receive timely reminders before your subscriptions renew.
                    </p>
                  </motion.div>
                  <motion.div className="flex flex-col items-center" variants={fadeInUp}>
                    <HiOutlineChartSquareBar className="text-secondary text-5xl mb-4" />
                    <h3 className="font-semibold text-xl text-primary mb-2">
                      Monitor and Optimize Your Subscription Spending
                    </h3>
                    <p className="text-secondary text-sm">
                      Get insights into your spending on subscriptions.
                    </p>
                  </motion.div>
                </motion.div>
              </section>

              {/* Call to Action Section */}
              <section className="flex flex-col md:flex-row items-center text-center md:text-left py-16 px-10 bg-background" id="lego">
                <motion.div
                  className="md:w-1/2"
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-semibold text-primary mb-4 ml-16 text-left">
                    Take Control of Your Subscriptions
                  </h2>
                  <p className="text-md text-secondary max-w-3xl mx-auto mb-8 text-left">
                    Manage all your subscriptions with ease and never get surprised by unexpected charges.
                  </p>
                  <ul className="text-secondary list-disc list-inside mx-auto max-w-2xl text-left">
                    <li>Centralize your subscriptions</li>
                    <li>Set up renewal reminders</li>
                    <li>Analyze your spending</li>
                    <li>Cancel unused subscriptions</li>
                  </ul>
                </motion.div>
                <motion.div
                  className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <img src="./feature-2.png" alt="Feature illustration" className="w-full max-w-xs md:w-1/2 lg:max-w-lg rounded-lg" />
                </motion.div>
              </section>

              {/* FAQ Section */}
              <section className="w-full flex flex-col items-center" id="faqs">
                <motion.h2
                  className="text-3xl font-semibold text-secondary mb-4 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  FAQ
                </motion.h2>
                <motion.p
                  className="text-primary italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Solve all your doubts here
                </motion.p>
                <div className="w-1/2 justify-center mt-8 text-left">
                  <Accordion type="multiple" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-primary">
                        How does SmartySub work?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        SmartySub lets you add and manage all your subscriptions with reminders.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-primary">
                        Can I add custom subscriptions?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        Yes, you can add any subscription manually.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-primary">
                        Will I receive renewal notifications?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        Yes, you'll get reminders before each renewal.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-primary">
                        Is it safe to store my information?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        We use advanced encryption to protect your data.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-primary">
                        Can I manage shared subscriptions?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        We are working on this feature. Stay tuned!
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-primary">
                        How can I contact support?
                      </AccordionTrigger>
                      <AccordionContent className="text-secondary">
                        Contact us at hola@garzziadev.com or via Twitter @JustHunterDev.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </section>

              {/* Signup Section */}
              <section className="flex flex-col items-center text-center py-16 px-10 bg-background" id="signup">
                <motion.h2
                  className="text-3xl font-semibold text-secondary mb-1 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Don't miss the chance!
                </motion.h2>
                <motion.h4
                  className="text-xl font-light text-white mb-10 text-center px-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Get early access to SmartySub, news, and tips to improve your finances.
                </motion.h4>
                <div className="flex flex-col items-center bg-form">
                  <motion.div
                    className="w-full md:w-1/2"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                  
                  </motion.div>
                  <motion.div
                    className="w-full md:w-1/2 flex items-center"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                  
                  </motion.div>
                </div>
              </section>
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
