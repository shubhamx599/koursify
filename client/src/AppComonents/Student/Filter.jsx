import { Checkbox } from '../../components/ui/checkbox.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import React, { useState } from 'react';

const categoryGroups = [
  {
    label: "Web Development",
    items: [
      { id: "html", label: "HTML" },
      { id: "css", label: "CSS" },
      { id: "javascript", label: "JavaScript" },
      { id: "react", label: "React" },
      { id: "vue.js", label: "Vue.js" },
      { id: "next.js", label: "Next.js" },
    ]
  },
  {
    label: "Data & AI",
    items: [
      { id: "python", label: "Python" },
      { id: "r", label: "R" },
      { id: "sql", label: "SQL" },
      { id: "machine learning", label: "Machine Learning" },
      { id: "pandas", label: "Pandas" },
    ]
  },
  {
    label: "Backend",
    items: [
      { id: "node.js", label: "Node.js" },
      { id: "django", label: "Django" },
      { id: "spring boot", label: "Spring Boot" },
      { id: "golang", label: "GoLang" },
    ]
  },
  {
    label: "Cloud",
    items: [
      { id: "aws", label: "AWS" },
      { id: "azure", label: "Azure" },
      { id: "google cloud", label: "Google Cloud" },
      { id: "kubernetes", label: "Kubernetes" },
    ]
  },
  {
    label: "Security & Testing",
    items: [
      { id: "ethical hacking", label: "Ethical Hacking" },
      { id: "penetration testing", label: "Penetration Testing" },
      { id: "network security", label: "Network Security" },
    ]
  },
  {
    label: "Languages",
    items: [
      { id: "c", label: "C" },
      { id: "c++", label: "C++" },
      { id: "java", label: "Java" },
      { id: "rust", label: "Rust" },
    ]
  }
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

      <div className="space-y-4 border-t border-white/10 pt-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#6f857c]">Categories</p>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
          {categoryGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <h4 className="text-[10px] font-extrabold text-[#556c62] uppercase tracking-[.1em]">{group.label}</h4>
              <div className="space-y-2 pl-0.5">
                {group.items.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2.5">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-xs font-semibold leading-none text-[#aabbb4] cursor-pointer hover:text-[#f6f3de] transition-colors select-none"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Filter;
