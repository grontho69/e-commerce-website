export default function Price({ amount, className = "" }) {
  const formattedPrice = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);

  return <span className={className}>{formattedPrice}</span>;
}
