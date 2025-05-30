import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DashboardDonut } from "@/components/ui/dashboardDonut";

const PremiumStatsGrid = ({
  mostExpensiveSub,
  cheapestSub,
  mostExpensiveMonth,
  categories,
  isPremium,
  symbol,
}) => {
  const defaultSub = { name: "Hidden", cost: "Hidden" };
  const safeCategories = categories || {};

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Most Expensive Subscription */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Most Expensive Subscription</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {!isPremium
              ? `${defaultSub.name} - ${defaultSub.cost}`
              : `${mostExpensiveSub.name} - ${symbol}${mostExpensiveSub.cost}`}
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

      {/* Cheapest Subscription */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Cheapest Subscription</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {!isPremium
              ? `${defaultSub.name} - ${defaultSub.cost}`
              : `${cheapestSub.name} - ${symbol}${cheapestSub.cost}`}
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

      {/* Categories */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Categories</h2>
        </CardHeader>
        <CardContent>
          <DashboardDonut categories={safeCategories} />
          <Card className="p-4 mt-2">
            {Object.entries(safeCategories).map(([category, count]) => (
              <p key={category} className="text-lg">
                {category}: {count}
              </p>
            ))}
          </Card>
        </CardContent>
      </Card>

      {/* Most Expensive Month */}
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
  );
};

export default PremiumStatsGrid;