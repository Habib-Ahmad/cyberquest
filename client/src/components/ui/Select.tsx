import { type SelectHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/index';

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	options: SelectOption[];
	placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{ className = '', label, error, options, placeholder, id, ...props },
		ref,
	) => {
		const { isDark } = useTheme();
		const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={selectId}
						className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
					>
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={selectId}
					className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
							isDark ? 'bg-gray-800/50 text-gray-100' : 'bg-white text-gray-900'
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
				>
					{placeholder && (
						<option value="" className={isDark ? 'bg-gray-800' : 'bg-white'}>
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							className={isDark ? 'bg-gray-800' : 'bg-white'}
						>
							{option.label}
						</option>
					))}
				</select>
				{error && (
					<p className="mt-1.5 text-sm text-red-500" role="alert">
						{error}
					</p>
				)}
			</div>
		);
	},
);

Select.displayName = 'Select';

export default Select;
