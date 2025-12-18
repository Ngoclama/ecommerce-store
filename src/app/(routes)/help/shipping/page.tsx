import Container from "@/components/ui/container";
import ShippingRatesTable from "@/components/shipping-rates-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phí Vận Chuyển | Cửa Hàng",
  description: "Bảng phí vận chuyển chi tiết theo từng tỉnh/thành phố",
};

export default function ShippingPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-16">
      <Container>
        <ShippingRatesTable />
      </Container>
    </div>
  );
}
