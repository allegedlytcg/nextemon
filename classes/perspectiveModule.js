
// playerPerspective module houses all requests of action and changes to perspectives throughout gameplay

const Perspective = require("../models/Perspective");
const RequestStructure = require("../models/RequestStructure");

//used to create perspective used by UI for interpreting each players respective views, should eventually use class to depict this model
class PlayerPerspective {

    
    //applies heavy filter to obtain correct display information on client side for any given user
    static getCurrentPerspectiveForGamePlayer(player1or2, gameConfig) {
        console.log("in constructor, gameConfig roomId is "
            + JSON.stringify(gameConfig.roomId) + " and player socketid passed is " + JSON.stringify(player1or2));

        //nd hand, bench, active
        let returnPerspective = new Perspective();
        //important structor of data here, client is expecting this format in order to produce accurate status of game
        //any 'attachedAs' properties should always have a valid bench/active position 0-5, with exception of trainers, which should only be active (0) position, see game.js

        const requestingUsersCards = gameConfig.players.find(element => element.socketId === player1or2).cards;
        const requestingUserIsTurn = gameConfig.players.find(element => element.socketId === player1or2).turn;
        returnPerspective["isTurn"] = requestingUserIsTurn;
        console.log('This players turn? ' + returnPerspective["isTurn"])
        returnPerspective["energyAttachedThisTurn"] = returnPerspective["energyAttachedThisTurn"]
        console.log('Energy attach for this players turn? ' + returnPerspective["energyAttachedThisTurn"])
        returnPerspective["inHand"] = requestingUsersCards.filter(element => element.isHand === true);
        //refactored to add all attached to active as well to be returned
        returnPerspective["active"] = requestingUsersCards.filter(element =>
            element.isActive === true || element.attachedAsEvo === 0 || element.attachedAsEnergy === 0);


        returnPerspective["deckCount"] = requestingUsersCards.filter(element => element.isInDeck === true).length;
        returnPerspective["prizeCount"] = requestingUsersCards.filter(element => element.isPrizeCard === true).length;
        //need to push new array each bench found to this property
        // returnPerspective["bench"] = [];
        const benchCards = requestingUsersCards.filter(element => element.isBench === true);//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        if (benchCards === undefined) {
            console.log('bench cards not defined!')
        }
        if (benchCards !== undefined) {
            benchCards.forEach(
                card => returnPerspective["bench"].push([card]));
            console.log('bench cards found are now ' + JSON.stringify(benchCards));
        };

        for (let i = 0; i < returnPerspective["bench"].length; i++) {
            console.log('returnperspective[bench] is ' + JSON.stringify(returnPerspective["bench"][i]) + ' AND of type ' + typeof (returnPerspective["bench"]))
            let foundAttachedEvo = requestingUsersCards.filter(card => i + 1 === card.attachedAsEvo);
            foundAttachedEvo.forEach(attachedEvo => returnPerspective["bench"][i].push(attachedEvo))


            let foundAttachedEnergy = requestingUsersCards.filter(card => i + 1 === card.attachedAsEnergy);
            foundAttachedEnergy.forEach(attachedEner => returnPerspective["bench"][i].push(attachedEner))

            //no attached trainers on bench

        }
        // console.log('returnPerspective for bench is ' + JSON.stringify(returnPerspective["bench"]))
        console.log('returnPerspective for prizes is ' + JSON.stringify(returnPerspective["prizeCount"]))


        //add all bench to list first



        returnPerspective["isDiscarded"] = requestingUsersCards.filter(element => element.isDiscarded === true);


