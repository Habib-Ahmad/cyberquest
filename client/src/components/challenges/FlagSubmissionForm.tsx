import { useState, type FormEvent } from "react";
import { Send, Lock } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

interface FlagSubmissionFormProps {
  onSubmit: (flag: string) => Promise<void>;
  isLoading: boolean;
  result: { success: boolean; message: string } | null;
  isAuthenticated: boolean;
  alreadySolved: boolean;
}

export default function FlagSubmissionForm({
  onSubmit,
  isLoading,
  result,
  isAuthenticated,
  alreadySolved,
}: FlagSubmissionFormProps) {
  const [flag, setFlag] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;
    await onSubmit(flag.trim());
    if (result?.success) {
      setFlag("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 text-gray-400">
          <Lock className="h-5 w-5" />
          <p>You need to be logged in to submit flags.</p>
        </div>
      </div>
    );
  }

  if (alreadySolved) {
    return (
      <Alert variant="success">
        Challenge Completed! You have already solved this challenge.
      </Alert>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Submit Flag</h3>

      {result && (
        <Alert variant={result.success ? "success" : "danger"} className="mb-4">
          {result.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter the flag..."
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          disabled={isLoading}
          className="flex-1"
          autoComplete="off"
          spellCheck={false}
        />
        <Button type="submit" isLoading={isLoading} disabled={!flag.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-3">
        Note: There is a rate limit of 5 submissions per minute.
      </p>
    </div>
  );
}
