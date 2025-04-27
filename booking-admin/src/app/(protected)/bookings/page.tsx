    'use client'
import React from "react"
import { GuestList } from "../(home)/_components/guest-list"
import CreateBookingForm from "./create-booking-form"

export default function BookingsPage () {

    return (
        <div>
        <GuestList />
        <CreateBookingForm 
        />
        </div>
    )
}