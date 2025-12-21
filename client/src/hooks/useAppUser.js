'use client';
import { useUser, useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { getProfile, setAuthToken } from '../lib/api';
import { useEffect } from 'react';

export function useAppUser() {
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const { getToken } = useAuth();

    // Set token whenever it changes
    useEffect(() => {
        const fetchToken = async () => {
            if (isClerkLoaded && clerkUser) {
                const token = await getToken();
                setAuthToken(token);
            }
        };
        fetchToken();
    }, [isClerkLoaded, clerkUser, getToken]);

    const { data: dbUser, isLoading: isDbLoading } = useQuery({
        queryKey: ['userProfile', clerkUser?.id],
        queryFn: async () => {
            const token = await getToken();
            setAuthToken(token); // Ensure token is set before call
            const res = await getProfile();
            return res.data;
        },
        enabled: !!clerkUser?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const isLoading = !isClerkLoaded || (!!clerkUser && isDbLoading);

    // Check if user has completed onboarding (has a role set)
    const hasRole = !!clerkUser?.publicMetadata?.role;

    // Merge Clerk and DB user
    const user = clerkUser ? {
        id: dbUser?.id,
        clerkId: clerkUser.id,
        name: dbUser?.name || clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress || dbUser?.email, // Prefer Clerk email
        phone: dbUser?.phone,
        imageUrl: clerkUser.imageUrl,
        role: clerkUser.publicMetadata?.role || null
    } : null;

    return { user, isLoading, hasRole };
}
