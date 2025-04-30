'use client'
import React, { useEffect, useState } from 'react'

type FoodItem = {
  id: number
  documentId: string
  name: string
}

type BookingItem = {
  id: number
  documentId: string
  quantity: number
  amount_paid: number
  food_items: FoodItem[]
}

export default function FoodItemsList() {
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchBookingItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        'https://hotel-booking-manager-api.onrender.com/api/booking-items?populate=*&pagination[pageSize]=100'
      )
      const json = await res.json()

      if (Array.isArray(json.data)) {
        // Filter only those booking items that have non-empty food_items
        const itemsWithFood = json.data.filter((item: BookingItem) =>
          Array.isArray(item.food_items) && item.food_items.length > 0
        )
        setBookingItems(itemsWithFood)
      } else {
        console.warn('Unexpected API format:', json)
        setBookingItems([])
      }
    } catch (err) {
      console.error('Error fetching booking items:', err)
      setBookingItems([])
    } finally {
      setLoading(false)
    }
  }

  const deleteBookingItem = async (documentId: string) => {
    try {
      const res = await fetch(
        `https://hotel-booking-manager-api.onrender.com/api/booking-items/${documentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!res.ok) throw new Error('Delete failed')
      await fetchBookingItems()
    } catch (err) {
      console.error(`Failed to delete booking item ${documentId}:`, err)
    }
  }

  useEffect(() => {
    fetchBookingItems()
  }, [])

  const filtered = bookingItems.filter((item) =>
    item.food_items.some((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Booking Items with Food</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No matching food items found.</p>
      ) : (
        <ul className="list-group">
          {filtered.map((booking) => (
            <li
              key={booking.id }
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>Booking #{booking.id}</strong>
                <br />
                {booking.food_items.map((food) => (
                  <span key={food.id} className="badge bg-secondary me-2">
                    {food.name} - {food.documentId}

                  </span>
                ))}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteBookingItem(booking.documentId)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
