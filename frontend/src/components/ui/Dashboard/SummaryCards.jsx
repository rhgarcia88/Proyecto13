import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const SummaryCards = ({
  totalSubscriptions,
  totalMonthlyCost,
  averageCostPerSubscription,
  isPremium,
  symbol,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-t from-black to-red-700 rounded-xl">
      {/* Active Subscriptions */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{totalSubscriptions}</p>
        </CardContent>
      </Card>

      {/* Total Monthly Cost */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Total Monthly Cost</h2>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">
            {!isPremium ? (
              <span className="blur-lg">{symbol}Hidden</span>
            ) : (
              `${symbol}${totalMonthlyCost}`
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

      {/* Average Cost per Subscription */}
      <Card className="bg-gray text-white border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold">Average Cost per Subscription</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {!isPremium ? (
              <span className="blur-lg">{symbol}Hidden</span>
            ) : (
              `${symbol}${averageCostPerSubscription}`
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
  );
};

export default SummaryCards;
