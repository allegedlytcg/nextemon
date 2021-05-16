class Card
    {
        id= '';
        name= '';
        nationalPokedexNumber= null;
        imageUrl= '';
        imageUrlHiRes= '';
        types = [];
        supertype= '';
        subtype= '';
        hp= '';
        retreatCost= [];
        convertedRetreatCost = null;
        number= '';
        artist= '';
        rarity= '';
        series= '';
        set= '';
        setCode= '';
        attacks = [
            {
                cost:[],
                name: '',
                text: '',
                damage: '',
                convertedEnergyCost: null,
            }
        ];
        resistances= [
            {
                type: '',
                value: '',
            },
        ];
        weaknesses= [
            {
                type = '',
                value= '',
            }
        ];
}