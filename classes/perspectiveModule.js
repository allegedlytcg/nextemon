
// playerPerspective module
//used to create perspective used by UI for interpreting each players respective views
class PlayerPerspective {

    static getPerspective(player1or2, gameConfig) {
        console.log("in constructor, gameConfig roomId is "
            + JSON.stringify(gameConfig.roomId), " and player socketid passed is " + JSON.stringify(player1or2));
        //nd hand, bench, active
        this.hand = "yourHand";
        this.oppHand = "oppHand";
        this.discard = "discard";
        this.bench = "bench";
        this.active = "active";
        this.activeAttached = "activeAttached";
    }
 


}

// Export this module
module.exports = PlayerPerspective