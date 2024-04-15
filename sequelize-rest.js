import { Sequelize, Model, DataTypes } from "sequelize";

const databaseOptions = {
    dialect: 'sqlite',
    storage: "./movie_database.sqlite",
    
  };
  

const sequelize = new Sequelize(databaseOptions);

const Movie = sequelize.define("Movie", {
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    yearOfRelease: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

sequelize.sync()
    .then( () => {
        console.log("Model created");

        Movie.create({
            title: "Prometheus",
            yearOfRelease: "2012",
            synopsis: "The discovery of a clue to mankind's origins on Earth leads a team of explorers to the darkest parts of the universe. Two brilliant young scientists lead the expedition. Shaw (Noomi Rapace) hopes that they will meet a race of benevolent, godlike beings who will in some way verify her religious beliefs, while Holloway (Logan Marshall-Green) is out to debunk any spiritual notions. However, neither the scientists nor their shipmates are prepared for the unimaginable terrors that await them."
        });

        Movie.create({
            title: "The Wolf of Wall Street",
            yearOfRelease: "2013",
            synopsis: "In 1987, Jordan Belfort (Leonardo DiCaprio) takes an entry-level job at a Wall Street brokerage firm. By the early 1990s, while still in his 20s, Belfort founds his own firm, Stratton Oakmont. Together with his trusted lieutenant (Jonah Hill) and a merry band of brokers, Belfort makes a huge fortune by defrauding wealthy investors out of millions. However, while Belfort and his cronies partake in a hedonistic brew of sex, drugs and thrills, the SEC and the FBI close in on his empire of excess."
        });

        Movie.create({
            title: "Oppenheimer",
            yearOfRelease: "2023",
            synopsis: "During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb. Their work comes to fruition on July 16, 1945, as they witness the world's first nuclear explosion, forever changing the course of history."
        });

    })
    .catch((error) => {
        console.error("Error", error);
    });

export { Movie }