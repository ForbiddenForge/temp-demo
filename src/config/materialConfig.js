import { useControls } from 'leva';

export const useCounterDimensions = (counter, initialScale) => {
	useControls('Counter Dimensions', {
		length: {
			value: initialScale.y,
			min: 0.5,
			max: 3,
			step: 0.1,
			onChange: (value) => {
				counter.scale.y = value;
			},
		},
		thickness: {
			value: initialScale.z,
			min: 0.5,
			max: 3,
			step: 0.1,
			onChange: (value) => {
				counter.scale.z = value;
			},
		},
	});
};
