import { useTheme } from '../../context/index';

interface BadgeProps {
	children: React.ReactNode;
	variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
	size?: 'sm' | 'md';
	className?: string;
}

export default function Badge({
	children,
	variant = 'default',
	size = 'md',
	className = '',
}: BadgeProps) {
	const { isDark } = useTheme();

	const variants = {
		default: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700',
		success: isDark
			? 'bg-primary-900/50 text-primary-400 border border-primary-700/50'
			: 'bg-green-100 text-green-700 border border-green-300',
		warning: isDark
			? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
			: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
		danger: isDark
			? 'bg-red-900/50 text-red-400 border border-red-700/50'
			: 'bg-red-100 text-red-700 border border-red-300',
		info: isDark
			? 'bg-blue-900/50 text-blue-400 border border-blue-700/50'
			: 'bg-blue-100 text-blue-700 border border-blue-300',
	};

	const sizes = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm',
	};

	return (
		<span
			className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{children}
		</span>
	);
}
