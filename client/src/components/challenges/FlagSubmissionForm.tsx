import { useState, type FormEvent } from 'react';
import { Send, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { useTheme } from '../../context/index';

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
	const { isDark } = useTheme();
	const [flag, setFlag] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!flag.trim()) return;
		await onSubmit(flag.trim());
		if (result?.success) {
			setFlag('');
		}
	};

	if (!isAuthenticated) {
		return (
			<div
				className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
			>
				<div
					className={`flex items-center gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
				>
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
		<div
			className={`backdrop-blur-sm border rounded-xl p-6 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
		>
			<h3
				className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
			>
				Submit Flag
			</h3>

			{result && (
				<Alert variant={result.success ? 'success' : 'danger'} className="mb-4">
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

			<p
				className={`text-xs mt-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
			>
				Note: There is a rate limit of 5 submissions per minute.
			</p>
		</div>
	);
}
