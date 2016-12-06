var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

// commit
var config = {
    user: 'sravani-m16',
    database: 'sravani-m16',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
    var title = data.title;
    var subtitle = data.subtitle;
    var date = data.date;
    var heading = data.heading;
    var authir = data.author;
    var content = data.content;
    var backgroundimage = data.backgroundimage;
    
    var htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>${title}</title>

    <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>

    <!-- Plugin CSS -->
    <link href="vendor/magnific-popup/magnific-popup.css" rel="stylesheet">

    <!-- Theme CSS -->
    <link href="css/creative.min.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body id="page-top">

    <nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span> Menu <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand page-scroll" href="#page-top">Start Bootstrap</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a class="page-scroll" href="index.html">Home</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="about.html">About</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="article.html">Articles</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>

    <header>
        <div class="header-content">
            <div class="header-content-inner">
                <h1 class="homeHeading">${heading}</h1>
                <h2 class="subheading">${subtitle}</h2>
                <span class="meta">Posted by  <a href="#">${author}</a> on ${date.toDateString()}</span>
            </div>
        </div>
    </header>

    <section class="bg-primary" id="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 text-center">
                    <a href="about.html">${content}</a>
                </div>
            </div>
        </div>
    </section>

    <section id="articles">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2 class="section-heading">Articles</h2>
                    <hr class="primary">
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <a href="articles.html">
                ${content}
                </a>
            </div>
        </div>
    </section>

    <section id="contact">
        <div class="container">
            <ul class="list-inline text-center">
                        <li>
                            <a href="https://twitter.com/aniket_aditya">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/aniket.aditya">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/aniketaditya">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                    </ul>
        </div>
    </section>

    <!-- jQuery -->
    <script src="vendor/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>

    <!-- Plugin JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
    <script src="vendor/scrollreveal/scrollreveal.min.js"></script>
    <script src="vendor/magnific-popup/jquery.magnific-popup.min.js"></script>

    <!-- Theme JavaScript -->
    <script src="js/creative.min.js"></script>

</body>

</html>

    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM articles ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM articles, comment, "user" WHERE articles.title = $1 AND articles.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from articles where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});


var counter = 0;
app.get('/counter',function(req,res){
    counter = counter+1;
   res.send(counter.toString()); 
});


app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM articles WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

app.get('/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/article.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});

app.get('/index.html', function(req, res){
   res.sendFile(path.join(__dirname, 'ui','index.html')); 
});

app.get('/about.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/contact.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

app.get('/css/creative.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'creative.css'));
});

app.get('/css/creative.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'creative.min.css'));
});

/*app.get('/js/contact_me.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/js', 'contact_me.js'));
});

app.get('/mail/contact_me.php', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/mail', 'contact_me.php'));
});*/

app.get('/js/creative.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/js', 'creative.js'));
});

app.get('/js/creative.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/js', 'creative.min.js'));
});


app.get('/vendor/bootstrap/css/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/css', 'bootstrap.css'));
});

app.get('/vendor/bootstrap/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/css', 'bootstrap.min.css'));
});

app.get('/vendor/bootstrap/js/bootstrap.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/js', 'bootstrap.js'));
});

app.get('/vendor/bootstrap/js/bootstrap.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/js', 'bootstrap.min.js'));
});

app.get('/vendor/font-awesome/css/font-awesome.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/css', 'font-awesome.css'));
});

app.get('/vendor/font-awesome/css/font-awesome.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/css', 'font-awesome.min.css'));
});

app.get('/vendor/jquery/jquery.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/jquery', 'jquery.js'));
});

app.get('/vendor/jquery/jquery.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/jquery', 'jquery.min.js'));
});

app.get('/vendor/magnific-popup/jquery.magnific-popup.js', function(req, res) {
   res.sendFile(path.join(__dirname, 'ui/vendor/magnific-popup', 'jquery.magnific-popup.js')); 
});

app.get('/vendor/magnific-popup/jquery.magnific-popup.min.js', function(req, res) {
   res.sendFile(path.join(__dirname, 'ui/vendor/magnific-popup', 'jquery.magnific-popup.min.js')); 
});

app.get('/vendor/magnific-popup/magnific-popup.css', function(req, res) {
   res.sendFile(path.join(__dirname, 'ui/vendor/magnific-popup', 'magnific-popup.css')); 
});

app.get('/vendor/scrollreveal/scrollreveal.js', function(req, res) {
   res.sendFile(path.join(__dirname, 'ui/vendor/scrollreveal', 'scrollreveal.js')); 
});

app.get('/vendor/scrollreveal/scrollreveal.min.js', function(req, res) {
   res.sendFile(path.join(__dirname, 'ui/vendor/scrollreveal', 'scrollreveal.min.js')); 
});

app.get('/img/about-bg.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'about-bg.jpg'));
});

app.get('/img/contact.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'contact.jpg'));
});

app.get('/img/header.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'header.jpg'));
});

app.get('/img/IMG-20151127-WA0010.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'IMG-20151127-WA0010.jpg'));
});

app.get('/img/cloudcomputing.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'cloudcomputing.jpg'));
});

app.get('/img/contact_me.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'contact_me.jpg'));
});

app.get('/img/javascript1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'javascript1.jpg'));
});

app.get('/img/web_security.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img', 'web_security'));
});

app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/fonts/', 'glyphicons-halflings.ttf'));
});

app.get('/vendor/bootstrap/fonts/glyphicons-halflings-regular.svg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/bootstrap/fonts/', 'glyphicons-halflings.svg'));
});

app.get('/vendor/font-awesome/fonts/fontawesome-webfont.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/fonts' , 'fontawesome-webfont.ttf'));
});

app.get('/vendor/font-awesome/fonts/fontawesome-webfont.woff', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/fonts' , 'fontawesome-webfont.woff'));
});
  app.get('/vendor/font-awesome/fonts/fontawesome-webfont.woff2', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/vendor/font-awesome/fonts' , 'fontawesome-webfont.woff2'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
