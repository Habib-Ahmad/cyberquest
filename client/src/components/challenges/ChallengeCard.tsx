import { useNavigate } from "react-router";
import { Lock, Globe, Server, Search, Shuffle, Shield } from "lucide-react";
import type {
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../types/index";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface ChallengeCardProps {
  challenge: Challenge;
  isSolved?: boolean;
}

const categoryIcons: Record<ChallengeCategory, React.ElementType> = {
  CRYPTOLOGY: Lock,
  CRYPTO: Lock,
  WEB: Globe,
  FORENSIC: Search,
  FORENSICS: Search,
  NETWORK: Server,
  REVERSE: Shuffle,
  PWN: Shield,
  MISC: Shuffle,
};

const difficultyColors: Record<
  ChallengeDifficulty,
  "success" | "warning" | "danger"
> = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "danger",
};

export default function ChallengeCard({
  challenge,
  isSolved = false,
}: ChallengeCardProps) {
  const navigate = useNavigate();
  const CategoryIcon = categoryIcons[challenge.category] || Shield;

  return (
    <Card
      hover
      onClick={() => navigate(`/challenges/${challenge.id}`)}
      className="p-5 relative overflow-hidden group"
    >
      {/* Solved indicator */}
      {isSolved && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute transform rotate-45 bg-primary-600 text-white text-xs font-bold py-1 right-[-35px] top-[12px] w-[120px] text-center">
            SOLVED
          </div>
        </div>
      )}

      {/* Category Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-gray-800 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
          <CategoryIcon className="h-5 w-5" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-400">
            {challenge.points}
          </span>
          <span className="text-sm text-gray-500 block">pts</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
        {challenge.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="info" size="sm">
          {challenge.category}
        </Badge>
        <Badge variant={difficultyColors[challenge.difficulty]} size="sm">
          {challenge.difficulty}
        </Badge>
      </div>
    </Card>
  );
}
