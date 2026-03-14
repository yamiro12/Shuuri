import CashflowClient from './_cashflow-client';

export const metadata = {
  title: 'Cashflow | SHUURI',
  description: 'Proyecciones financieras SHUURI. USD 300K en caja. Breakeven M16. Revenue M18: USD 687K.',
};

export default function CashflowPage() {
  return <CashflowClient />;
}
