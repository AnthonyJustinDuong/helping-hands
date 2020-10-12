"use strict";

const log = console.log;
const localServerPort = 5000;
const localReactPort = 3000;

// express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// cors
// allows cross-origin resource sharing
const cors = require("cors");
// Set up a whitelist and check against it:
// var whitelist = ['http://localhost:' + localServerPort, 'http://localhost:' + localReactPort]
// var corsOptions = {
//   origin: function (origin, callback) {
//     // console.log(origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       console.log(origin);
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// Then pass them to cors:
app.use(cors());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// socket for chat
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// import mongoose models
const { ObjectID } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { ChatRoom } = require("./models/chat");
const { Post } = require("./models/post");
const { Report } = require("./models/report");
const { User } = require("./models/user");
const { Leaderboard } = require("./models/leaderboard");
const { Image } = require("./models/image");

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "devx1ahir",
  api_key: "455765164581714",
  api_secret: "BdbC_0mDf2bYmmPx_d5FvATMgTM",
});


// Our own express middleware to check for
// an active user on the session cookie (indicating a logged in user.)
// const sessionChecker = (req, res, next) => {
//     if (req.session.user) {
//         res.redirect('/dashboard'); // redirect to dashboard if logged in.
//     } else {
//         next(); // next() moves on to the route.
//     }
// };

// middleware for mongo connection error
const mongoChecker = (req, res, next) => {
  // Check mongoose connection established
  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal Server Error");
    return;
  } else {
    next();
  }
};

function isMongoError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

// ===== Session-Handling =====
// Create a session cookie
app.use(
  session({
    secret: "oursecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 20 * 60000,
      httpOnly: true,
    },
  })
);

// Login user
app.post("/users/login", mongoChecker, (req, res) => {
  const { username, password } = req.body;

  User.findByUsernamePassword(username, password)
    .then((user) => {
      req.session.user = user._id;
      // req.session.admin = user._id;
      // console.log(req.session);
      res.status(200).send({ currentUser: user });
    })
    .catch((error) => {
      res.status(400).send("Bad Request");
    });
});

// Logout user
app.get("/users/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// Middleware for authentication of resources
// Stolen from Prof. Mark
const authenticate = (req, res, next) => {
  // TEMPORARY: Skip authenticate on development server
  // Problem cannot get authentication with React development server!
  if (!process.env.PORT) { // Not on Heroku
    next();
    // console.log(req.session);
    return;
  }

  if (req.session.user) {
    User.findById(req.session.user)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        res.status(401).send("Unauthorized");
      });
  } else {
    res.status(401).send("Unauthorized");
  }
};

