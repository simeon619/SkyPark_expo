import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useInputPost = create(
	combine(
		{
			text: '',
		},
		(set) => ({
			setText: (value: string) => {
				set({
					text: value.startsWith('@') ? ' ' + value.trimStart() : value,
				});
			},
		})
	)
);
