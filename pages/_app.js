import { ToastProvider } from 'react-toast-notifications';
import { GlobalState } from '../context/GlobalState';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<GlobalState>
			<Layout>
				<ToastProvider autoDismiss={true}>
					<Component {...pageProps} />
				</ToastProvider>
			</Layout>
		</GlobalState>
	);
}

export default MyApp;
