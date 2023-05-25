const adminService = require("../services/AdminService")
const indexFile = require("../../index")
exports.createConcert = (req,res)=>{
    var user = indexFile.getUser(req.cookies["session"])
    res.render("",{layout:"layouts/admin",data:{"user":user}})
}

exports.findAllConcerts = async (req,res) =>
{
    var concerts = await adminService.findAllConcerts();
    res.json(concerts);
    //res.render("concert/main",{layout:"layouts/main",data:concerts});
}

exports.createAlbum = async(req,res)=>{
    var user = indexFile.getUser(req.cookies["session"])
    res.render("",{layout:"layouts/admin",user:user})
}

exports.createSong = async(req,res)=>{
    
    var user = indexFile.getUser(req.cookies["session"])
    var album = await adminService.findAllAlbum()
    res.render("",{layout:"layouts/admin",data:{"data":album,"user":user}})
}


exports.createConcertProccess = async(req,res)=>{
    var concert = {
        country:req.body.country,
        city:req.body.city,
        description:req.body.description,
        is_active:true,
        start_date:req.body.start_date
    }
    adminService.createConcert(concert).then(
        function (newConcert) {
            for(let i=0;i<req.body.cardsCount;i++)
            {
                adminService.createCard({
                    "is_sold":false,
                    "is_reserved":false,
                    "id_concert":newConcert.id_concert
                })
            }
            res.render("",{layout:"layouts/admin",data:"Uspesno unesen koncert"})
        }).catch(function (error) { res.render("",{layout:"layouts/admin",msg:"Doslo je do greske"})});
}
exports.createAlbumProccess = async(req,res)=>{
    adminService.createAlbum(req.body).then(()=>res.render("",{layout:"layouts/admin",data:"Uspesno unesen album"})).catch(err=>res.render("",{layout:"layouts/admin",data:err}))
}

exports.createSongProccess = async(req,res)=>{
    adminService.createSong(req.body).then(()=>res.render("",{layout:"layouts/admin",data:"Uspesno unesena pesma"})).catch(err=>res.render("",{layout:"layouts/admin",data:err}))
}