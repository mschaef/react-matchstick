import winston from 'winston';

let Logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true
        })
    ]
});

Logger.stream = {
    write: function(message, encoding){
        Logger.info(message);
    }
};

export default Logger;
