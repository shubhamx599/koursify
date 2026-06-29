import { Checkbox } from '../../components/ui/checkbox.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import React, { useState } from 'react';

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "Mern Stack developer", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [sortBy, setSortBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handler for sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    // Pass both selectedCategories and sortBy to handleFilterChange
    handleFilterChange(selectedCategories, value);
  };

  // Handler for category change (checkbox toggle)
  const handleCategoryChange = (categoryID) => {
    setSelectedCategories((prevSelected) => {
      const newCategory = prevSelected.includes(categoryID)
        ? prevSelected.filter((id) => id !== categoryID)
        : [...prevSelected, categoryID];
      // Pass both selectedCategories and sortBy to handleFilterChange
      handleFilterChange(newCategory, sortBy);
      return newCategory;
    });
  };

  return (
    <aside className="h-fit rounded-[24px] border border-white/10 bg-[#0d1d19] p-5 lg:sticky lg:top-28">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#f6f3de]">Refine results</h2>
        <p className="mt-1 text-xs text-[#70877e]">Find the right fit faster.</p>
      </div>
      <div className="mb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#6f857c]">Sort by</p>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full rounded-xl border-white/10 bg-[#07110f]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#0d1d19] text-[#f6f3de]">
            <SelectGroup>
              <SelectLabel>Sort Options</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#6f857c]">Categories</p>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              className="space-y-2"
              id={category.id}
              checked={selectedCategories.includes(category.id)} // Set checked state
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className="text-sm font-medium leading-none text-[#aabbb4]">
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Filter;
