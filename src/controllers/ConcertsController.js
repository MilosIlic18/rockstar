const ConcertsService = require("../services/ConcertsService");
const CardService = require("../services/CardService")
const index = require("../../index");

exports.index = async(req,res)=>{
    var concerts = await ConcertsService.findAllConcerts();
    var user = index.getUser(req.cookies["session"]);
    //res.json(concerts);
    res.render("concert/main",{layout:"layouts/main", data:{"data":concerts,"user":user}})
}

exports.reserveCard = async(req,res) => {
    var concertId=req.params.id_concert;
    var user = index.getUser(req.cookies["session"]);
        if(user==undefined)
            res.redirect("/auth/login")
    else
        {
        var nonReservedCard = await ConcertsService.findOneNonReservedCard(concertId);
        nonReservedCard=nonReservedCard[0].cards[0];
        if(nonReservedCard!=undefined)
        {
            nonReservedCard.is_reserved = true;
            nonReservedCard.id_user_reserved = user.id_users;
            nonReservedCard =await CardService.reserveCard(nonReservedCard);
            res.redirect("/concerts/usersCards");
        }
    else{
            res.redirect("/concerts");
        }
    }
}

exports.buyCard = async(req,res) => {
    var concertId=req.params.id_concert;

var user = index.getUser(req.cookies["session"]);
if(user==undefined)
     res.redirect("/auth/login")
else
    {
        console.log(req.params);
        var nonBuyCard = await ConcertsService.findOneNonBuyCard(concertId);
        nonBuyCard=nonBuyCard[0].cards[0];
        if(nonBuyCard!=undefined)
        {
            nonBuyCard.is_reserved = true;
            nonBuyCard.is_sold = true;
            nonBuyCard.id_user_bought = user.id_users;
            nonBuyCard.id_user_reserved = user.id_users;
            nonBuyCard =await CardService.buyCard(nonBuyCard);
            res.redirect("/concerts/usersCards");
        }
        else
        {
            res.redirect("/concerts");
        }
 }
}

exports.buyReservedCard = async(req,res) => {
    var idCard = req.params.id_card;
    var user = index.getUser(req.cookies["session"]);
    if(user==undefined)
    {
        res.redirect("/auth/login");
    }
    else
    {
        var reservedCard = await ConcertsService.findReservedCard({idCard:idCard,idUser:user.id_users});
        if(reservedCard.length <= 0 )
        {
            res.json("WRONG CARD");
        }
        else
        {
            reservedCard=reservedCard[0].cards[0];
            reservedCard.is_sold = true;
            reservedCard.id_user_bought = user.id_users;
            reservedCard = await CardService.buyCard(reservedCard);
            res.redirect("/concerts/usersCards");
        }
    }
}

exports.findCardsOfUser = async(req,res) =>
{
    var user = index.getUser(req.cookies["session"]);
    if(user==undefined)
    {
        res.redirect("/auth/login");
    }
    else{
        if(user.role!="admin"){
            var cards = await CardService.findAllCardsOfUser(user.id_users);
            if(cards.length>0)
            {
                res.render("cart/cart",{layout:"layouts/main",data:{"data":cards,"user":user}});
            }
            else
            {
                res.render("cart/cart",{layout:"layouts/main",data:{"data":cards,"user":user}});
            }
        }else{res.redirect("/concerts")}
    }
}