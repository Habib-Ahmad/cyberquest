import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/index';
import { useTheme } from '../context/index';

export default function NotFoundPage() {
	const { isDark } = useTheme();

	return (
		<div className="min-h-[60vh] flex items-center justify-center px-4">
			<div className="text-center">
				{/* 404 Text */}
				<h1 className="text-9xl font-bold text-primary-600/20 mb-4">404</h1>

				<h2
					className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
				>
					Page Not Found
				</h2>

				<p
					className={`mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
				>
					Looks like you've ventured into uncharted territory. The page you're
					looking for doesn't exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link to="/">
						<Button variant="primary" size="lg">
							<Home className="h-5 w-5 mr-2" />
							Go Home
						</Button>
					</Link>
					<Button
						variant="outline"
						size="lg"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="h-5 w-5 mr-2" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
}
