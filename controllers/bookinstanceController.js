var BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const async = require("async");

// Display list of all BookInstances
exports.bookinstance_list = function(req, res) {
  BookInstance.find()
    .populate("book")
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances
      });
    });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function(err, bookinstance) {
      if (err) {
        return next(err);
      }
      res.render("bookinstance_detail", {
        title: "Book",
        bookinstance: bookinstance
      });
    });
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, "title").exec(function(err, books) {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books
    });
  });
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {
  req.checkBody("book", "Book must be specified").notEmpty(); //We won't force Alphanumeric, because book titles might have spaces.
  req.checkBody("imprint", "Imprint must be specified").notEmpty();
  req.checkBody("due_back", "Invalid date").optional({ checkFalsy: true });

  req.sanitize("book").escape();
  req.sanitize("imprint").escape();
  req.sanitize("status").escape();
  req.sanitize("book").trim();
  req.sanitize("imprint").trim();
  req.sanitize("status").trim();
  req.sanitize("due_back").toDate();

  var bookinstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    due_back: req.body.due_back
  });

  var errors = req.validationErrors();
  if (errors) {
    Book.find({}, "title").exec(function(err, books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: books,
        selected_book: bookinstance.book._id,
        errors: errors,
        bookinstance: bookinstance
      });
    });
    return;
  } else {
    // Data from form is valid

    bookinstance.save(function(err) {
      if (err) {
        return next(err);
      }
      //successful - redirect to new book-instance record.
      res.redirect(bookinstance.url);
    });
  }
};

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec(function(err, result) {
      if (err) return next(err);
      res.render("bookinstance_delete", {
        title: "Delete Bookinstance",
        instance: result
      });
    });
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
  req
    .checkBody("bookinstanceid", "BookinstanceId must be specified.")
    .notEmpty();

  BookInstance.findByIdAndRemove(req.body.bookinstanceid).exec(function(err) {
    if (err) return next(err);
    res.redirect("/catalog/bookinstances");
  });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next) {
  req.sanitize("id").escape();
  req.sanitize("id").trim();

  async.parallel(
    {
      books: function(cb) {
        Book.find({}, "title").exec(cb);
      },
      instance: function(cb) {
        BookInstance.findById(req.params.id).exec(cb);
      }
    },
    function(err, results) {
      if (err) return next(err);
      res.render("bookinstance_form", {
        title: "Update Bookinstance",
        book_list: results.books,
        bookinstance: results.instance
      });
    }
  );
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res, next) {
  req.checkBody("book", "Book must be specified").notEmpty();
  req.checkBody("status", "Status must be specified").notEmpty();
  req.checkBody("imprint", "Imprint are required.").notEmpty();

  req.checkBody("due_back", "Invalid date.").optional({ checkFalsy: true });

  req.sanitize("book").trim();
  req.sanitize("status").trim();
  req.sanitize("imprint").trim();

  req.sanitize("book").trim();
  req.sanitize("imprint").trim();
  req.sanitize("status").trim();

  req.sanitize("due_back").toDate();
  req.sanitize("id").escape();
  req.sanitize("id").trim();

  const errors = req.validationErrors();
  const bookinstance = new BookInstance({
    book: req.body.book,
    status: req.body.status,
    imprint: req.body.imprint,
    due_back: req.body.due_back,
    _id: req.params.id
  });

  if (errors) {
    Book.find({}, 'title', function(err, results) {
      if (err) return next(err);
      res.render("bookinstance_form", {
        title: "Update Bookinstance",
        book_list: results,
        bookinstance: bookinstance,
        errors: errors
      });
    });
  } else {
      BookInstance.findByIdAndUpdate(req.params
    .id, bookinstance, {}, function(err, newinstance) {
        if (err) return next(err)
        res.redirect(newinstance.url)
    })
  }
};
