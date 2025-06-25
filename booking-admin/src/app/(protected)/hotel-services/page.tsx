/* eslint-disable */
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { OverviewCardsGroup } from './overview-cards';
import { OverviewCardsSkeleton } from './overview-cards/skeleton';
import { ExtendedProduct, handleMainRecord } from '@/utils/ReportHelpers/mainHandle';
import { ProductsListSkeleton } from '../bar/_components/products-table/skeleton';
import  DrinksInventoryPage  from './product-table/drinks-inventory'

export default function HotelServicesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<ExtendedProduct[]>([]);
    const [selectedDate, setSelectedDate] = useState('today');
    const [overviewData, setOverviewData] = useState({
        total_cash: { value: 0 },
        total_transfers: { value: 0 },
        total_sold: { value: 0 },
        low_stock: { value: 0 },
        out_of_stock: { value: 0 },
    });

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const fetchHotelServices = async (dateOption: string) => {
        setIsLoading(true);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        let startDate, endDate;
        if (dateOption === 'today') {
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(today);
            endDate.setHours(23, 59, 59, 999);
        } else if (dateOption === 'yesterday') {
            startDate = new Date(yesterday);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(yesterday);
            endDate.setHours(23, 59, 59, 999);
        }
        if (!startDate || !endDate) return;
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
        fetchHotelServices(selectedDate);
    }, [selectedDate]);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Hotel Services</h1>
                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
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
