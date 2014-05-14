module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
				"PORT" : 5000
			};
        case 'production':
            return {
				"PORT" : 5000
			};
        default:
            return {
				"PORT" : 5000
			};
    }
};