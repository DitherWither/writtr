import { onCLS, onFID, onLCP } from 'web-vitals';
import { type FirebasePerformance, getPerformance } from 'firebase/performance';
import { app } from '$lib/firebase';

export function init() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const perf: FirebasePerformance = getPerformance(app);
	onCLS(console.log);
	onFID(console.log);
	onLCP(console.log);
}
