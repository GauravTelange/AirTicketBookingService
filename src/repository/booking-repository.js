
const { Booking } = require('../models/index');

class BookingRepository{

    async create(data){
        try {
            
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError;
            }
        }
    }
}

module.exports = BookingRepository;