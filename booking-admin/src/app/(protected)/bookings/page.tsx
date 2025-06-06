'use client'
import React from "react"
import { Button } from "@/components/ui-elements/button"
import { useRouter } from "next/navigation"
import { InterActiveGuestList } from "./_components/interactive-guest-list"

export default function BookingsPage() {

  const router = useRouter();
 
  return (
    <div className="relative">
      <Button
          onClick={() => router.push('/bookings/new-booking')}
          className="btn btn-primary my-3"
          label="Create New Booking"
      />
      <div>
      </div> 
      <InterActiveGuestList />
    </div>
  )
}
