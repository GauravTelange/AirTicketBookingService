 const axios = require('axios');
 
 const {BookingRepository} = require('../repository/index');
 const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');
 class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
         try {
             const flightId = data.flightId;
             const userId = data.userId;
             const noOfSeats = data.noOfSeats;

             const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
             const response =  await axios.get(getFlightRequestURL);
             const flightData =response.data.data;
             let flightPrice = flightData.price;

             if(data.noOfSeats > flightData.totalSeats){
                 throw new ServiceError('Something went wrong in the booking process',
                    'Insufficient seats in the flight');
             }


             const totalCost =  
             noOfSeats *  flightPrice;
             const bookingPayload = {...data, totalCost};

             const booking = await this.bookingRepository.create(bookingPayload);
            
             const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
             await axios.patch(updateFlightRequestURL, {
                totalSeats: flightData.totalSeats - noOfSeats});
             const finalBooking = await this.bookingRepository.update(booking.id,{status:"Booked"});
             return finalBooking;

            } catch (error) {
                console.log(error);
                if(error.name == 'RepositoryError'  || error.name == 'ValidationError'){
                    throw error;
                }
             throw new ServiceError();
          }

    }
 } 

 module.exports = BookingService;