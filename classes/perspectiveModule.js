
// playerPerspective module
//used to create perspective used by UI for interpreting each players respective views
class PlayerPerspective {

    //applies heavy filter to obtain correct display information on client side for any given user
    static getStartingPerspective(player1or2, gameConfig) {
        console.log("in constructor, gameConfig roomId is "
            + JSON.stringify(gameConfig.roomId)+ " and player socketid passed is " + JSON.stringify(player1or2));
 
        //nd hand, bench, active
        let returnPerspective = {};
        //important structor of data here, client is expecting this format in order to produce accurate status of game
      
        
        const requestingUsersCards = gameConfig.players.find(element => element.socketId === player1or2).cards;
        returnPerspective["inHand"] = requestingUsersCards.filter(element => element.isHand === true);
        // returnPerspective["active"] = requestingUsersCards.filter(element => element.isActive === true);
        // returnPerspective["deckCount"] = requestingUsersCards.filter(element => element.isInDeck === true).length;
        // returnPerspective["prizeCount"] = requestingUsersCards.filter(element => element.isPrizeCard === true).length;
        // returnPerspective["bench"] = requestingUsersCards.filter(element => element.isBench === true);//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        // returnPerspective["attachedEnergy"] = requestingUsersCards.filter(element => element.attachedAsEnergy === true);//should always have a valid bench/active position 0-5 
        // returnPerspective["attachedEvolutions"] = requestingUsersCards.filter(element => element.attachedAsEvo === true);//should always have a valid bench/active position 0-5 
        // returnPerspective["attachedTrainers"] = requestingUsersCards.filter(element => element.attachedAsTrainer === true);//should only be on active pokemon using numeric indicator 0 see Game.js


		console.log("found requesting player for perspective?" + requestingUsersCards[0].name);
        const opponentsCards = gameConfig.players.find(element => element.socketId !== player1or2).cards;
        // returnPerspective["oppInHandCount"] = opponentsCards.filter(element => element.isHand === true).length;
        // returnPerspective["oppActive"] = opponentsCards.filter(element => element.isActive === true);
        // returnPerspective["oppDeckCount"] = opponentsCards.filter(element => element.isInDeck === true).length;
        // returnPerspective["oppPrizeCount"] = opponentsCards.filter(element => element.isPrizeCard === true).length;
        // returnPerspective["oppBench"] = opponentsCards.filter(element => element.isBench === true);//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        // returnPerspective["oppAttachedEnergy"] = opponentsCards.filter(element => element.attachedAsEnergy === true);//should always have a valid bench/active position 0-5 
        // returnPerspective["oppAttachedEvolutions"] = opponentsCards.filter(element => element.attachedAsEvo === true);//should always have a valid bench/active position 0-5 
        // returnPerspective["oppAttachedTrainers"] = opponentsCards.filter(element => element.attachedAsTrainer === true);//should only be on active pokemon using numeric indicator 0 see Game.js
        
        console.log("found opposing player for perspective?" + opponentsCards[0].name);


        // console.log("return perspective opp hand count is " + returnPerspective["oppInHandCount"] + " while requesting players cards in hand are " + JSON.stringify(returnPerspective["inHand"]));
        // console.log("requesting players cards in hand are " + returnPerspective["inHand"]);

        return returnPerspective;
    }

    //todo typical getRespective instead of starting may be required

    // getPerspective
 


}

// Export this module
module.exports = PlayerPerspective