import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { authService } from '../services/authService';

const useAuth = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                dispatch(setUser(user));
            } catch (err) {
                setError('Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    return { loading, error };
};

export default useAuth;