const   jwt         = require('jsonwebtoken'),
        Sequelize   = require('sequelize'),
        Op          = Sequelize.Op,
        tbSiswa     = require('../models/tbl_siswa'),
        tbBuku      = require('../models/tbl_buku'),
        tbPetugas   = require('../models/tb_petugas'),
        tbKurikulum = require('../models/tbl_kurikulum'),
        fs          = require('fs'),
        aesjs       = require('aes-js'),
        aeskey      = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        bcrypt      = require('bcrypt')



function decode(key,i,cb){
    var eB_ = aesjs.utils.hex.toBytes(key),
    aesCtr  = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(5)),
    dB      = aesCtr.decrypt(eB_),
    result  = aesjs.utils.utf8.fromBytes(dB);
    cb(result)
}

//###############################################################################
//---------------------------- SPN MAIN -----------------------------------------
exports.index = (req,res) =>{
    tbBuku.findAll({}).then(dataBuku => {
        res.render('index',{dataBuku : dataBuku , a : 'active' , b : '' , c : '' , d : ''})
    })
}

exports.homeLibrary = (req,res) => {
    res.render('perpusIndex' , {a : 'active' , b : '' , c : '' , d : '' , nama : req.decoded.data})
} 

exports.indexGalery = (req,res) =>{
    res.render('galeri' , {a : '' , b : '' , c : 'active' , d : ''})
}

exports.indexProfile = (req,res) =>{
    res.render('profil' , {a : '' , b : '' , c : '' , d : 'active'})
}

//---------------------------- SPN MAIN -----------------------------------------
//###############################################################################

exports.catalogLibrary = (req,res) =>{
    tbBuku.findAll().then(dataBuku=>{
        res.render('katalog',{search : false , dataBuku : dataBuku , a : '' , b : 'active' , c : '' , d : '' , nama : req.decoded.data})
    })
}

exports.loginLibrary = (req,res) =>{
    const tokens = req.cookies.logged;  
    if (!tokens) return res.render('perpusLogin')
    jwt.verify(tokens, "%lido%", (err, decoded) => {
        if(err){  
            res.clearCookie("logged")
            res.render('perpusLogin')
        }
        else{
            console.log("ll");
            res.redirect('/library')
        }
    });    
}

exports.daftarLibrary = (req,res) =>{
    res.render('perpusRegister')
}

exports.logoutLibrary = (req,res) =>{
    res.clearCookie("logged")
    res.redirect('/library')
}

exports.searchLibrary = (req,res) =>{
    var key = req.query.cari
    tbBuku.findAll({
        where : { 
            judul : {
                [Op.substring] : [key]
            }
        }
    }).then(dataBuku =>{
        res.render('katalog' , {search : true , dataBuku : dataBuku, a : '' , b : 'active' , c : '' , d : ''  , nama : req.decoded.data, key : key})
    })
}
exports.searchLibrary1 = (req,res) =>{
    var key = req.query.cari
    tbKurikulum.findAll({
        where : { 
            judul : {
                [Op.substring] : [key]
            }
        }
    }).then(dataBuku =>{
        res.render('kurikulum' , {search : true , dataBuku : dataBuku, a : '' , b : '' , c : 'active' , d : ''  , nama : req.decoded.data, key : key})
    })
}
exports.kurikulumLibrary = (req,res) =>{
    tbKurikulum.findAll().then(dataBuku=>{
        res.render('kurikulum',{search : false , dataBuku : dataBuku , a : '' , b : '' , c : 'active' , d : '' , nama : req.decoded.data})
    })
    
}


exports.adminIndex = (req,res) =>{
    tbSiswa.findAll({}).then(dataSiswa => {
        tbBuku.findAll({}).then(dataBuku => {
            tbKurikulum.findAll({}).then(dataKurikulum => {
            res.render('admin/index' , {a : 'active' , b : '' , c : '' , d :'' , dataSiswa : dataSiswa , dataBuku : dataBuku ,dataKurikulum : dataKurikulum ,admin : req.decoded.data})
        })})
    })
}

exports.adminBuku = (req,res) =>{
    tbBuku.findAll().then(dataBuku=>{
        // res.send(dataBuku)
        res.render('admin/buku' , {a : '' , b : 'active' , c : '' , d :'' , dataBuku : dataBuku , admin : req.decoded.data})
    })
}

