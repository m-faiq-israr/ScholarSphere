import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const EducationSelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="!bg-gray-200 shadow-none !border-none rounded-xl font-outfit focus:ring-0 focus:outline-none focus:border-none">
      <SelectValue placeholder="Select education level" />
    </SelectTrigger>
    <SelectContent className='font-outfit shadow-none text-heading-1 rounded-xl'>
      <SelectItem value="undergraduate student">Undergraduate Student</SelectItem>
      <SelectItem  value="graduate student">Graduate Student (Master's)</SelectItem>
      <SelectItem value="PhD student">PhD Student</SelectItem>
      <SelectItem value="early career researcher">Early Career Researcher</SelectItem>
      <SelectItem value="post doctoral fellow or researcher">Post-Doctoral Researcher</SelectItem>
      <SelectItem value="faculty or lecturer or professor">Faculty / Professor</SelectItem>
      <SelectItem value="independent researcher">Independent Researcher</SelectItem>
    </SelectContent>
  </Select>
  )
}

export default EducationSelect