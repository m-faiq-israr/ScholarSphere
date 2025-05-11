import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AffiliationSelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="!bg-[rgb(0,0,0,0.07)] shadow-none !border-none rounded-xl font-outfit focus:ring-0 focus:outline-none focus:border-none">
        <SelectValue placeholder="Select affiliation type" />
      </SelectTrigger>
      <SelectContent className="font-outfit shadow-none text-sm md:text-base text-heading-1 rounded-xl">
        <SelectItem value="university or college">University / College</SelectItem>
        <SelectItem value="independent research institute">Independent Research Institute</SelectItem>
        <SelectItem value="government research lab">Government Research Lab</SelectItem>
        <SelectItem value="non-profit organization">Non-profit Organization</SelectItem>
        <SelectItem value="for-profit company">For-profit Company</SelectItem>
        <SelectItem value="no affiliation">No Affiliation / Independent</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default AffiliationSelect
