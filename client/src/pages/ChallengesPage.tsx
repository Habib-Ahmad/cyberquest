import { useState, useEffect, useMemo } from 'react';
import { Flag, Trophy, Users } from 'lucide-react';
import { useAuth, useTheme } from '../context/index';
import {
	challengeService,
	submissionService,
	leaderboardService,
} from '../services/index';
import type {
	Challenge,
	Submission,
	ChallengeCategory,
	ChallengeDifficulty,
} from '../types/index';
import { LoadingSpinner, Alert } from '../components/ui/index';
import {
	ChallengeCard,
	ChallengeFilters,
} from '../components/challenges/index';

export default function ChallengesPage() {
	const { isAuthenticated } = useAuth();
	const { isDark } = useTheme();

	// Data state
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [solvedChallengeIds, setSolvedChallengeIds] = useState<Set<string>>(
		new Set(),
	);
	const [totalPlayers, setTotalPlayers] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	// Filter state
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState<ChallengeCategory | ''>('');
	const [difficulty, setDifficulty] = useState<ChallengeDifficulty | ''>('');
	const [solvedFilter, setSolvedFilter] = useState<
		'all' | 'solved' | 'unsolved'
	>('all');

	// Fetch data
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError('');

			try {
				const [challengesData, leaderboardData] = await Promise.all([
					challengeService.getAll(),
					leaderboardService.getLeaderboard(),
				]);

				setChallenges(challengesData);
				setTotalPlayers(leaderboardData.length);

				// Fetch solved challenges if authenticated
				if (isAuthenticated) {
					try {
						const solvedData = await submissionService.getMySolvedChallenges();
						setSolvedChallengeIds(
							new Set(solvedData.map((s: Submission) => s.challengeId)),
						);
					} catch {
						// User might not have any submissions yet
						setSolvedChallengeIds(new Set());
					}
				}
			} catch {
				setError('Failed to load challenges. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [isAuthenticated]);

	// Filter challenges
	const filteredChallenges = useMemo(() => {
		return challenges.filter((challenge) => {
			// Search filter
			if (search) {
				const searchLower = search.toLowerCase();
				if (
					!challenge.title.toLowerCase().includes(searchLower) &&
					!challenge.description.toLowerCase().includes(searchLower)
				) {
					return false;
				}
			}

			// Category filter
			if (category && challenge.category !== category) {
				return false;
			}

			// Difficulty filter
			if (difficulty && challenge.difficulty !== difficulty) {
				return false;
			}

			// Solved filter
			if (solvedFilter === 'solved' && !solvedChallengeIds.has(challenge.id)) {
				return false;
			}
			if (solvedFilter === 'unsolved' && solvedChallengeIds.has(challenge.id)) {
				return false;
			}

			return true;
		});
	}, [
		challenges,
		search,
		category,
		difficulty,
		solvedFilter,
		solvedChallengeIds,
	]);

	// Stats
	const stats = useMemo(() => {
		const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
		const solvedPoints = challenges
			.filter((c) => solvedChallengeIds.has(c.id))
			.reduce((sum, c) => sum + c.points, 0);

		return {
			totalChallenges: challenges.length,
			solvedCount: solvedChallengeIds.size,
			totalPoints,
			solvedPoints,
		};
	}, [challenges, solvedChallengeIds]);

	const clearFilters = () => {
		setSearch('');
		setCategory('');
		setDifficulty('');
		setSolvedFilter('all');
	};

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1
					className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
				>
					Challenges
				</h1>
				<p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
					Test your skills with our collection of cybersecurity challenges
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div
					className={`backdrop-blur-sm border rounded-xl p-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
				>
					<div
						className={`p-3 rounded-lg ${isDark ? 'bg-primary-600/20' : 'bg-primary-100'}`}
					>
						<Flag className="h-6 w-6 text-primary-500" />
					</div>
					<div>
						<p
							className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
						>
							{stats.totalChallenges}
						</p>
						<p
							className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
						>
							Total Challenges
						</p>
					</div>
				</div>

				<div
					className={`backdrop-blur-sm border rounded-xl p-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
				>
					<div
						className={`p-3 rounded-lg ${isDark ? 'bg-yellow-600/20' : 'bg-yellow-100'}`}
					>
						<Trophy className="h-6 w-6 text-yellow-500" />
					</div>
					<div>
						<p
							className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
						>
							{isAuthenticated
								? `${stats.solvedCount}/${stats.totalChallenges}`
								: stats.totalPoints}
						</p>
						<p
							className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
						>
							{isAuthenticated ? 'Solved' : 'Total Points'}
						</p>
					</div>
				</div>

				<div
					className={`backdrop-blur-sm border rounded-xl p-4 flex items-center gap-4 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
				>
					<div
						className={`p-3 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}
					>
						<Users className="h-6 w-6 text-blue-500" />
					</div>
					<div>
						<p
							className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
						>
							{totalPlayers}
						</p>
						<p
							className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
						>
							Players
						</p>
					</div>
				</div>
			</div>

			{error && (
				<Alert variant="danger" onClose={() => setError('')} className="mb-6">
					{error}
				</Alert>
			)}

			{/* Filters */}
			<ChallengeFilters
				search={search}
				onSearchChange={setSearch}
				category={category}
				onCategoryChange={setCategory}
				difficulty={difficulty}
				onDifficultyChange={setDifficulty}
				solvedFilter={solvedFilter}
				onSolvedFilterChange={setSolvedFilter}
				onClearFilters={clearFilters}
				isAuthenticated={isAuthenticated}
			/>

			{/* Results count */}
			<div
				className={`mt-6 mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
			>
				Showing {filteredChallenges.length} of {challenges.length} challenges
			</div>

			{/* Challenges Grid */}
			{filteredChallenges.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredChallenges.map((challenge) => (
						<ChallengeCard
							key={challenge.id}
							challenge={challenge}
							isSolved={solvedChallengeIds.has(challenge.id)}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<Flag
						className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}
					/>
					<h3
						className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
					>
						No challenges found
					</h3>
					<p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
						Try adjusting your filters or search query
					</p>
				</div>
			)}
		</div>
	);
}
