
// playerPerspective module
//used to create perspective used by UI for interpreting each players respective views, should eventually use class to depict this model
class PlayerPerspective {

    //applies heavy filter to obtain correct display information on client side for any given user
    static getStartingPerspective(player1or2, gameConfig) {
        console.log("in constructor, gameConfig roomId is "
            + JSON.stringify(gameConfig.roomId) + " and player socketid passed is " + JSON.stringify(player1or2));

        //nd hand, bench, active
        let returnPerspective = {};
        //important structor of data here, client is expecting this format in order to produce accurate status of game
        //any 'attachedAs' properties should always have a valid bench/active position 0-5, with exception of trainers, which should only be active (0) position, see game.js

        const requestingUsersCards = gameConfig.players.find(element => element.socketId === player1or2).cards;
        returnPerspective["inHand"] = requestingUsersCards.filter(element => element.isHand === true);
        //refactored to add all attached to active as well to be returned
        returnPerspective["active"] = requestingUsersCards.filter(element =>
            element.isActive === true || element.attachedAsEvo === 0 || element.attachedAsEnergy === 0 || element.attachedAsEvo === 0);


        returnPerspective["deckCount"] = requestingUsersCards.filter(element => element.isInDeck === true).length;
        returnPerspective["prizeCount"] = requestingUsersCards.filter(element => element.isPrizeCard === true).length;
        //need to push new array each bench found to this property
        returnPerspective["bench"] = [];
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
        console.log('returnPerspective for bench is ' + JSON.stringify(returnPerspective["bench"]))

        //add all bench to list first



        returnPerspective["isDiscarded"] = requestingUsersCards.filter(element => element.isDiscarded === true);


        console.log("found requesting player for perspective?" + requestingUsersCards[0].name);
        const opponentsCards = gameConfig.players.find(element => element.socketId !== player1or2).cards;
        returnPerspective["oppInHandCount"] = opponentsCards.filter(element => element.isHand === true).length;
        returnPerspective["oppActive"] = opponentsCards.filter(element => element.isActive === true);
        returnPerspective["oppDeckCount"] = opponentsCards.filter(element => element.isInDeck === true).length;
        returnPerspective["oppPrizeCount"] = opponentsCards.filter(element => element.isPrizeCard === true).length;
        returnPerspective["oppBench"] = opponentsCards.filter(element => element.isBench === true);//should always have a valid bench position 1-5 if 'isBench' is true, see Game.js
        //todo add logic from above once tested for active/bench of self, then we can do opponent with assurance
        returnPerspective["oppIsDiscarded"] = opponentsCards.filter(element => element.isDiscarded === true);

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


        return returnPerspective;
    }

    //todo typical getRespective instead of starting may be required

    // getPerspective



}

// Export this module
module.exports = PlayerPerspective