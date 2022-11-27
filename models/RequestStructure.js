

class RequestStructure{
    ENERGY_ATTACH = 0;
  TRAINER_ACTIVATE= 1;
  RETREAT_ORDER=2;
  EVOLVE_ORDER = 3;
  ATTACK_ORDER = 4;
  POKE_POWER = 5;
//TBD for actions like trainers/pokemon power response i.e. gust of wind opp choice
  SPECIAL_RESPONSE= 6;

//IMPORTANT THIS MATCHES THE FRONTEND FOR APPROPRIATE REQUEST INTENTION RESOLUTION
  HAND = 0;
  ACTIVE = 1;
  DISCARD = 2;
  PRIZE = 3;
  DECK = 4;
  BENCH1 = 5;
  BENCH2 = 6;
  BENCH3 = 7;
  BENCH4 = 8;
  BENCH5 = 9;
  OPPPRIZE = 10;
  OPPACTIVE = 11;
  OPPDISC = 12;
  OPPBENCH1 = 13;
  OPPBENCH2 = 14;
  OPPBENCH3 = 15;
  OPPBENCH4 = 16;
  OPPBENCH5 = 17;
	CATEGORY = -1;
    //TBD, different structure for each, start with sample energy attach and build this out from there
    REQ_INFO={srcStack: -1, destStack: -1, slctdSrcCardIndex: -1, slctdDestCardIndex: -1 };
     constructor(arg) {  //  ructor
        console.log('arg passed to  ructor is ' + JSON.stringify(arg))
        this.REQ_INFO = arg.REQ_INFO
        this.CATEGORY = arg.CATEGORY
    }


	

}

module.exports = RequestStructure;