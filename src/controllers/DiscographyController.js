
const DiscographyService = require("../services/DiscographyService");

exports.index = async(req,res)=>{
    var allSongs = await DiscographyService.findAllSongs();
    //res.json(allSongs);
    res.render("discography/main",{layout:"layouts/main", data: allSongs})
}