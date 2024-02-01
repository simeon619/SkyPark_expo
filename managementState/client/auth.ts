import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useTypeUser = create(
	combine(
		{
			value: '1' as '1' | '2',
		},
		(set) => ({
			setValue: async (value: '1' | '2') => {
				set({
					value,
				});
			},
		})
	)
);
