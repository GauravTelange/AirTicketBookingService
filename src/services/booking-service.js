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
             let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
             const flight =  await axios.get(getFlightRequestURL);
             console.log('FROM BOOKING SERVICE',flight.data);
             return flight.data;
            } catch (error) {
             throw new ServiceError();
          }

    }
 } 

 module.exports = BookingService;