// OpportunityStatusSelect.jsx or .tsx
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const OpportunityStatusSelect = ({ onChange, value, counts = {} }) => {
  return (
    <div className="w-52">
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="!bg-heading-1 w-full !text-white font-medium shadow-none !border-none rounded-xl font-outfit px-3 focus:ring-0 focus:outline-none focus:border-none ring-0 focus-visible:ring-0 data-[state=open]:ring-0">
          <SelectValue className="!text-white" />
        </SelectTrigger>
        <SelectContent className="font-outfit shadow-none text-heading-1 rounded-xl">
          <SelectItem value="all">All Grants ({counts.all || 0})</SelectItem>
          <SelectItem value="Open">Open Grants ({counts.open || 0})</SelectItem>
          <SelectItem value="Upcoming">Upcoming Grants ({counts.upcoming || 0})</SelectItem>
          <SelectItem value="forecasted">Forecasted Grants ({counts.forecasted || 0})</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


export default OpportunityStatusSelect
