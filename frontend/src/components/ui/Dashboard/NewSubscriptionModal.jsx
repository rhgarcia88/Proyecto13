import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewSubscriptionModal = ({
  isOpen,
  onOpenChange,
  newSub,
  onChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Subscription</DialogTitle>
          <DialogDescription className="italic text-sm mb-2">
            Fill out the form below to add a new subscription.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              name="name"
              value={newSub.name}
              onChange={onChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <Input
              type="number"
              step="0.01"
              name="cost"
              value={newSub.cost}
              onChange={onChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Renewal</label>
            <Input
              type="date"
              name="startDate"
              value={newSub.startDate}
              onChange={onChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Renewal Frequency</label>
            <select
              name="renewalFrequency"
              value={newSub.renewalFrequency}
              onChange={onChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={newSub.category}
              onChange={onChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="Entertainment">Entertainment</option>
              <option value="Work">Work</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newSub.notes}
              onChange={onChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700">Reminder Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={newSub.reminderSettings.isActive}
              onChange={onChange}
              className="ml-2"
            />
          </div>
          {newSub.reminderSettings.isActive && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Days Before</label>
              <select
                name="daysBefore"
                value={newSub.reminderSettings.daysBefore}
                onChange={onChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSubscriptionModal;
