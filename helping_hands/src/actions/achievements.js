import {getUserById} from './user.js';
const achievements = [
	{
		achievId: 0,
		name: "Hello world!",
		description: "Welcome to Helping Hands!",
		icon: "waving.png",
	},
	{
		achievId: 1,
		name: "Made a post",
		description: "This user made their first request.",
		icon: "post.png",
	},
	{
		achievId: 2,
		name: "Head Honcho",
		description: "This user is one of the developers of the site!",
		icon: "admin.png",
	}
];

export const getAchiev = (achievId) => {
  if (0 > achievId || achievId > achievements.length) {
    console.log("invalid achievmement id");
    return null;
  }
  return achievements[achievId];
};

export const getAchievements = userId => {
	return getUserById(userId, "achievements")
	.then(user => user.achievements.map(getAchiev));
};
