/* eslint-disable */
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { strapiService } from '@/utils/dataEndPoint';
import { SwimmingPoolList } from './product-table/pool-table';
import { OverviewCardsGroup } from './overview-cards';
import { OverviewCardsSkeleton } from './overview-cards/skeleton';
import { handleMainRecord } from '@/utils/ReportHelpers/mainHandle';

export default function SwimmingPoolPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [poolData, setPoolData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('today');
    const [overviewData, setOverviewData] = useState({

    total_cash: { value: 0 },
    total_transfers: { value: 0 },
    total_sold: { value: 0 },
    low_stock: { value: 0 },
    out_of_stock: { value: 0 },

    })

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
                populate: '*',
                'pagination[pageSize]': 100,
                'filters[hotel_services][id][$notNull]': true, // Ensures we only get bookings with at least one service
                'filters[createdAt][$gte]': formatDate(startDate),
                'filters[createdAt][$lte]': formatDate(endDate),
            });


        const newResponse = await handleMainRecord(formatDate(startDate), formatDate(endDate), 'hotel');
        console.log('Overview response:', newResponse);

      if (newResponse?.overview) {
        setOverviewData({
          total_sold: { value: newResponse.overview.hotelSales },
          total_transfers: { value: newResponse.overview.totalTransfers },
          total_cash: { value: 0 },
          low_stock: { value: 0 },
          out_of_stock: { value: 0 }
        });
      }
            // Flatten response so each hotel_service becomes its own row
          
                      // Map the response data to fit the structure required by SwimmingPoolList
            const mappedData = response?.flatMap((item: any) => 
                item.hotel_services?.map((service: any) => ({
                    id: item.id,
                    documentId: item.documentId,
                    name: service.name || "N/A",
                    price: service.price || 0,
                    quantity: item.quantity || 0,
                    amountPaid: item.amount_paid || 0
                })) || []
            );
            // console.log('pool data:', mappedData);
            setPoolData(mappedData);
            // setPoolData(mappedData);
            console.log('mapped Service data:', mappedData);
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
                <h1 className="text-2xl font-bold">Service Bookings</h1>

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

                     <Suspense fallback={<div>Loading service list...</div>}>
                    <SwimmingPoolList hotelServices={poolData} />
                    </Suspense>



                </div>
               
            )}
        </div>
    );
}
