var Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const mongoose = require('mongoose')

// Display list of all Genre
exports.genre_list = function(req, res) {
  Genre.find()
  .sort({name: 'asc'})
  .exec((err, list_genres) => {
      if (err) { return next(err)}
      res.render('genre_list', {title: 'Genre List', genre_list: list_genres})
  })  
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res, next) {
  const id = mongoose.Types.ObjectId(req.params.id.trim())
  async.parallel({
      genre: function(cb) {
          Genre.findById(id).exec(cb)
      },

      genre_books: function(cb) {
          Book.find({ 'genre': id }).exec(cb)
      }
  }, function(err, results) {
      if (err) { return next(err)}
      res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books })
  })
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre'})
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {
    // name不能为空
    req.checkBody('name', 'Genre name required').notEmpty()
    // 对name字段进行转义并且去掉首尾空白
    req.sanitize('name').escape()
    req.sanitize('name').trim()

    const errors = req.validationErrors()
   
    // 新建一个genre文档
    const genre = new Genre({
        name: req.body.name
    })

    if (errors) {
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors})
        return 
    } else {
        // 表单提交的数据合法，然后检查是否存在同名类型
        Genre.findOne({ 'name': req.body.name })
        .exec( function(err, found_genre) {
            console.log('found_genre: ' + found_genre)
            if (err) { return next(err) }
            if (found_genre) {
                res.redirect(found_genre.url)
            } else {
                genre.save(function (err) {
                    if (err) { return next(err)}
                    // 保存新genre然后重定向到其详情页
                    res.redirect(genre.url)
                })
            }
        })
    }
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {
  async.parallel({
      genre: function(cb) {
          Genre.findById(req.params.id).exec(cb)
      },
      books: function(cb) {
          Book.find({'genre': req.params.id}).exec(cb)
      }
  }, function(err, results) {
      if (err) return next(err)
      console.log(results)
      res.render('genre_delete', {title: 'Delete Genre', genre: results.genre, books: results.books})
  })
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res, next) {
    req.checkBody('genreid', 'Genre id must exist.').notEmpty()

    async.parallel({
        genre: function(cb) {
            Genre.findById(req.body.genreid).exec(cb)
        },
        books: function(cb) {
            Book.find({'genre': req.body.genreid}).exec(cb)
        }
    }, function(err, results) {
        if (err) return next(err)
        if (results.books.length > 0) {
            res.render('genre_delete', {title: 'Delete Genre', genre: genre, books: results.books})
            return
        } else {
            Genre.findByIdAndRemove(req.body.genreid).exec(function (err) {
                if (err) return next(err)
                res.redirect('/catalog/genres')
            })
        }
    })
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res, next) {
    req.sanitize('id').escape()
    req.sanitize('id').trim()

    Genre.findById(req.params.id, function(err, result) {
        if (err) return next(err)
        res.render('genre_form', { title: 'update Genre', genre: result})
    })
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    req.checkBody('name', 'Genre name are required.').notEmpty()
    
    req.sanitize('id').trim()
    req.sanitize('id').escape()

    const errors = req.validationErrors()

    const genre = new Genre({
        name: req.body.name,
        _id: req.params.id
    })
    if (errors) {
        res.render('genre_form', {title: 'Update Genre', genre: genre, errors: errors})
    } else {
        Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, newgenre) {
            if (err) return next(err)
            res.redirect(newgenre.url)
        })
    }
    // res.send('NOT IMPLEMENTED: Genre update POST');
};