/* eslint-disable */
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { strapiService } from '@/utils/dataEndPoint';
import { SwimmingPoolList } from './products-table/pool-table';

export default function SwimmingPoolPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [poolData, setPoolData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('today'); // Default: Today

    const formatDate = (date: Date) => date.toISOString();

    const fetchBookings = async (dateOption: string) => {
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
            const response = await strapiService.getBookingItems({
                "populate": "*",
                "pagination[pageSize]": 55,
                "filters[hotel_services][name][$eq]": "Swimming Pool",
                "filters[createdAt][$gte]": formatDate(startDate),
                "filters[createdAt][$lte]": formatDate(endDate),
            });

  // Map the response data to fit the structure required by SwimmingPoolList
  const mappedData = response?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.hotel_services[0]?.name || "N/A",
    price: item.hotel_services[0]?.price || 0,
    quantity: item.quantity || 0,
    amountPaid: item.amount_paid || 0,
})) || [];
console.log('pool data:', mappedData);
setPoolData(mappedData);

} catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(selectedDate);
    }, [selectedDate]);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Swimming Pool Bookings</h1>

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
                <Suspense fallback={<div>Loading pool list...</div>}>
                    <SwimmingPoolList hotelServices={poolData} />
                </Suspense>
            )}
        </div>
    );
}
