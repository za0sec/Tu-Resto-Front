import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import './styles/globals.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            const token = Cookies.get('accessToken');
            const publicPaths = ['/'];

            if (!token && !publicPaths.includes(url)) {
                router.push('/');
            }
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;