exports.adminAnggota = (req,res) =>{
    tbSiswa.findAll().then(dataSiswa=>{
        res.render('admin/anggota' , {a : '' , b : '' , c : 'active' , d :'' , dataSiswa : dataSiswa , admin : req.decoded.data})
    })
}

exports.adminKurikulum = (req,res) =>{
    tbKurikulum.findAll({}).then(dataKurikulum =>{
        res.render('admin/kurikulum' , {a : '' , b : '' , c : '' , d :'active' , dataKurikulum : dataKurikulum , admin : req.decoded.data})
    })
}

exports.adminMenu = (req,res) =>{
    var key     = req.params.key,   // e    | d
        tipe    = req.params.tipe,  // buku | anggota
        id      = req.params.id     // id

    if          (key == 'e')    {       // KEY = EDIT
        if      (tipe == 'buku'){       // MENGUBAH BUKU
            tbBuku.findOne({where : {id : id}}).then(dataBuku=>{
                if(dataBuku){
                    res.render('admin/bukuEdit' , {data : dataBuku , admin : req.decoded.data })
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'Buku tidak ditemukan'
                    }           
                    res.redirect('/')
                }  
            })
        }else if(tipe == 'anggota'){    // MENGUBAH ANGGOTA
            tbSiswa.findOne({where : {id : id}}).then(dataSiswa=>{
                if(dataSiswa){
                    res.render('admin/anggotaEdit' , {data : dataSiswa, admin : req.decoded.data})
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'Anggota tidak ditemukan'
                    }           
                    res.redirect('/library')
                }
            })
        }else if(tipe == 'kurikulum'){    // MENGUBAH KURIKULUM        eB_     = aesjs.utils.hex.toBytes(key);
                tbKurikulum.findOne({where : {id : id}}).then(dataKur=>{
                if(dataKur){
                    res.render('admin/kurikulumEdit' , {dataKur : dataKur, admin : req.decoded.data})
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'Anggota tidak ditemukan'
                    }           
                    res.redirect('/library')
                }
            })
        }else{
            res.redirect('/')
        }
    }else if    (key == 'd'){           // KEY = DELETE
        if      (tipe == 'buku'){       //MENGHAPUS BUKU
            tbBuku.destroy({where:{id : id}}).then(done=>{
                if(done){
                    req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'Buku Berhasil dihapus'
                    }           
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'Buku tidak ditemukan'
                    }
                }
                res.redirect('/admin/buku')
            })
        }else if(tipe == 'anggota'){    // MENGHAPUS ANGGOTA
            tbSiswa.destroy({where:{id : id}}).then(done=>{
                if(done){
                    req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'Anggota Berhasil dihapus'
                    }           
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'Anggota tidak ditemukan'
                    }
                }
                res.redirect('/admin/anggota')
            })
        }else if(tipe == 'kurikulum'){    // MENGHAPUS KURIKULUM
            tbKurikulum.findOne({where : {id : id}}).then(dataKur=>{
                decode(dataKur.file ,1, (dataDecode)=>{
                    tbKurikulum.destroy({where:{id : id}}).then(done=>{
                        if(done){
                            fs.unlinkSync('public/data/upload/'+dataDecode)
                            req.session.message = {
                                type: 'success',
                                intro: 'Berhasil !',
                                message: 'Kurikulum Berhasil dihapus'
                            }           
                        }else{
                            req.session.message = {
                                type: 'error',
                                intro: 'ERROR !',
                                message: 'Kurikulum tidak ditemukan'
                            }
                        }
                        res.redirect('/admin/kurikulum')
                    })
                })
            })
        }else{
            res.redirect('/')    
        }
    }else if    (key == 'a'){           // KEY = ADD
        if      (tipe == 'buku'){       // MENAMBAH BUKU
            res.render('admin/bukuAdd')
        }else if(tipe == 'anggota'){    // MENAMBAH ANGGOTA
            res.render('admin/anggotaAdd')
        }else if (tipe == 'kurikulum'){
            res.render('admin/kurikulumAdd')
        }else{
            res.redirect('/') 
        }
    }else{
        res.redirect('/')
    }
}

exports.adminLogout = (req,res) =>{
    res.clearCookie("logged")
    res.redirect('/library')
}

