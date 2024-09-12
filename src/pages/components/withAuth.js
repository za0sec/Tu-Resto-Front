import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from "js-cookie";

const withAuth = (WrappedComponent, allowedRoles = []) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            // Verifica la autenticación y el rol del usuario
            const token = Cookies.get('accessToken');
            const userRole = Cookies.get('user_role');

            if (!token) {
                router.replace('/'); // Redirige al login si no hay token
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                router.replace('/unauthorized'); // Redirige si el usuario no tiene el rol adecuado
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;