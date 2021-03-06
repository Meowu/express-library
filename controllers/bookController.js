const Book = require('../models/book');
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookinstance')

const async = require('async')

exports.index = function(req, res) {
    async.parallel({
      book_count: function(cb) {
        Book.count(cb)
      },
      book_instance_count: function(cb) {
        BookInstance.count(cb)
      },
      book_instance_available_count: function(cb) {
        BookInstance.count({status: 'Available'}, cb)
      },
      author_count: function(cb) {
        Author.count(cb)
      },
      genre_count: function(cb) {
        Genre.count(cb)
      }
    }, function(err, results) {
      res.render('index', {title: 'Local Library Home', error: err, data: results})
    })
};

// Display list of all books
exports.book_list = function(req, res) {
    Book.find({}, 'title author')
      .populate('author')
      .exec(function (err, list_books) {
        if (err) { return next(err )}
        res.render('book_list', { title: 'Book List', book_list: list_books})
      })
};

// Display detail page for a specific book
exports.book_detail = function(req, res, next) {
  async.parallel({
    book: function(cb) {

      Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(cb)
    },
    book_instance: function(cb) {
        BookInstance.find({ 'book': req.params.id })
        .exec(cb)
    }
}, function(err, results) {
    console.log(results.book);
    if (err) { return next(err)}
    res.render('book_detail', { title: 'Title', book: results.book, book_instance: results.book_instance})
  })
};

// Display book create form on GET
exports.book_create_get = function(req, res) {
    
  //Get all authors and genres, which we can use for adding to our book.
    async.parallel({
      authors: function(callback) {
          Author.find(callback);
      },
      genres: function(callback) {
          Genre.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

// Handle book create on POST
exports.book_create_post = function(req, res) {
    console.log(req.body);
  req.checkBody('title', 'Title must not be empty.').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
  
  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('summary').escape();
  req.sanitize('isbn').escape();
  req.sanitize('title').trim();     
  req.sanitize('author').trim();
  req.sanitize('summary').trim();
  req.sanitize('isbn').trim();
//   req.sanitize('genre').escape();
  
  console.log('Body: ', req.body);
  var book = new Book({
      title: req.body.title, 
      author: req.body.author, 
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre
  });
  console.log('BOOK: ',  book);
  
  var errors = req.validationErrors();
  if (errors) {
      // Some problems so we need to re-render our book

      //Get all authors and genres for form
      async.parallel({
          authors: function(callback) {
              Author.find(callback);
          },
          genres: function(callback) {
              Genre.find(callback);
          },
      }, function(err, results) {
          if (err) { return next(err); }
          
          // Mark our selected genres as checked
          for (i = 0; i < results.genres.length; i++) {
              if (book.genre.indexOf(results.genres[i]._id) > -1) {
                  //Current genre is selected. Set "checked" flag.
                  results.genres[i].checked='true';
              }
          }

          res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors });
      });

  } 
  else {
  // Data from form is valid.
  // We could check if book exists already, but lets just save.
  
      book.save(function (err) {
          if (err) { return next(err); }
          //successful - redirect to new book record.
          res.redirect(book.url);
      });
  }
};

// Display book delete form on GET
exports.book_delete_get = function(req, res) {
    async.parallel({
        books: function(cb) {
            Book.findById(req.params.id).exec(cb)
        },
        book_instances: function(cb) {
            BookInstance.find({'book': req.params.id}).populate('book').exec(cb)
        }
    }, function(err, results) {
        if (err) return next(err)
        console.log(results)
        res.render('book_delete', { title: 'Book Delete', books: results.books, book_instances: results.book_instances })
    })
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
    req.checkBody('bookid', 'Book id must exist.').notEmpty()
    async.parallel({
        books: function(cb) {
            Book.findById(req.body.bookid).exec(cb)
        },
        book_instances: function(cb) {
            BookInstance.find({'book': req.body.bookid}).exec(cb)
        }
    }, function(err, results) {
        if (err) return next(err)
        if (results.book_instances.length > 0) {
            res.render('book_delete', { title: 'Book Delete', books: results.books, book_instances: results.book_instances })
            return 
        } else {
            Book.findByIdAndRemove(req.body.bookid, function(err) {
                if (err) return next(err)
                res.redirect('/catalog/books')
            })
        }

    })
};

// Display book update form on GET
exports.book_update_get = function(req, res) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  //Get book, authors and genres for form
  async.parallel({
      book: function(callback) {
          Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      authors: function(callback) {
          Author.find(callback);
      },
      genres: function(callback) {
          Genre.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
          
      // Mark our selected genres as checked
      for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
          for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
              if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
                  results.genres[all_g_iter].checked='true';
              }
          }
      }
      res.render('book_form', { title: 'Update Book', authors:results.authors, genres:results.genres, book: results.book });
  });
};

// Handle book update on POST
exports.book_update_post = function(req, res) {
    //Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    console.log(req.body.genre)
    console.log(Object.prototype.toString.call(req.body.genre))
    //Check other data
    req.checkBody('title', 'Title must not be empty.').notEmpty();
    req.checkBody('author', 'Author must not be empty').notEmpty();
    req.checkBody('summary', 'Summary must not be empty').notEmpty();
    req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
    
    req.sanitize('title').escape();
    req.sanitize('author').escape();
    req.sanitize('summary').escape();
    req.sanitize('isbn').escape();
    req.sanitize('title').trim();
    req.sanitize('author').trim(); 
    req.sanitize('summary').trim();
    req.sanitize('isbn').trim();
    // 出错，validator.js只验证字符串，genre是数组。
    // req.sanitize('genre').escape();
    
    var book = new Book(
      { title: req.body.title, 
        author: req.body.author, 
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
        _id:req.params.id //This is required, or a new ID will be assigned!
       });
    
       var errors = req.validationErrors();
       console.log(errors)
    if (errors) {
        // Re-render book with error information
        // Get all authors and genres for form
        async.parallel({
            authors: function(callback) {
                Author.find(callback);
            },
            genres: function(callback) {
                Genre.find(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
            
            // Mark our selected genres as checked
            for (let i = 0; i < results.genres.length; i++) {
                if (book.genre.indexOf(results.genres[i]._id) > -1) {
                    results.genres[i].checked='true';
                }
            }
            res.render('book_form', { title: 'Update Book',authors:results.authors, genres:results.genres, book: book, errors: errors });
        });

    } 
    else {
        // Data from form is valid. Update the record.
        Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
            if (err) { return next(err); }
            //successful - redirect to book detail page.
            res.redirect(thebook.url);
        });
    }
};