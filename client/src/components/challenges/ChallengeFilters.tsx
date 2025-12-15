import { Search, X } from "lucide-react";
import type { ChallengeCategory, ChallengeDifficulty } from "../../types/index";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface ChallengeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: ChallengeCategory | "";
  onCategoryChange: (value: ChallengeCategory | "") => void;
  difficulty: ChallengeDifficulty | "";
  onDifficultyChange: (value: ChallengeDifficulty | "") => void;
  solvedFilter: "all" | "solved" | "unsolved";
  onSolvedFilterChange: (value: "all" | "solved" | "unsolved") => void;
  onClearFilters: () => void;
  isAuthenticated: boolean;
}

const categoryOptions = [
  { value: "CRYPTOLOGY", label: "Cryptology" },
  { value: "WEB", label: "Web" },
  { value: "FORENSIC", label: "Forensic" },
  { value: "NETWORK", label: "Network" },
  { value: "MISC", label: "Miscellaneous" },
];

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const solvedOptions = [
  { value: "all", label: "All" },
  { value: "solved", label: "Solved" },
  { value: "unsolved", label: "Unsolved" },
];

export default function ChallengeFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  solvedFilter,
  onSolvedFilterChange,
  onClearFilters,
  isAuthenticated,
}: ChallengeFiltersProps) {
  const hasActiveFilters =
    search || category || difficulty || solvedFilter !== "all";

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as ChallengeCategory | "")
            }
            options={categoryOptions}
            placeholder="All Categories"
          />

          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as ChallengeDifficulty | "")
            }
            options={difficultyOptions}
            placeholder="All Difficulties"
          />

          {isAuthenticated && (
            <Select
              label="Status"
              value={solvedFilter}
              onChange={(e) =>
                onSolvedFilterChange(
                  e.target.value as "all" | "solved" | "unsolved"
                )
              }
              options={solvedOptions}
            />
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
