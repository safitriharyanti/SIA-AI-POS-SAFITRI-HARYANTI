/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Package,
  DollarSign,
  MapPin,
  CreditCard,
  Calculator,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { mockSalesData, SalesData } from "./data/mockData";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function App() {
  const [data] = useState<SalesData[]>(mockSalesData);

  // --- KPI Calculations ---
  const kpis = useMemo(() => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.order_amount, 0);
    const totalProductsSold = data.reduce((acc, curr) => acc + curr.order_quantity, 0);
    const aov = totalRevenue / data.length;
    return { totalRevenue, totalProductsSold, aov };
  }, [data]);

  // --- Product Performance ---
  const productPerformance = useMemo(() => {
    const products: Record<string, { volume: number; profit: number }> = {};
    data.forEach((item) => {
      const profit = item.sku_subtotal - item.total_discount - (item.service_fee + item.handling_fee + item.shipping_fee + item.insurance);
      if (!products[item.sku_name]) {
        products[item.sku_name] = { volume: 0, profit: 0 };
      }
      products[item.sku_name].volume += item.order_quantity;
      products[item.sku_name].profit += profit;
    });

    return Object.entries(products)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [data]);

  // --- Regional Analysis ---
  const regionalAnalysis = useMemo(() => {
    const regions: Record<string, number> = {};
    data.forEach((item) => {
      const key = `${item.province} - ${item.regency_city}`;
      regions[key] = (regions[key] || 0) + item.order_amount;
    });
    return Object.entries(regions)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  // --- Payment Method Analysis ---
  const paymentAnalysis = useMemo(() => {
    const methods: Record<string, number> = {};
    data.forEach((item) => {
      methods[item.payment_method] = (methods[item.payment_method] || 0) + 1;
    });
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [data]);

  // --- Financial Report ---
  const financialReport = useMemo(() => {
    const grossRevenue = data.reduce((acc, curr) => acc + curr.sku_subtotal, 0);
    const totalDiscount = data.reduce((acc, curr) => acc + curr.total_discount, 0);
    const operatingExpenses = data.reduce(
      (acc, curr) => acc + curr.service_fee + curr.handling_fee + curr.shipping_fee + curr.insurance,
      0
    );
    const netProfit = grossRevenue - totalDiscount - operatingExpenses;
    return { grossRevenue, totalDiscount, operatingExpenses, netProfit };
  }, [data]);

  // --- Zakat Calculation ---
  const zakatInfo = useMemo(() => {
    const nishab = 100000000; // Rp 100.000.000
    const isReached = financialReport.netProfit >= nishab;
    const zakatAmount = isReached ? financialReport.netProfit * 0.025 : 0;
    return { nishab, isReached, zakatAmount };
  }, [financialReport]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Analisis Bisnis</h1>
            <p className="text-slate-500">Ringkasan performa penjualan dan laporan keuangan</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <Calculator className="w-4 h-4" />
            <span>Periode: Tahunan (Simulasi)</span>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard Penjualan</TabsTrigger>
            <TabsTrigger value="finance">Laporan Keuangan</TabsTrigger>
            <TabsTrigger value="zakat">Zakat & Pajak</TabsTrigger>
            <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
          </TabsList>

          {/* 1. Dashboard Penjualan */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign className="w-12 h-12" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">Total Pendapatan</CardDescription>
                  <CardTitle className="text-2xl font-bold">{formatIDR(kpis.totalRevenue)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+12.5% dari bulan lalu</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Package className="w-12 h-12" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">Produk Terjual</CardDescription>
                  <CardTitle className="text-2xl font-bold">{kpis.totalProductsSold} Unit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+8.2% dari bulan lalu</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">Average Order Value (AOV)</CardDescription>
                  <CardTitle className="text-2xl font-bold">{formatIDR(kpis.aov)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-rose-600 text-xs font-medium">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>-2.1% dari bulan lalu</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Performance Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Top 5 Produk Terlaris
                  </CardTitle>
                  <CardDescription>Berdasarkan volume penjualan unit</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformance} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} Unit`, "Volume"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regional Analysis Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    Persebaran Penjualan Regional
                  </CardTitle>
                  <CardDescription>Berdasarkan total nilai pesanan per wilayah</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(value) => `Rp${value/1000000}M`} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value: number) => [formatIDR(value), "Revenue"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Method Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                    Metode Pembayaran
                  </CardTitle>
                  <CardDescription>Persentase penggunaan metode pembayaran</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentAnalysis}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Profit Contribution Table */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Kontribusi Profit Produk</CardTitle>
                  <CardDescription>5 Produk dengan estimasi profit tertinggi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productPerformance.sort((a, b) => b.profit - a.profit).map((product) => (
                        <TableRow key={product.name}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right text-emerald-600 font-semibold">
                            {formatIDR(product.profit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. Laporan Keuangan */}
          <TabsContent value="finance" className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Simulasi Laporan Laba Rugi</CardTitle>
                <CardDescription>Berdasarkan data transaksi yang tersedia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-slate-600">Pendapatan Kotor (Subtotal SKU)</span>
                        <span className="font-semibold">{formatIDR(financialReport.grossRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 text-rose-600">
                        <span className="text-slate-600">Potongan / Diskon</span>
                        <span className="font-semibold">({formatIDR(financialReport.totalDiscount)})</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 font-bold bg-slate-50 p-2 rounded">
                        <span>Pendapatan Bersih</span>
                        <span>{formatIDR(financialReport.grossRevenue - financialReport.totalDiscount)}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2 text-slate-500 italic">
                        <span>Biaya Operasional:</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 pl-4 text-sm">
                        <span className="text-slate-600">Service Fee</span>
                        <span>{formatIDR(data.reduce((a, c) => a + c.service_fee, 0))}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 pl-4 text-sm">
                        <span className="text-slate-600">Handling Fee</span>
                        <span>{formatIDR(data.reduce((a, c) => a + c.handling_fee, 0))}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 pl-4 text-sm">
                        <span className="text-slate-600">Shipping Fee</span>
                        <span>{formatIDR(data.reduce((a, c) => a + c.shipping_fee, 0))}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 pl-4 text-sm">
                        <span className="text-slate-600">Insurance</span>
                        <span>{formatIDR(data.reduce((a, c) => a + c.insurance, 0))}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 font-bold text-rose-600 bg-slate-50 p-2 rounded">
                        <span className="text-slate-900">Total Biaya Operasional</span>
                        <span>({formatIDR(financialReport.operatingExpenses)})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-600 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
                    <div>
                      <h3 className="text-lg font-medium opacity-90">Laba Bersih (Net Profit)</h3>
                      <p className="text-sm opacity-75 italic">Estimasi profit setelah dikurangi semua biaya dan diskon</p>
                    </div>
                    <div className="text-4xl font-bold">
                      {formatIDR(financialReport.netProfit)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Perhitungan Zakat */}
          <TabsContent value="zakat" className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Estimasi Zakat Mal (Perdagangan)</h2>
                </div>
                <p className="text-emerald-100 text-sm">Perhitungan berdasarkan aset lancar (Laba Bersih) dalam satu haul.</p>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-700">Ketentuan Zakat</h3>
                      <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                        <li>Dikenakan sebesar <strong>2,5%</strong> dari total aset lancar.</li>
                        <li>Wajib dibayarkan jika mencapai <strong>Nishab</strong> (setara 85 gram emas).</li>
                        <li>Asumsi Nishab saat ini: <strong>{formatIDR(zakatInfo.nishab)}</strong>.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Laba Bersih Saat Ini:</span>
                        <span className="font-semibold">{formatIDR(financialReport.netProfit)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Status Nishab:</span>
                        {zakatInfo.isReached ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Mencapai Nishab</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">Belum Mencapai Nishab</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                    <span className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-widest">Estimasi Zakat</span>
                    <div className={`text-5xl font-black mb-4 ${zakatInfo.isReached ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {formatIDR(zakatInfo.zakatAmount)}
                    </div>
                    {zakatInfo.isReached ? (
                      <p className="text-center text-sm text-slate-500 max-w-[250px]">
                        Berdasarkan data, Anda diwajibkan membayar zakat perdagangan sebesar 2,5%.
                      </p>
                    ) : (
                      <p className="text-center text-sm text-slate-400 max-w-[250px]">
                        Laba bersih belum mencapai ambang batas Nishab ({formatIDR(zakatInfo.nishab)}).
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Rekomendasi Strategis */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Optimasi Biaya Operasional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Biaya operasional (Handling & Shipping) mencapai <strong>{((financialReport.operatingExpenses / financialReport.grossRevenue) * 100).toFixed(1)}%</strong> dari pendapatan. 
                    Disarankan untuk melakukan negosiasi ulang dengan mitra logistik atau mengoptimalkan biaya handling untuk pesanan di bawah Rp 500.000.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Fokus Produk Margin Tinggi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Produk <strong>{productPerformance.sort((a,b) => b.profit - a.profit)[0]?.name}</strong> memberikan kontribusi profit terbesar. 
                    Tingkatkan alokasi budget marketing untuk produk ini dan pertimbangkan bundling dengan produk "Wireless Mouse" yang memiliki volume tinggi namun profit rendah.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6 text-rose-600" />
                  </div>
                  <CardTitle className="text-lg">Ekspansi Regional Strategis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Wilayah <strong>{regionalAnalysis[0]?.name}</strong> mendominasi penjualan. 
                    Pertimbangkan untuk membuka gudang distribusi lokal (hub) di wilayah <strong>Jawa Timur</strong> untuk menekan biaya shipping fee yang saat ini cukup tinggi bagi pelanggan di area tersebut.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md bg-slate-900 text-white">
              <CardHeader>
                <CardTitle>Catatan Analis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-slate-300 text-sm">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>Penggunaan <strong>GoPay</strong> dan <strong>Transfer Bank</strong> sangat dominan. Kerjasama promo cashback dengan penyedia e-wallet tersebut dapat meningkatkan volume transaksi lebih lanjut.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>Rasio diskon terhadap pendapatan kotor adalah <strong>{((financialReport.totalDiscount / financialReport.grossRevenue) * 100).toFixed(1)}%</strong>. Angka ini masih dalam batas wajar, namun perlu dipantau agar tidak menggerus margin laba bersih.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center py-8 text-slate-400 text-xs border-t border-slate-200">
          <p>© 2026 Sistem Analisis Penjualan & Keuangan. Seluruh data bersifat simulasi.</p>
        </footer>
      </div>
    </div>
  );
}
