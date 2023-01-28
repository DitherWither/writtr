import { onCLS, onFID, onLCP } from 'web-vitals';
import { type FirebasePerformance, getPerformance } from 'firebase/performance';
import { app } from '$lib/firebase';

function sendToAnalytics(metric: unknown) {
	const body = JSON.stringify(metric);
	// Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
	(navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
		fetch('/analytics', { body, method: 'POST', keepalive: true });
}

export function init() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const perf: FirebasePerformance = getPerformance(app);
	onCLS(sendToAnalytics);
	onFID(sendToAnalytics);
	onLCP(sendToAnalytics);
}
