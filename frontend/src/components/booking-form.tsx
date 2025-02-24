export default function BookingForm() {
  return (
    <div className="book_room">
      <h1>Book a Room Online</h1>
      <form className="book_now">
        <div className="row">
          <div className="col-md-12">
            <span>Arrival</span>
            <img className="date_cua" src="/images/date.png" alt="calendar" />
            <input className="online_book" placeholder="dd/mm/yyyy" type="date" name="arrival" />
          </div>
          <div className="col-md-12">
            <span>Departure</span>
            <img className="date_cua" src="/images/date.png" alt="calendar" />
            <input className="online_book" placeholder="dd/mm/yyyy" type="date" name="departure" />
          </div>
          <div className="col-md-12">
            <button className="book_btn">Book Now</button>
          </div>
        </div>
      </form>
    </div>
  )
}
