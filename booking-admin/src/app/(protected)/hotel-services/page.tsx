/* eslint-disable */
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { OverviewCardsGroup } from './overview-cards';
import { OverviewCardsSkeleton } from './overview-cards/skeleton';
import { ExtendedProduct, handleMainRecord } from '@/utils/ReportHelpers/mainHandle';
import { ProductsListSkeleton } from '../bar/_components/products-table/skeleton';
import DrinksInventoryPage from './product-table/drinks-inventory';

// Generate past week date ranges (copied from bar page for consistency)
const generatePastWeekDateRanges = () => {
    const now = new Date();
    const ranges = [];
    for (let i = 0; i <= 7; i++) {
        const pastDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        ranges.push({
            label:
                i === 0
                    ? `Today (${pastDate.toLocaleDateString()})`
                    : i === 1
                        ? `Yesterday (${pastDate.toLocaleDateString()})`
                        : `${i} days ago (${pastDate.toLocaleDateString()})`,
            value: pastDate.toISOString().split('T')[0],
        });
    }
    return ranges;
};
const pastWeekDateRanges = generatePastWeekDateRanges();

export default function HotelServicesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<ExtendedProduct[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: pastWeekDateRanges[0].value,
        endDate: pastWeekDateRanges[0].value,
    });
    const [overviewData, setOverviewData] = useState({
        total_cash: { value: 0 },
        total_transfers: { value: 0 },
        total_sold: { value: 0 },
        low_stock: { value: 0 },
        out_of_stock: { value: 0 },
    });

    const formatDate = (date: Date | string) => {
        if (typeof date === 'string') return date;
        return date.toISOString().split('T')[0];
    };

    const fetchHotelServices = async (dateOption: { startDate: string; endDate: string }) => {
        setIsLoading(true);
        let startDate = dateOption.startDate;
        let endDate = dateOption.endDate;
        try {
            const { overview, products } = await handleMainRecord(
                formatDate(startDate),
                formatDate(endDate),
                'hotel',
                {
                    inventoryEndpoint: 'getHotelServices',
                    departmentStockField: 'quantity',
                    otherStockField: '',
                    fetchInventory: true
                }
            );
            setOverviewData({
                total_cash: { value: overview.cashSales },
                total_transfers: { value: overview.totalTransfers },
                total_sold: { value: overview.hotelSales },
                low_stock: { value: products.filter((p: any) => p.stock <= 10).length },
                out_of_stock: { value: products.filter((p: any) => p.stock === 0).length },
            });
            setProducts(products);
        } catch (error) {
            console.error('Failed to fetch hotel services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHotelServices(selectedDateRange);
    }, [selectedDateRange]);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Hotel Services</h1>
                <select
                    value={selectedDateRange.startDate}
                    onChange={e => {
                        const selectedDate = e.target.value;
                        setSelectedDateRange({ startDate: selectedDate, endDate: selectedDate });
                    }}
                    className="border rounded p-2"
                >
                    {pastWeekDateRanges.map(range => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Suspense fallback={<OverviewCardsSkeleton />}>
                        <OverviewCardsGroup
                            total_cash={overviewData.total_cash}
                            total_transfers={overviewData.total_transfers}
                            total_sold={overviewData.total_sold}
                            low_stock={overviewData.low_stock}
                            out_of_stock={overviewData.out_of_stock}
                        />
                    </Suspense>
                    <div className="mt-4">
                        <Suspense fallback={<ProductsListSkeleton />}>
                            <DrinksInventoryPage products={products} />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
}
