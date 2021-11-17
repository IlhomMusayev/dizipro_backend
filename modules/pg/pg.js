const { Sequelize } = require("sequelize");
const CountryModel = require("../../models/CountryModel");
const init = require("./init");
const { CustomError } = require("../../helpers/CustomError");
const UserModel = require("../../models/UserModel");
const Relations = require("../../models/Relations");
const UserSessionsModel = require("../../models/UserSessionsModel");
const EmailAttempts = require("../../models/EmailAttempts");
const BanModel = require("../../models/BanModel");
const SkillModel = require("../../models/SkillModel");
const SoftwareModel = require("../../models/SoftwareModel");
const ProjectModel = require("../../models/ProjectModel");
const ProjectsSkillModel = require("../../models/ProjectsSkillModel");
const ProjectsSoftwares = require("../../models/ProjectsSoftwares");
const ProjectsFilesModel = require("../../models/ProjectsFilesModel");

if (!process.env.PG_CONNECTION_URL) {
	throw new Error("PG CONNECTION STRING NOT FOUND");
}

const sequelize = new Sequelize(process.env.PG_CONNECTION_URL, {
	logging: false,
});

module.exports = async function pg() {
	try {
		await sequelize.authenticate();

		let db = {};

		db.countries = await CountryModel(sequelize, Sequelize);
		db.users = await UserModel(sequelize, Sequelize);
		db.sessions = await UserSessionsModel(sequelize, Sequelize);
		db.attempts = await EmailAttempts(sequelize, Sequelize);
		db.user_bans = await BanModel(sequelize, Sequelize);
		db.skills = await SkillModel(sequelize, Sequelize);
		db.softwares = await SoftwareModel(sequelize, Sequelize);
		db.projects = await ProjectModel(sequelize, Sequelize);
		db.projects_skills = await ProjectsSkillModel(sequelize, Sequelize);
		db.projects_softwares = await ProjectsSoftwares(sequelize, Sequelize);
		db.projects_files = await ProjectsFilesModel(sequelize, Sequelize);
		db.sequelize = sequelize;

		await Relations(db);

		await sequelize.sync({ force: false });

		await init(db);

		return db;
	} catch (error) {
		console.log("SQL_ERROR:", error);
	}
};
