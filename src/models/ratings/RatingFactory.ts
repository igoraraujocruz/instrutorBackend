
import { UserRepository } from "../users/UserRepository";
import { Controller } from "./Controller";
import { RatingRepository } from "./RatingRepository";
import { Create } from "./Services/Create";

const ratingRepository = new RatingRepository();
const userRepository = new UserRepository();

const createRating = new Create(ratingRepository,userRepository);

export const ratingController = new Controller(
 createRating,
);