exports.api = (req,res) =>{
    var main    = req.params.main
    var key     = req.params.key
    if(key.length != 74 && key.length != 72){
        return res.redirect('/') 
    }
    var eB_ = aesjs.utils.hex.toBytes(key);
    var aesCtr = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(5));
    var dB = aesCtr.decrypt(eB_)
    var result = aesjs.utils.utf8.fromBytes(dB);
    fs.readFile('public/data/upload/'+result,function(err,data){
        if(err)  return console.log(err);
        if(main == 'pdf'){
            res.writeHead(200, {'Content-Type': 'application/pdf'})
            res.end(data)
        }else if(main == 'gambar'){
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            res.end(data)
        }else{
            res.redirect('/') 
        }
    })  
}

//=========================
// .
// .
// .
//======= POST ============
// . 
// . 
// .
//=========================
exports.postDaftarLibrary = (req,res) =>{
    var data = {
        id          : Math.floor(Math.random() * 1000000000),
        nama        :  req.body.nama.toUpperCase(),
        nosis       :  req.body.nosis,
        jenis_kelamin:  req.body.kelamin,
        tmp_lhr     : req.body.tmp_lahir,
        tgl_lhr     : req.body.tgl_lahir,
        asal_polda  : req.body.asal_polda,
        no_hp       : req.body.hp,
        alamat      : req.body.alamat
    }
    tbSiswa.findOne({ where: { nama: data.nama } }).then(dataSiswa=>{
        if(dataSiswa){
            req.session.message = {
                type: 'error',
                intro: 'ERROR !',
                message: 'User Sudah terdaftar'
            }            
        }else{
            // console.log(data);
            tbSiswa.create(data)
            req.session.message = {
                type: 'success',
                intro: 'Berhasil !',
                message: 'User Berhasil terdaftar'
            }           
        }
        res.redirect('/login')
    })
}

exports.postLoginLibrary = (req,res) =>{
    var data = {
        nama        :  req.body.user,
        key         :  req.body.pass,
    }
    tbPetugas.findOne({where:{username : data.nama}}).then(dataPetugas=>{
        if(dataPetugas){
            bcrypt.compare(data.key , dataPetugas.password ,(err , results)=>{
                if(results == true){
                    const data = { data: dataPetugas.nama , level : dataPetugas.level };
                    const token = jwt.sign(data, "%lido%", {
                        expiresIn: "99999s"
                    });        
                    res.cookie("logged", token);
                    res.redirect('/admin/')
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'User Tidak terdaftar'
                    }            
                    res.redirect('/login')
                }
            })
        }else{
            tbSiswa.findOne({where:{nama : data.nama , nosis : data.key } }).then(dataSiswa=>{
                if(dataSiswa){
                    const data = { data: dataSiswa.nama };
                    const token = jwt.sign(data, "%lido%", {
                        expiresIn: "99999s"
                    });        
                    res.cookie("logged", token);
                    res.redirect('/library')
                }else{
                    req.session.message = {
                        type: 'error',
                        intro: 'ERROR !',
                        message: 'User Tidak terdaftar'
                    }            
                    res.redirect('/login')
                }
            })
        }
    })
}