        console.log("found requesting player for perspective?" + requestingUsersCards[0].name);
        const opponentsCards = gameConfig.players.find(element => element.socketId !== player1or2).cards;
        returnPerspective["oppInHandCount"] = opponentsCards.filter(element => element.isHand === true).length;
        returnPerspective["oppActive"] = opponentsCards.filter(element => element.isActive === true);
        returnPerspective["oppDeckCount"] = opponentsCards.filter(element => element.isInDeck === true).length;
        returnPerspective["oppPrizeCount"] = opponentsCards.filter(element => element.isPrizeCard === true).length;
        returnPerspective["oppBench"] = [];//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        const oppBenchCards = opponentsCards.filter(element => element.isBench === true);//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        if (oppBenchCards === undefined) {
            console.log('bench cards not defined!')
        }
        if (oppBenchCards !== undefined) {
            oppBenchCards.forEach(
                card => returnPerspective["oppBench"].push([card]));
            console.log('opp bench cards found are now ' + JSON.stringify(oppBenchCards));
        };
        for (let i = 0; i < returnPerspective["oppBench"].length; i++) {
            console.log('returnperspective[oppBench] is ' + JSON.stringify(returnPerspective["oppBench"][i]) + ' AND of type ' + typeof (returnPerspective["oppBench"]))
            let foundAttachedEvo = opponentsCards.filter(card => i + 1 === card.attachedAsEvo);
            foundAttachedEvo.forEach(attachedEvo => returnPerspective["oppBench"][i].push(attachedEvo))


            let foundAttachedEnergy = opponentsCards.filter(card => i + 1 === card.attachedAsEnergy);
            foundAttachedEnergy.forEach(attachedEner => returnPerspective["oppBench"][i].push(attachedEner))

            //no attached trainers on bench

        }
        returnPerspective["oppIsDiscarded"] = opponentsCards.filter(element => element.isDiscarded === true);
        console.log('returnPerspective for prizes OPPONENT is ' + JSON.stringify(returnPerspective["oppPrizeCount"]))

        // console.log("found opposing player for perspective?" + opponentsCards[0].name);


        // console.log("return perspective opp hand count is " + returnPerspective["oppInHandCount"] + " while requesting players cards in hand are " + JSON.stringify(returnPerspective["inHand"]));
        // console.log("requesting players cards in hand are " + returnPerspective["inHand"]);
        //todo log various parts  of the expected properties to be given as perspective
        // console.log("requesting players active is " + returnPerspective["active"]);
        // console.log("requesting players deckCount is " + returnPerspective["deckCount"]);
        // console.log("requesting players prizeCount is " + returnPerspective["prizeCount"]);
        // console.log("requesting players bench is " + returnPerspective["bench"] + " and of type" + typeof (returnPerspective["bench"]));
        // console.log("requesting players attachedEnergy is " + returnPerspective["attachedEnergy"]);
        // console.log("requesting players attachedEvolutions is " + returnPerspective["attachedEvolutions"]);
        // console.log("requesting players attachedTrainers is " + returnPerspective["attachedTrainers"]);
        //opposing player viewable content to player
        // console.log("Opposing players oppInHandCount is " + returnPerspective["oppInHandCount"]);
        // console.log("Opposing players oppActive is " + returnPerspective["oppActive"]);
        // console.log("Opposing players oppDeckCount is " + returnPerspective["oppDeckCount"]);
        // console.log("Opposing players oppPrizeCount is " + returnPerspective["oppPrizeCount"]);
        // console.log("Opposing players oppBench is " + returnPerspective["oppBench"]);
        // console.log("Opposing players oppAttachedEnergy is " + returnPerspective["oppAttachedEnergy"]);
        // console.log("Opposing players oppAttachedEvolutions is " + returnPerspective["oppAttachedEvolutions"]);
        // console.log("Opposing players oppAttachedTrainers is " + returnPerspective["oppAttachedTrainers"]);



        // console.log("requesting players cards in hand are " + returnPerspective["inHand"]);

        // console.log("requesting players cards in hand are " + returnPerspective["inHand"]);

        // console.log("requesting players cards in hand are " + returnPerspective["inHand"]);

        console.log('entire return perspective? ' + JSON.stringify(returnPerspective))
        return returnPerspective;
    }
    
    //Entry point to game config changes
    //requestedConfig is sent by client, requesting action during their turn/responsive to some action
    static getChangeRequestDecisionForGamePlayer(player1or2, gameConfig, requestFromPlayer){
        
        //get current perspective change it later if permissed
        let requestorPerspective = PlayerPerspective.getCurrentPerspectiveForGamePlayer(player1or2, gameConfig);
        // console.log("on update request, current Game config is " + JSON.stringify(requestorPerspective));
        console.log("requested action structure is as follows" + JSON.stringify(requestFromPlayer));
        // return small object indicating to the front end if its rejected(no view returned),otherwise send both obj and view
        let respObj = {changeApproved: false, perspective: requestorPerspective }
        if(requestorPerspective.isTurn === false){
            console.log('NOT THIS PLAYERS TURN, SHOULD CORRECT THIS IF HAPPENING VIA GUI UNINTENTIONALLY');
            return respObj;
        }
        else{
            console.log('finish changing game config base don player request here');
            switch(requestFromPlayer.CATEGORY){
                case(requestFromPlayer.ENERGY_ATTACH):
                    console.log('hit ENERGY ATTACH request')
                    respObj = this.energyAttachRequest(respObj, requestFromPlayer)

                    //we know its energy attach hit from here
                    break;
                case(requestFromPlayer.TRAINER_ACTIVATE):
                    console.log('hit TRAINER ACTIVATE request')

                    break;
                case(requestFromPlayer.RETREAT_ORDER):
                    console.log('hit RETREAT ORDER request')

                    break;
                case(requestFromPlayer.EVOLVE_ORDER):
                    console.log('hit EVOLVE ORDER request')

                    break;
                case(requestFromPlayer.ATTACK_ORDER):
                console.log('hit ATTACK ORDER request')

                    break;
                case(requestFromPlayer.POKE_POWER):
                console.log('hit ENERGY ATTACH request')

                    break;
                default:
                    console.log('INVALID REQUEST DID NOT MATCH ANY TYPES')
                    break;

            }

            //expedited updated return perspective based on the new gameConfig regardless of request type for above and changes desired
            //also vital part in returning updated for opponent later on by updating gameConfig
            return respObj;
        }
    }


    static energyAttachRequest(respObj, requestStructure){
       
        //check if energy was attached yet this turn
        let checkIsToBenchOrActive =  this.isToBenchOrActive(requestStructure.REQ_INFO.destStack)
        if(!respObj.perspective.energyAttachedThisTurn && (requestStructure.HAND === requestStructure.REQ_INFO.srcStack) && checkIsToBenchOrActive){
            console.log('Permitted the energy attach request!')
            console.log("REQUEST STRUCTURE constant logging is " + JSON.stringify(requestStructure.ENERGY_ATTACH))

               //if any of the above are false, return respObj, otherwise change the gameConfiguration and save to db
     
            respObj.perspective.energyAttachedThisTurn = true;
            respObj.changeApproved = true;
            // changeGameConfig()
        

            return respObj
        }
        else{
            console.log('Energy attach Request not permitted!')
            return respObj
        }


    }
    static isToBenchOrActive(destStack){
        let isAllowed = false
        let arg = {REQ_INFO: {}, CATEGORY: -1};
        let reqStructure = new RequestStructure(arg); //allows us to obtain the constants
        switch(destStack){
            case(reqStructure.BENCH1):
                isAllowed = true
                break;
            case(reqStructure.BENCH2):
                isAllowed = true
                break;
            case(reqStructure.BENCH3):
                isAllowed = true
                break;
            case(reqStructure.BENCH4):
                isAllowed = true
                break;
            case(reqStructure.BENCH5):
                isAllowed = true    
                break;
            case(reqStructure.ACTIVE):
                isAllowed = true
                break;
            default:
                break;
            
        }

        return isAllowed;
    }
    static trainerActiveRequest(){

    }

    static retreatOrderRequest(){

    }
    static evolveOrderRequest(){

    }
    static attackOrderRequest(){

    }
    static pokePowerRequest(){

    }

    //finalize game config changes to db
    // static changeGameConfig(newConfig){

    // }





}

// Export this module
module.exports = PlayerPerspective