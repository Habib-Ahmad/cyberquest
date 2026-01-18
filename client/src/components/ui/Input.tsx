import { type InputHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/index';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = '', label, error, helperText, id, ...props }, ref) => {
		const { isDark } = useTheme();
		const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
							isDark
								? 'bg-gray-800/50 text-gray-100 placeholder-gray-500'
								: 'bg-white text-gray-900 placeholder-gray-400'
						}
            ${
							error
								? 'border-red-500 focus:ring-red-500'
								: isDark
									? 'border-gray-700 hover:border-gray-600'
									: 'border-gray-300 hover:border-gray-400'
						}
            ${className}
          `}
					{...props}
				/>
				{error && (
					<p className="mt-1.5 text-sm text-red-500" role="alert">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p
						className={`mt-1.5 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
					>
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';

export default Input;
