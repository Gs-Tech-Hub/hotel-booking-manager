'use client'
import React, { useState } from "react"
import { GuestList } from "../(home)/_components/guest-list"
import { Button } from "@/components/ui-elements/button"
import { useRouter } from "next/navigation"

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
      <GuestList />
    </div>
  )
}
