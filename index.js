import express from "express";
import bodyParser from "body-parser";
import { Movie } from "./sequelize-rest.js";

const app = express();
const PORT = 3000

app.use(bodyParser.json());

// request limiting middleware 

const rateLimit = (limit, windowMs) => {
    let requests = 0;
    let startTime = Date.now();

    return (req, res, next) => {
        const currentTime = Date.now();

        // reset request count after a certain timewindow has passed
        if (currentTime - startTime > windowMs) {
            startTime = currentTime;
            requests = 0;
        }

        
        requests++;

        // check if request count is greater than the limit. 
        if (requests > limit) {
            res.status(429).json({ message: "Too many requests" });
        } else {
            next();
        }
    };
};

// set the rateLimit to 5 and the time window to one minute in milliseconds
app.post("/messages", rateLimit(5, 60000), (req, res) => {

    // created variable for the request body
    const userInput = req.body;
    
    console.log(userInput)

    /* validate user input by checking every key value pair in the request body.
    It makes sure that no key or value is just an empty string or 
    only contains whitespace using trimming for both keys and values. */
    const validateData = Object.entries(req.body).every(([key, value]) => key.trim() !== "" && value.trim() !== "");

    // if the request body contains no valid data return status code 400 and message "Bad request"
    if (!validateData) {
        res.status(400).json({
            "message": "Bad request"
        })
    }
    // return status code 200 
    res.status(200).json({
        message: "Message received loud and clear"
    });

});

app.get("/movies", rateLimit(5, 6000), (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    Movie.findAndCountAll({
        limit,
        offset
    })
        .then(({rows, count}) => {
            res.json({
                data: rows,
                total: count
            });
        })
        .catch(next);
});

// get a single movie by id
app.get("/movies/:id", rateLimit(5, 60000), (req, res, next) => {
    Movie.findByPk(req.params.id)
      .then((movie) => {
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      })
      .catch(next);
  });
  
  // create a new movie
  app.post("/movies", rateLimit(5, 60000), (req, res, next) => {
    Movie.create(req.body)
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch(next);
  });
  
  // update an existing movie
  app.put("/movies/:id", rateLimit(5, 60000), (req, res, next) => {
    Movie.findByPk(req.params.id)
      .then((movie) => {
        if (movie) {
          return movie.update(req.body);
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      })
      .then((updatedMovie) => {
        res.json(updatedMovie);
      })
      .catch(next);
  });
  
  // delete a movie
  app.delete("/movies/:id", rateLimit(5, 60000), (req, res, next) => {
    Movie.findByPk(req.params.id)
      .then((movie) => {
        if (movie) {
          return movie.destroy();
        } else {
          res.status(404).json({ error: "Movie not found" });
        }
      })
      .then(() => {
        res.json({ message: "Movie deleted" });
      })
      .catch(next);
  });
  
  // middleware to handle errors by logging and sending a json respose with a message. 
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

