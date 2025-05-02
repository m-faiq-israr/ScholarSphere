// OpportunityStatusSelect.jsx or .tsx
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const OpportunityStatusSelect = ({ onChange }) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="!bg-heading-1 w-44 !text-white font-medium shadow-none !border-none rounded-xl font-outfit px-3 focus:ring-0 focus:outline-none focus:border-none ring-0 focus-visible:ring-0 data-[state=open]:ring-0">
        <SelectValue placeholder="Opportunity Status" className='!text-white' />
      </SelectTrigger>
      <SelectContent className='font-outfit shadow-none text-heading-1 rounded-xl'>
        <SelectItem value="all">All Grants</SelectItem>
        <SelectItem value="posted">Posted Grants</SelectItem>
        <SelectItem value="forecasted">Forecasted Grants</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default OpportunityStatusSelect