// ===== Chat Room Routes =====
// route for new chat room
app.post("/chatrooms", mongoChecker, authenticate, (req, res) => {
  // Validate the id
  if (
    !ObjectID.isValid(req.body.creator) ||
    !ObjectID.isValid(req.body.otherChatter)
  ) {
    res.status(404).send();
    return;
  }
  // User cannot chat with self
  if (req.body.creator === req.body.otherChatter) {
    res.status(400).send("Bad Request");
    return;
  }

  // Create a new chat room
  const chatRoom = new ChatRoom({
    creator: req.body.creator,
    otherChatter: req.body.otherChatter,
    log: [],
  });

  // Save the chat
  chatRoom.save().then(async (result) => {
    // Add chat rooms to the user's lists
    await User.findById(result.creator)
			.then((creator) => {
				creator.chatRooms.push(result._id);
				creator.save();
			})
    await User.findById(result.otherChatter)
		.then((other) => {
			other.chatRooms.push(result._id);
			other.save();
		})
      res.send(result);
    })
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// route to get all messages in a chat room
app.get("/chatrooms/:id", mongoChecker, authenticate, (req, res) => {
  const id = req.params.id;

  // Validate the id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Not Found");
    return;
  }

  // If id valid, findById
  ChatRoom.findById(id)
    .then((chatRoom) => {
      if (!chatRoom) {
        res.status(404).send("Not Found");
      } else {
        res.send(chatRoom);
      }
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// route to send message to a chat room
app.post("/chatrooms/:id", mongoChecker, authenticate, (req, res) => {
  const id = req.params.id;

  // validate the id
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  // create new message
  const message = {
    sender: req.body.sender,
    content: req.body.content,
    date: req.body.date,
  };

  // find the chat id
  ChatRoom.findById(id)
    .then((chatRoom) => {
      if (!chatRoom) {
        res.status(404).send("Not Found");
      } else {
        chatRoom.log.push(message);
        chatRoom.save();
				res.send({
          message: message,
          chatRoom: chatRoom,
        });
      }
    })
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// ===== POSTS =====
// route to new post
app.post("/posts", mongoChecker, authenticate, (req, res) => {
  const post = new Post({
    author: req.body.author,
    date: req.body.date,
    status: req.body.status,
    content: req.body.content,
  });
  post
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// route to get all posts
app.get("/posts", mongoChecker, (req, res) => {
  Post.find()
    .then((posts) => {
      res.send(posts);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to get fulfilled posts
app.get("/posts/fulfilled", mongoChecker, (req, res) => {
  Post.find({ status: true })
    .then((posts) => {
      res.send(posts);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to get unfulfilled posts
app.get("/posts/unfulfilled", mongoChecker, (req, res) => {
  Post.find({ status: false })
    .then((posts) => {
      res.send(posts);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to get a users's posts
app.get("/posts/user/:id", mongoChecker, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Post.find({ author: req.params.id })
    .then((posts) => {
      res.send(posts);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to get a particular post
app.get("/posts/:id", mongoChecker, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.send(post);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to delete a particular post
app.delete("/posts/:id", mongoChecker, authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      if (post) {
        res.send(post);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route for modifying a post
app.patch("/posts/:id", mongoChecker, authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        post.status = req.body.status;
        post.save();
        res.send({
          post: post,
        });
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// ===== Report Routes =====
// new report route
app.post("/reports", mongoChecker, (req, res) => {
  const report = new Report({
    author: req.body.author,
    post: req.body.post,
    content: req.body.content,
  });
  report
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// route to get all reports
app.get("/reports", mongoChecker, authenticate, (req, res) => {
  Report.find()
    .then((reports) => {
      res.send(reports);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route to get a specific report
app.get("/reports/:id", mongoChecker, authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Report.findById(req.params.id)
    .then((report) => {
      if (report) {
        res.send(report);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/reports/user/:id", mongoChecker, authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Report.find({ author: req.params.id })
    .then((reports) => {
      res.send(reports);
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// route for deleting a report
app.delete("/reports/:id", mongoChecker, authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Bad Request");
    return;
  }

  Report.findByIdAndDelete(req.params.id)
    .then((report) => {
      if (report) {
        res.send(report);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((e) => {
      log(e);
      res.status(500).send("Internal Server Error");
    });
});

// ===== User Routes =====
// GET user by id
app.get("/users/:id", mongoChecker, (req, res) => {
  const id = req.params.id;
  const projection = req.query.projection;

  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Not Found");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// POST user
app.post("/users", mongoChecker, (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    name: {
      first: req.body.firstName,
      last: req.body.lastName,
    },
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: {
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      province: req.body.province,
    },
    location: { lat: req.body.location.lat, lng: req.body.location.lng },
  });

  user
    .save()
    .then(
      (result) => {
        res.status(200).send(result);
      },
      (error) => {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    )
    .catch((error) => {
      if (isMongoError(error)) {
        res.status(500).send("Internal Server Error");
      } else {
        res.status(400).send("Bad Request");
      }
    });
});

// GET see if user property is unique
app.get("/users/unique-username/:username", mongoChecker, (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
    .then((user) => {
      if (!user) res.send({ username, status: "unique" });
      else res.send({ username, status: "taken" });
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// GET see if user property is unique
app.get("/users/unique-email/:email", mongoChecker, (req, res) => {
  const email = req.params.email;
  User.findOne({ email })
    .then((user) => {
      if (!user) res.send({ email, status: "unique" });
      else res.send({ email, status: "taken" });
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// PATCH user
app.patch("/users/:id", mongoChecker, authenticate, (req, res) => {
  const id = req.params.id;
  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Not Found");
    return;
  }

  User.findByIdAndUpdate(id, req.body, {new: true, useFindAndModify: false}).then((user) => {
	if (!user) {
	  res.status(404).send("Not Found");
	}
	else {
	  res.status(200).send(user);
	}
  })
	.catch((error) => {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error");
		} else {
			res.status(400).send("Bad Request");
		}
	});
});

// POST bookmark to user
app.post("/users/:id/bookmarked", mongoChecker, authenticate, (req, res) => {
	const id = req.params.id;

	// Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Not Found");
    return;
  }

  User.findById(id)
		.then((user) => {
			if (!user) {
			  res.status(404).send("Not Found");
			}
			else {
				user.bookmarked.push(req.body.post);
				user.save()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((error) => {
					if (isMongoError(error)) {
						res.status(500).send("Internal Server Error");
					} else {
						res.status(400).send("Bad Request");
					}
				});
			}
	  })
		.catch((error) => {
			res.status(500).send("Internal Server Error");
		});
});

// Delete bookmark from user
app.delete("/users/:id/bookmarked", mongoChecker, authenticate, (req, res) => {
	const id = req.params.id;

	// Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Not Found");
    return;
  }

  User.findById(id)
		.then((user) => {
			if (!user) {
			  res.status(404).send("Not Found");
			}
			else {
				const i = user.bookmarked.indexOf(postId);
				user.bookmarked.splice(i, 1);
				user.save()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((error) => {
					if (isMongoError(error)) {
						res.status(500).send("Internal Server Error");
					} else {
						res.status(400).send("Bad Request");
					}
				});
			}
	  })
		.catch((error) => {
			res.status(500).send("Internal Server Error");
		});
});

// ===== leaderboard Routes =====
// GET leaderboard by city
app.get("/leaderboards/:city", (req, res) => {
  const city = req.params.city;

  User.find({"address.city": city.toString()}, "points name avatar address")
    .then((users) => {
      if (!users) {
        res.status(404).send("Not Found");
      } else {
        res.status(200).send(users);
      }
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// POST leaderboard
// route to add a new leaderboard
app.post("/leaderboards", (req, res) => {
  // create a leaderboard
  const leaderboard = new Leaderboard({
    city: req.body.city,
    leaders: [],
  });
  // save the leaderboard to the database
  leaderboard.save().then(
    (result) => {
      res.send(result);
    },
    (error) => {
      res.status(400).send(error);
    }
  );
});

// POST leader
// route to add new leader to a given city
app.post("/leaderboards/:city", (req, res) => {
  const city = req.params.city;

  // new leader
  const leader = {
    rank: req.body.rank,
    name: req.body.name,
    points: req.body.points,
  };

  // find city
  Leaderboard.findById(city)
    .then((leaderboard) => {
      if (!leaderboard) {
        res.status(404).send("Not Found");
      } else {
        leaderboard.leaders.push(leader);
        leaderboard.save();

        // returned json
        res.send({
          leader: leader,
          leaderboard: leaderboard,
        });
      }
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// PATCH leader
// route for modifying a leader within a leaderboard
app.patch("/leaderboards/:city/:leader", (req, res) => {
  const city = req.params.city;
  const leader = req.params.leader;

  // find the leaderboard with given city
  Leaderboard.findById(city)
    .then((leaderboard) => {
      if (!leaderboard) {
        res.status(404).send("Resource not found");
      } else {
        // edit the leader
        const edit = leaderboard.leaders.id(leader);
        edit.rank = req.body.rank;
        edit.name = req.body.name;
        edit.points = req.body.points;
        leaderboard.save();

        res.send({
          leader: edit,
          leaderboard: leaderboard,
        });
      }
    })
    // server error
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});

// image API routes
// post a new image
app.post("/images/:user", multipartMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.files.image.path, // req.files contains uploaded files
    (result) => {
      const image = new Image({
        image_id: result.public_id, // image id on cloudinary server
        image_url: result.url, // image url on cloudinary server
        created_at: new Date(),
        user: req.params.user
      });
      image
        .save()
        .then((result) => {
          res.send(result);
        })
        .catch((e) => {
          if (isMongoError(error)) {
            res.status(500).send("Internal server error");
          } else {
            res.status(400).send("Bad request");
          }
        });
    }
  );
});

// get an image by id
app.get("/images/:user", (req, res) => {
  Image.find({user: req.params.user}).then(
    (image) => {
      res.send(image);
    },
    (e) => {
      res.status(500).send(e);
    }
  );
});

// For direct chat
io.on("connection", (socket) => {
  socket.on("join", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("message", (pkg) => {
    io.to(pkg.chatId).emit("message", pkg.message);
  });
});

// Serve the build
app.use(express.static(__dirname + "/helping_hands/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  const goodPageRoutes = [
    "/",
    "/help-needed",
    "/login",
    "sign-up",
    "/profile",
    "/messages",
    "/review-board",
  ];
  if (!goodPageRoutes.includes(req.url)) {
    // if url not in expected page routes, set status to 404.
    res.status(404);
  }

  // send index.html
  res.sendFile(__dirname + "/helping_hands/build/index.html");
});

const port = process.env.PORT || localServerPort;
http.listen(port, () => {
  log(`Listening on port ${port}...`);
});