exports.postTambah = (req,res) =>{
    let key = req.params.key
    var id = req.params.id
    if(key == 'anggota'){   
        var data = {
            id          : Math.floor(Math.random() * 1000000000),
            nama        :  req.body.nama.toUpperCase(),
            nosis       :  req.body.nosis,
            jenis_kelamin:  req.body.kelamin,
            tmp_lhr     : req.body.tmp_lahir,
            tgl_lhr     : req.body.tgl_lahir,
            asal_polda  : req.body.asal_polda,
            no_hp       : req.body.hp,
            alamat      : req.body.alamat
        }
        tbSiswa.findOne({ where: { nama: data.nama } }).then(dataSiswa=>{
            if(dataSiswa){
                req.session.message = {
                    type: 'error',
                    intro: 'ERROR !',
                    message: 'User Sudah terdaftar'
                }            
            }else{
                // console.log(data);
                tbSiswa.create(data)
                req.session.message = {
                    type: 'success',
                    intro: 'Berhasil !',
                    message: 'User Berhasil ditambahkan'
                }           
            }
            res.redirect('/admin/anggota')
        })
    }else if(key == 'buku'){
        //################################################################################################
        // BUKU
        if(req.files){
            var akhire  = (req.files.gambar.mimetype);        
            var format  = akhire.split('image/')[1]         
            var namaGbr = req.files.gambar.md5
            var tB      = aesjs.utils.utf8.toBytes(namaGbr+'.'+format);
            var aesCtr  = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(5));
            var eB      = aesCtr.encrypt(tB);
            var hasil   = aesjs.utils.hex.fromBytes(eB);
            
            if(format == 'jpeg' || format == 'jpg' || format == 'png' ){ //Format gambar        
                fs.writeFile('./public/data/upload/' + namaGbr+'.' + format, req.files.gambar.data, (err) => {
                    if(err){return console.log(err);}
                    var data = {
                        id          : Math.floor(Math.random() * 1000000000),
                        judul       : req.body.judul,
                        pengarang   : req.body. pengarang,
                        edisi       :req.body.edisi,
                        thn_terbit  :req.body.thn_terbit,
                        penerbit    :req.body.penerbit,
                        jml         :req.body.jml,
                        rak_no      :req.body.rak_no,
                        kondisi     :req.body.kondisi,
                        img         : hasil
                    }
                    tbBuku.create(data).then(done=>{
                        req.session.message = {
                            type: 'success',
                            intro: 'Berhasil !',
                            message: 'Buku Berhasil ditambahkan'
                        }           
                        res.redirect('/admin/buku')
                    })
                })  
            }
        }else{
            req.session.message = {
                type: 'error',
                intro: 'Gagal !',
                message: 'Gambar Diperlukan'
            } 
            res.redirect('/admin/')
        }
        //################################################################################################
        // CLOSE BUKU

    }else if(key == 'kurikulum'){

        //################################################################################################
        // KURIKULUM
        if(req.files){
            let jenis   = ''
            if(req.body.jenis == 1){
                jenis = 'DIKTUK'
            }else if(req.body.jenis == 2){
                jenis = 'DIKBANG'
            }else if(req.body.jenis == 3){
                jenis = 'PELATIHAN'
            }else{
                req.session.message = {
                    type: 'error',
                    intro: 'Gagal !',
                    message: 'Jenis Kurikulum Tidak Tersedia'
                }       
                res.redirect('/admin/a/kurikulum/1')    
            }
            var akhire  = (req.files.files.mimetype);        
            var format  = akhire.split('application/')[1]         
            var filepdf = req.files.files.md5
            var tB      = aesjs.utils.utf8.toBytes(filepdf+'.'+format);
            var aesCtr  = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(5));
            var eB      = aesCtr.encrypt(tB);
            var hasil   = aesjs.utils.hex.fromBytes(eB);
            if(format == 'pdf' ){
                fs.writeFile('./public/data/upload/' + filepdf+'.' + format, req.files.files.data, (err) => {
                    if(err){return console.log(err);}
                    var data = {
                        id          : Math.floor(Math.random() * 1000000000),
                        judul       : req.body.judul,
                        jenis       : jenis,
                        file        : hasil
                    }
                    tbKurikulum.create(data).then(done=>{
                        req.session.message = {
                            type: 'success',
                            intro: 'Berhasil !',
                            message: 'Kurikulum Berhasil ditambahkan'
                        }           
                        res.redirect('/admin/kurikulum')
                    })
                })  
            }else{
                req.session.message = {
                    type: 'error',
                    intro: 'Gagal !',
                    message: 'File Format PDF'
                } 
                res.redirect('/admin/')
            }
        }else{
            req.session.message = {
                type: 'error',
                intro: 'Gagal !',
                message: 'File Diperlukan'
            } 
            res.redirect('/admin/')
        }
        //################################################################################################
        // CLOSE KURIKULUM
    }else{
        res.redirect('/admin/')
    }
}

