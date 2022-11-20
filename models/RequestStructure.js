const ENERGY_ATTACH = 0;
const TRAINER_ACTIVATE= 1;
const RETREAT_ORDER=2;
const EVOLVE_ORDER = 3;
const ATTACK_ORDER = 4;
const POKE_POWER = 5;
//TBD for actions like trainers/pokemon power response i.e. gust of wind opp choice
const SPECIAL_RESPONSE= 6;

//IMPORTANT THIS MATCHES THE FRONTEND FOR APPROPRIATE REQUEST INTENTION RESOLUTION
const HAND = 0;
const ACTIVE = 1;
const DISCARD = 2;
const PRIZE = 3;
const DECK = 4;
const BENCH1 = 5;
const BENCH2 = 6;
const BENCH3 = 7;
const BENCH4 = 8;
const BENCH5 = 9;
const OPPPRIZE = 10;
const OPPACTIVE = 11;
const OPPDISC = 12;
const OPPBENCH1 = 13;
const OPPBENCH2 = 14;
const OPPBENCH3 = 15;
const OPPBENCH4 = 16;
const OPPBENCH5 = 17;

class RequestStructure{
	CATEGORY = -1;
    //TBD, different structure for each, start with sample energy attach and build this out from there
    REQ_INFO={srcStack: -1, destStack: -1, slctdSrcCardIndex: -1, slctdDestCardIndex: -1 };
    constructor(arg) {  // Constructor
        console.log('arg passed to constructor is ' + JSON.stringify(arg))
        this.REQ_INFO = arg.REQ_INFO
        this.CATEGORY = arg.CATEGORY
    }


	

}

module.exports = RequestStructure;