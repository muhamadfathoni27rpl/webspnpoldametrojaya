const   main = require('../controller/main'),
        jwt = require('jsonwebtoken')
  
function jwt_token(req, res, next) {
    const tokens = req.cookies.logged;  
    if (!tokens) return res.status(401).redirect("/login");
      jwt.verify(tokens, "%lido%", (err, decoded) => {
        if(err){res.redirect('/login')}
        else{
          req.decoded = decoded
          req.tokenku = tokens
          next()
        }
    });
  }

function jwt_tokens(req, res, next) {
    const tokens = req.cookies.logged;  
    if (!tokens) return res.status(401).redirect("/login");
      jwt.verify(tokens, "%lido%", (err, decoded) => {
        if(err || decoded.level != 'admin'){res.redirect('/login')}
        else{
          req.decoded = decoded
          req.tokenku = tokens
          next()
        }
    });
  }
module.exports=(app)=>{
    app.get('/',            main.index)
    app.get('/galeri',      main.indexGalery)
    app.get('/profil',      main.indexProfile)

    
    app.get('/login' ,      main.loginLibrary)
    app.get('/daftar'  ,    main.daftarLibrary)
    app.get('/logout' ,     main.logoutLibrary)
    app.get('/library' ,    jwt_token , main.homeLibrary)
    app.get('/katalog',     jwt_token , main.catalogLibrary)
    app.get('/kurikulum',   jwt_token , main.kurikulumLibrary)
    app.get('/search',      jwt_token , main.searchLibrary)
    app.get('/search1',      jwt_token , main.searchLibrary1)
    

    app.get('/admin/',                jwt_tokens , main.adminIndex)  
    app.get('/admin/buku',            jwt_tokens , main.adminBuku)
    app.get('/admin/anggota',         jwt_tokens , main.adminAnggota)
    app.get('/admin/logout' ,         jwt_tokens , main.adminLogout)
    app.get('/admin/:key/:tipe/:id' , jwt_tokens , main.adminMenu)
    app.get('/admin/kurikulum' ,      jwt_tokens , main.adminKurikulum)
    
    app.get('/api/:main/:key',              main.api)

    app.post('/daftar' ,                    main.postDaftarLibrary)
    app.post('/login' ,                     main.postLoginLibrary)
    app.post('/tambah/:key/:id',jwt_token , main.postTambah)
    app.post('/e/:key/:id', jwt_token ,     main.postMenuEdit)
}