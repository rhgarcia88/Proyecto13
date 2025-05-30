import React from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

const UpcomingRenewalsTable = ({ sortedSubscriptions, symbol, onRowClick }) => {
  return (
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
              onClick={() => onRowClick(sub._id)}
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
  );
};

export default UpcomingRenewalsTable;
