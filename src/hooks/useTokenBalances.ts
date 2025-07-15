import { useTokenBalance } from './useTokenBalance';
import { Token } from '@/config/tokens';

export function useTokenBalances(tokens: Token[]) {
  const balances = tokens.map(token => {
    const balance = useTokenBalance(token);
    return {
      token,
      ...balance,
    };
  });

  const isLoading = balances.some(b => b.isLoading);
  const hasError = balances.some(b => b.isError);

  return {
    balances,
    isLoading,
    hasError,
  };
}