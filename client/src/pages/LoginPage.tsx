import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Shield, LogIn } from "lucide-react";
import { useAuth } from "../context/index";
import { Button, Input, Alert, Card } from "../components/ui/index";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = (location.state as { from?: string })?.from || "/challenges";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setError("Invalid username or password.");
        } else if (err.response?.status === 429) {
          setError("Too many login attempts. Please wait before trying again.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-6"
          >
            <Shield className="h-10 w-10" />
            <span className="text-2xl font-bold">CyberQuest</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your quest</p>
        </div>

        {/* Form */}
        <Card className="p-6 md:p-8">
          {error && (
            <Alert
              variant="danger"
              onClose={() => setError("")}
              className="mb-6"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
