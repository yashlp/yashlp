import { Card } from "@/components/aesthetics/ui/card";

const ORDERS = [
  { id: "#1042", item: "Cloud Vessel", total: 136, status: "Shipped" },
  { id: "#1041", item: "Arc Floor Lamp", total: 240, status: "Processing" },
  { id: "#1040", item: "Midnight Taper Set", total: 68, status: "Delivered" },
];

export default function SellerOrdersPage() {
  return (
    <div>
      <h1 className="aes-display text-3xl font-semibold italic">Orders</h1>
      <Card className="mt-8 overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--aes-border)] bg-[var(--aes-ivory)]">
            <tr>
              <th className="aes-mono px-6 py-4 text-left text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Order</th>
              <th className="aes-mono px-6 py-4 text-left text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Item</th>
              <th className="aes-mono px-6 py-4 text-left text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Total</th>
              <th className="aes-mono px-6 py-4 text-left text-[10px] uppercase tracking-wider text-[var(--aes-dusty)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id} className="border-b border-[var(--aes-border)] last:border-0">
                <td className="px-6 py-4 font-medium">{o.id}</td>
                <td className="px-6 py-4 text-[var(--aes-charcoal-muted)]">{o.item}</td>
                <td className="px-6 py-4">${o.total}</td>
                <td className="px-6 py-4 text-[var(--aes-royal)]">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
