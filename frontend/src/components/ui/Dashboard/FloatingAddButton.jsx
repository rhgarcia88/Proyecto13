import React from "react";
import { Button } from "@/components/ui/button";

const FloatingAddButton = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg bg-redVar text-white"
      onClick={onClick}
    >
      New Sub
    </Button>
  );
};

export default FloatingAddButton;
