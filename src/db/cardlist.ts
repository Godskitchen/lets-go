import { UserCard } from '../types';

export const CardListById = new Map<string, Set<UserCard>>();
export const CardPool: UserCard[] = [];