exports.postMenuEdit = (req,res)=>{
    var key = req.params.key
    if(key == 'buku'){  
        tbBuku.findOne({where : {id : req.params.id}}).then(dataBuku=>{
            if(dataBuku){
                if(req.files){
                    var akhire  = (req.files.gambar.mimetype);        
                    var format  = akhire.split('image/')[1]         
                    var namaGbr = req.files.gambar.md5
                    var tB      = aesjs.utils.utf8.toBytes(namaGbr+'.'+format);
                    var aesCtr  = new aesjs.ModeOfOperation.ctr(aeskey, new aesjs.Counter(5));
                    var eB      = aesCtr.encrypt(tB);
                    var hasil   = aesjs.utils.hex.fromBytes(eB);
                    
                    if(format == 'jpeg' || format == 'jpg' || format == 'png' ){ //Format gambar  
                        if(dataBuku.img != '')    {
                            decode(dataBuku.img ,1, (dataDecode)=>{
                                fs.unlinkSync('public/data/upload/'+dataDecode)
                            })  
                        }
                        fs.writeFile('./public/data/upload/' + namaGbr+'.' + format, req.files.gambar.data, (err) => {
                            if(err){return console.log(err);}
                            var data = {
                                judul       : req.body.judul,
                                pengarang   : req.body. pengarang,
                                edisi       :req.body.edisi,
                                thn_terbit  :req.body.thn_terbit,
                                penerbit    :req.body.penerbit,
                                jml         :req.body.jml,
                                rak_no      :req.body.rak_no,
                                kondisi     :req.body.kondisi,
                                img         : hasil
                            }
                            tbBuku.update(data , {where : {id : req.params.id}})
                        })  
                    }
                }else{
                  var data = {
                        judul       : req.body.judul,
                        pengarang   : req.body. pengarang,
                        edisi       :req.body.edisi,
                        thn_terbit  :req.body.thn_terbit,
                        penerbit    :req.body.penerbit,
                        jml         :req.body.jml,
                        rak_no      :req.body.rak_no,
                        kondisi     :req.body.kondisi
                    }
                    tbBuku.update(data , {where : {id : req.params.id}})
                }
                req.session.message = {
                    type: 'success',
                    intro: 'Berhasil !',
                    message: 'Buku Berhasil Diupdate'
                }           
                res.redirect('/admin/buku')
            }else{
                req.session.message = {
                    type: 'danger',
                    intro: 'ERROR !',
                    message: 'Buku tidak ditemukan'
                }           
                res.redirect('/library')
            }
        })
        
        
    }else if (key == 'anggota'){
        var data = {
            nama        :  req.body.nama,
            nosis       :  req.body.nosis,
            jenis_kelamin:  req.body.kelamin,
            tmp_lhr     : req.body.tmp_lahir,
            tgl_lhr     : req.body.tgl_lahir,
            asal_polda  : req.body.asal_polda,
            no_hp       : req.body.hp,
            alamat      : req.body.alamat
        }
        tbSiswa.findOne({where : {id : req.params.id}}).then(dataSiswa=>{
            if(dataSiswa){
                tbSiswa.update(data , {where:{id : req.params.id}}).then(done=>{
                    req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'Anggota Berhasil diupdate'
                    }           
                    res.redirect('/admin/anggota')
                })
            }else{
                req.session.message = {
                    type: 'danger',
                    intro: 'ERROR !',
                    message: 'Anggota tidak ditemukan'
                }           
                res.redirect('/library')
            }
        })
    }
    else if (key == 'kurikulum'){
        let jenis   = ''
        if(req.body.jenis == 1){
            jenis = 'DIKTUK'
        }else if(req.body.jenis == 2){
            jenis = 'DIKBANG'
        }else if(req.body.jenis == 3){
            jenis = 'PELATIHAN'
        }else{
            req.session.message = {
                type: 'error',
                intro: 'Gagal !',
                message: 'Jenis Kurikulum Tidak Tersedia'
            }       
            res.redirect('/admin/a/kurikulum/1')    
        }
        var data = {
            judul       :  req.body.judul,
            jenis       :  jenis,

        }
        tbKurikulum.findOne({where : {id : req.params.id}}).then(dataSiswa=>{
            if(dataSiswa){
                tbKurikulum.update(data , {where:{id : req.params.id}}).then(done=>{
                    req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'Kurikulem Berhasil diupdate'
                    }           
                    res.redirect('/admin/kurikulum')
                })
            }else{
                req.session.message = {
                    type: 'danger',
                    intro: 'ERROR !',
                    message: 'Anggota tidak ditemukan'
                }           
                res.redirect('/library')
            }
        })
    }else{
        res.redirect('/library')
    }
}